// Just making sure we type the token object we receive from Figma Tokens
interface TokenObject {
  value: string;
  type: string;
  name: string;
}

// Get values from Figma Tokens
const tokens: Object = JSON.parse(
  figma.root.getSharedPluginData("tokens", "values")
);

// An empty array to store our color keys
const colorKeys: TokenObject[] = [];
const tokensWithoutColors: TokenObject[] = [];

// Extract only color tokens
const newTokens = Object.entries(tokens).map(([key, value]) => {
  const filteredValues = tokens[key].map((token) => {
    if (token.type === "color" && !token.name.startsWith("color.")) {
      const newToken = {
        name: `color.${token.name}`,
        value: token.value,
        type: token.type,
      };
      return newToken;
    }
    return token;
  });
  return { [key]: filteredValues };
});

// Apply new tokens
figma.root.setSharedPluginData(
  "tokens",
  "values",
  `${JSON.stringify(newTokens[0])}`
);

figma.notify("Colors grouped!");
