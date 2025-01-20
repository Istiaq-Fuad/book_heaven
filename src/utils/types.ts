import { z } from "zod";

// Define the schema for the API response using zod
export const GoogleBooksResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      volumeInfo: z.object({
        title: z.string(),
        authors: z.array(z.string()).optional(),
        publishedDate: z.string().optional(),
        description: z.string().optional(),
      }),
    }),
  ),
});

// Infer the TypeScript type from the zod schema
export type GoogleBooksResponse = z.infer<typeof GoogleBooksResponseSchema>;
