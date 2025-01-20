"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { type BookItem } from "~/utils/types";

const BooksSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  // Use the tRPC query hook
  const { data, isLoading, error, refetch } = api.book.searchBooks.useQuery(
    { query },
    { enabled: false }, // Disable automatic fetching
  );

  const { mutate: saveBook, status: saveStatus } =
    api.savedBooks.saveBook.useMutation();
  const isSaving = saveStatus === "pending";

  // Handle form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await refetch(); // Trigger the query manually
    }
  };

  // Handle saving the book to the database
  const handleSaveBook = (book: BookItem) => {
    const { title, authors, publishedDate, description, imageLinks } =
      book.volumeInfo;
    const authorsList = authors ?? ["Unknown Author"];
    const coverImageUrl = imageLinks?.thumbnail ?? "";

    saveBook({
      title,
      authors: authorsList,
      publishedDate,
      description,
      coverImageUrl,
    });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-[#2e026d]">
        Google Books Search
      </h1>

      <form onSubmit={handleSearch} className="mb-4 flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title"
          className="flex-grow rounded-lg border-2 border-gray-300 p-2 text-black focus:border-[#9b4de0] focus:outline-none focus:ring-2 focus:ring-[#9b4de0]"
        />
        <button
          type="submit"
          className="ml-4 rounded-lg bg-[#9b4de0] px-6 py-2 text-white hover:bg-[#7a3ca6] focus:outline-none focus:ring-2 focus:ring-[#9b4de0]"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}

      {data?.items?.length ? (
        <ul className="space-y-6">
          {data.items.map((book) => (
            <li key={book.id} className="rounded-lg bg-gray-100 p-4 shadow-md">
              <div className="flex items-center gap-6">
                {/* Book Cover Image */}
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="h-48 w-32 rounded-lg object-cover shadow-md"
                  />
                )}

                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#2e026d]">
                    {book.volumeInfo.title}
                  </h2>
                  <p className="mt-2 text-gray-700">
                    <strong>Authors:</strong>{" "}
                    {book.volumeInfo.authors?.join(", ") ?? "Unknown"}
                  </p>
                  <p className="mt-2 text-gray-700">
                    <strong>Published Date:</strong>{" "}
                    {book.volumeInfo.publishedDate ?? "Unknown"}
                  </p>
                  <p className="mt-2 text-gray-600">
                    {book.volumeInfo.description ?? "No description available."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSaveBook(book)}
                disabled={isSaving}
                className="mt-4 rounded-lg bg-[#9b4de0] px-6 py-2 text-white hover:bg-[#7a3ca6] focus:outline-none focus:ring-2 focus:ring-[#9b4de0] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Book"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && (
          <p className="text-center text-lg text-gray-500">No books found.</p>
        )
      )}
    </div>
  );
};

export default BooksSearch;
