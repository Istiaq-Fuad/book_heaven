import SavedBooksList from "../_components/bookList";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

const SavedBook: React.FC = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return <SavedBooksList />;
};

export default SavedBook;
