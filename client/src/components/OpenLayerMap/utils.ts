export const parseWMSResponse = async (response: Response) => {
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const text = await response.text();
  const jsonStartIndex = text.indexOf("{");
  const jsonEndIndex = text.lastIndexOf("}") + 1;
  if (jsonStartIndex === -1 || jsonEndIndex === -1) throw new Error("Invalid WMS response format");
  return JSON.parse(text.slice(jsonStartIndex, jsonEndIndex));
};
