import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // no HTML tags allowed
    allowedAttributes: {}, // no attributes allowed
  });
}

export function sanitizeStringArray(arr?: string[]): string[] | undefined {
  if (!arr) return undefined;
  return arr.map(item => sanitizeInput(item));
}
