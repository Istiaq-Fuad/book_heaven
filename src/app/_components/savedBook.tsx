"use client";

import { api } from "~/trpc/react";

const SavedBooksList: React.FC = () => {
  // Use the tRPC hook to fetch books for the logged-in user
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = api.savedBooks.getSavedBooks.useQuery();

  // Handle loading and error states
  if (isLoading) {
    return <p>Loading your books...</p>;
  }

  if (isError) {
    return <p>Error loading books: {error.message}</p>;
  }

  return (
    <div>
      <h1>Your Books</h1>
      {books && books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h2>{book.title}</h2>
              <p>
                <strong>Authors:</strong> {book.authors.join(", ")}
              </p>
              {book.publishedDate && (
                <p>
                  <strong>Published:</strong> {book.publishedDate}
                </p>
              )}
              {book.description && <p>{book.description}</p>}
              {book.coverImageUrl && (
                <img src={book.coverImageUrl} alt={book.title} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no books saved.</p>
      )}
    </div>
  );
};

export default SavedBooksList;
