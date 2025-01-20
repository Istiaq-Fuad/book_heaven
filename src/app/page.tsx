import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import BooksSearch from "./_components/book";
import SavedBooksList from "./_components/savedBook";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.savedBooks.getSavedBooks.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {/* Navbar */}
        <nav className="w-full bg-[#15162c] py-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between px-6">
            <h1 className="text-3xl font-extrabold text-white">
              <span className="text-[#9b4de0]">Books</span> Heaven
            </h1>
            <div className="space-x-6">
              {session?.user && (
                <Link
                  href="/saved-books"
                  className="text-lg text-white hover:text-[#9b4de0]"
                >
                  Saved Books
                </Link>
              )}
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="text-lg text-white hover:text-[#9b4de0]"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
            </div>
          </div>

          {session?.user && <SavedBooksList />}
          <BooksSearch />
        </div>
      </main>
    </HydrateClient>
  );
}
