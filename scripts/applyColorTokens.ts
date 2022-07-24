// A script to apply existing Figma Tokens to their corresponding Color Swatches
// to avoid manually clicking over and over again to apply them

// Just making sure we type the token object we receive from Figma Tokens
interface TokenObject {
	value: string,
	type: string,
	name: string
}

// Get values from Figma Tokens
const tokens:Object = JSON.parse(figma.root.getSharedPluginData("tokens", "values"))

// An empty array to store our color keys
const colorKeys:TokenObject[] = []

// Extract only color tokens
Object.entries(tokens).forEach(([key, value]) => {
	const filteredValues = tokens[key].filter(token => token.type === "color")
  // Push it to the empty array
	colorKeys.push(filteredValues)
})

// Grab our selected layers
const selectedLayers:readonly SceneNode[] = figma.currentPage.selection

selectedLayers.forEach(layer => {
	const layerName:string[] = layer.name.split("/")
  // Run this only if we actually have color keys
	if (colorKeys.length) {
    // Match the color tokens to the layer names of our selected layers
		const tokenValue:TokenObject | undefined = colorKeys.flat().find(colorKey => {
			const tokenName:string[] = colorKey.name.split(".")
			// If our token starts with 'color.' make sure we ignore it
			if (colorKey.name.startsWith("color")) {
				return tokenName[1] === layerName[0] && tokenName[2] === layerName[1]
			}
			return tokenName[0] === layerName[0] && tokenName[1] === layerName[1]
		})
    // Run the magic!
		if (tokenValue) {
			layer.setSharedPluginData("tokens", "fill", `"${tokenValue.name}"`)
			// Optionally rename layer to token name
			// layer.name = tokenValue.name
		}
	}
})
