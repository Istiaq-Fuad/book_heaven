import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const savedBooksRouter = createTRPCRouter({
  // Procedure to save a book to the database
  saveBook: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        authors: z.array(z.string()).min(1, "At least one author is required"),
        publishedDate: z.string().optional(),
        description: z.string().optional(),
        coverImageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, authors, publishedDate, description, coverImageUrl } =
        input;
      const userId = ctx.session.user.id; // Get the user ID from the session

      return ctx.db.book.create({
        data: {
          title,
          publishedDate,
          description,
          coverImageUrl,
          userId,
          authors: {
            create: authors.map((authorName) => ({
              author: {
                connectOrCreate: {
                  where: { name: authorName }, // Use the unique name field
                  create: { name: authorName }, // Create a new author if not found
                },
              },
            })),
          },
        },
      });
    }),

  // Procedure to fetch books for a specific user
  getSavedBooks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id; // Get the user ID from the session

    const books = await ctx.db.book.findMany({
      where: { userId },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
      },
    });

    // Map the result to ensure authors are returned as an array of strings
    return books.map((book) => ({
      ...book,
      authors: book.authors.map((ba) => ba.author.name),
    }));
  }),
});
