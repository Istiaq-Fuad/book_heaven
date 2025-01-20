import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { GoogleBooksResponseSchema } from "~/utils/types";

export const booksRouter = createTRPCRouter({
  searchBooks: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query is required"), // Validate the search query
        maxResults: z.number().optional(), // Optional parameter for max results
      }),
    )
    .query(async ({ input }) => {
      const { query, maxResults = 10 } = input;

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query,
          )}&maxResults=${maxResults}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Books API");
        }

        // Validate the response against the schema
        const data = GoogleBooksResponseSchema.parse(await response.json());

        return data;
      } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Could not fetch books data");
      }
    }),
});
