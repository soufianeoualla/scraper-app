import z from "zod";

const schema = z.object({
  apiKey: z.string().min(10, "API key must be at least 10 characters"),
  searchQuery: z.string().min(3, "Search query must be at least 3 characters"),
  pagesNumber: z.number().min(1, "Pages number must be at least 1"),
  location: z.string().min(3, "Location must be at least 3 characters"),
});
export default schema;
