import z from "zod";

const schema = z.object({
  searchQuery: z.string().min(3, "Search query must be at least 3 characters"),
  pagesNumber: z
    .string()
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1;
    }, "Pages number must be a number greater than or equal to 1")
    .transform(Number),
  location: z.string().min(3, "Location must be at least 3 characters"),
});
export default schema;
