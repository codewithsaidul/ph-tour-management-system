
export async function slugify(text: string, maxLength = 50) {
  if (!text) return "";

  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // Remove special chars
    .replace(/\s+/g, '-')       // Replace spaces with hyphen
    .replace(/-+/g, '-')        // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '');   // Trim hyphens

  if (slug.length > maxLength) {
    const cutIndex = slug.lastIndexOf('-', maxLength);
    slug = slug.slice(0, cutIndex > 0 ? cutIndex : maxLength);
  }


  return slug;
}