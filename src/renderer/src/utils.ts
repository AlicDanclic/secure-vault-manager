export function escapeHtml(text: string): string {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
