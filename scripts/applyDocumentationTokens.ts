// A script to create documentation layers using a template layer
// that contains text layers named after the available token keys

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

console.log(figma.root.getSharedPluginDataKeys("tokens"))

// Current selection
const {selection} = figma.currentPage;
const element = selection[0]
// Asuming your layer name follows
// convention [SetName].[TokenType]
// For example global.colors
const layerName = element.name.split(/[.\-=/_]/)
const set = toCamel(layerName[0])
const tokenType = toCamel(layerName[1])

// Extract only tokens we need
// based on template layer name
const tokenKeys:TokenObject[] = tokens[set].filter(( token => token.type === tokenType))

// A function to apply Tokens
const applyTokens = (el:SceneNode, token:TokenObject) => {
	if ("children" in el) {
			const labels = el.findAllWithCriteria({ types: ["TEXT"]})
			const keys = labels.forEach((label, i) => {
				const property = toCamel(label.name)
				console.log(property)
					label.setSharedPluginData
					("tokens", property, `"${token.name}"`)
				console.log(label.getSharedPluginDataKeys("tokens"))
			}
			)
		}
}

// Do this for every token we have
tokenKeys.forEach((tokenKey, i) => {
	if ("mainComponent" in element && element.mainComponent) {
		// Duplicate our template layer
		const newInstance = element.mainComponent.createInstance();
		newInstance.x = element.x
		newInstance.y = (element.height + 24) * i;
		// Rename layer to match token name
		newInstance.name = `${set}.${tokenKey.name}`
		// Apply tokens to texts
		applyTokens(newInstance, tokenKey)
	}
})

// We can now remove our template
element.remove()


// Available token keys are the following:
// - tokenName
// - description
// - tokenValue
// - value
// So your text layers should match these
