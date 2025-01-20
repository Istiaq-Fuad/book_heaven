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
    <div>
      <h1>Google Books Search</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title"
          style={{ marginRight: "0.5rem" }}
        />

        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data?.items?.length ? (
        <ul>
          {data.items.map((book) => (
            <li key={book.id} style={{ marginBottom: "1rem" }}>
              <h2>{book.volumeInfo.title}</h2>
              <p>
                <strong>Authors:</strong>{" "}
                {book.volumeInfo.authors?.join(", ") ?? "Unknown"}
              </p>
              <p>
                <strong>Published Date:</strong>{" "}
                {book.volumeInfo.publishedDate ?? "Unknown"}
              </p>
              <p>
                {book.volumeInfo.description ?? "No description available."}
              </p>
              <button
                onClick={() => handleSaveBook(book)}
                disabled={isSaving}
                style={{ marginTop: "1rem" }}
              >
                {isSaving ? "Saving..." : "Save Book"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No books found.</p>
      )}
    </div>
  );
};

export default BooksSearch;
