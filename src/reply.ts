/**
 * Every tool returns the API's `data` payload verbatim as pretty JSON — the
 * assistant reads the shapes, so reformatting them here would only lose
 * fields.
 */
export function jsonReply(result: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
  };
}
