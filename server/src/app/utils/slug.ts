import { Tour } from "../Modules/tour/tour.model";

  // function to check if slug exists in DB
export  async function isSlugExists(slug: string) {
    const existing = await Tour.findOne({ slug });
    return !!existing;
  }



// for division
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




// for tour
export async function slugifyUnique(text: string, maxLength = 50, isSlugExists: (slug: string) => Promise<boolean>) {
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

  let uniqueSlug = slug;
  let counter = 1;

  while (await isSlugExists(uniqueSlug)) {
    uniqueSlug = slug + '-' + counter++;

    if (uniqueSlug.length > maxLength) {
      const allowedLength = maxLength - (`-${counter - 1}`).length;
      const cutIndex = slug.lastIndexOf('-', allowedLength);
      slug = slug.slice(0, cutIndex > 0 ? cutIndex : allowedLength);
      uniqueSlug = slug + '-' + (counter - 1);
    }
  }

  return uniqueSlug;
}