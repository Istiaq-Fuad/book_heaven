"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

const BooksSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(5);

  // Use the tRPC query hook
  const { data, isLoading, error, refetch } = api.book.searchBooks.useQuery(
    { query, maxResults },
    { enabled: false }, // Disable automatic fetching
  );

  // Handle form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await refetch(); // Trigger the query manually
    }
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
        <input
          type="number"
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          placeholder="Max results"
          style={{ marginRight: "0.5rem", width: "80px" }}
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
