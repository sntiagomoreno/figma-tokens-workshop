// A script to add documentation tokens to color swatch components
// after adding the necessary text layers

// Just making sure we type the token object we receive from Figma Tokens
interface TokenObject {
	value: string,
	type: string,
	name: string,
}

interface StoredTokensObject {
	[key: string]: TokenObject[]
}

//A function to serialize strings to Camel Case to match the token keys provided by Figma Tokens
// This allows you to name your text layers in title case
const toCamel = (text:string) => {
	return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

// Get values from Figma Tokens
const tokens:StoredTokensObject = JSON.parse(figma.root.getSharedPluginData("tokens", "values"))

const colorKeys:TokenObject[][] = []

// Extract only color tokens
Object.entries(tokens).forEach(([key, value]) => {
	const filteredValues = tokens[key].filter(token => token.type === "color")
  // Push it to the empty array
	colorKeys.push(filteredValues)
})

const { selection } = figma.currentPage

selection.forEach(node => {
	const layerName = node.name.split(/[.\-=/_]/)
	const tokenValue = colorKeys.flat().find(colorKey => {
		const tokenName = colorKey.name.split(".")
		if (colorKey.name.startsWith("color")) {
			return tokenName[1] === layerName[0] && tokenName[2] === layerName[1]
		} else {
			return tokenName[0] === layerName[0] && tokenName[1] === layerName[1]
		}
	})
	if (tokenValue && "children" in node) {
		const labels = node.findAllWithCriteria({ types: ["TEXT"] });
		if (labels.length) {
			const keys = labels.forEach((label, i) => {
				const property = toCamel(label.name)
				label.setSharedPluginData("tokens", property, `"${tokenValue.name}"`)
				console.log(label.getSharedPluginDataKeys("tokens"))
			})
		}
	}
})

figma.notify("Tokens applied! update your layers in the Figma Tokens plugin.")
