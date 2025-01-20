import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import BooksSearch from "./_components/book";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.savedBooks.getSavedBooks.prefetch();
  }

  return (
    <HydrateClient>
      {/* Main Content */}
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
          </div>
        </div>

        {/* {session?.user && <SavedBooksList />} */}
        <BooksSearch />
      </div>
    </HydrateClient>
  );
}
