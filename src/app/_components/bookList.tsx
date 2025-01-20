"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "~/trpc/react";

const SavedBooksList: React.FC = () => {
  // Use the tRPC hook to fetch books for the logged-in user
  const {
    data: books,
    isLoading,
    isError,
    error,
    refetch,
  } = api.savedBooks.getSavedBooks.useQuery();

  // Use the tRPC hook for the delete mutation
  const deleteBookMutation = api.savedBooks.deleteBook.useMutation();

  // State to track the book being deleted
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  // Handle loading and error states
  if (isLoading) {
    return <p>Loading your books...</p>;
  }

  if (isError) {
    return <p>Error loading books: {error.message}</p>;
  }

  // Handle delete action
  const handleDelete = async (bookId: string) => {
    try {
      setDeletingBookId(bookId); // Mark the book as being deleted
      await deleteBookMutation.mutateAsync(bookId);
      await refetch(); // Refetch books after deletion
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setDeletingBookId(null); // Reset the deleting state
    }
  };

  return (
    <div className="mx-auto my-12 max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-[#2e026d]">
        Your Books
      </h1>

      {books && books.length > 0 ? (
        <ul className="space-y-6">
          {books.map((book) => (
            <li
              key={book.id}
              className="rounded-lg bg-gray-100 p-4 shadow-md transition duration-200 hover:bg-gray-200"
            >
              <div className="flex items-center gap-6">
                {/* Book Cover Image */}
                {book.coverImageUrl && (
                  <Image
                    src={book.coverImageUrl}
                    alt={book.title}
                    width={128}
                    height={192}
                    className="h-48 w-32 rounded-lg object-cover shadow-md"
                  />
                )}

                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#2e026d]">
                    {book.title}
                  </h2>
                  <p className="mt-2 text-gray-700">
                    <strong>Authors:</strong> {book.authors.join(", ")}
                  </p>

                  {book.publishedDate && (
                    <p className="mt-2 text-gray-700">
                      <strong>Published:</strong> {book.publishedDate}
                    </p>
                  )}

                  {book.description && (
                    <p className="mt-2 text-gray-600">{book.description}</p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(book.id)}
                  disabled={deletingBookId === book.id}
                  className={`rounded px-4 py-2 text-white shadow ${
                    deletingBookId === book.id
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-lg text-gray-500">
          You have no books saved.
        </p>
      )}
    </div>
  );
};

export default SavedBooksList;
