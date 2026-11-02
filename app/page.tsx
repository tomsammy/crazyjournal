import { getAllJournals, getAllTags } from "@/lib/journals";
import PublicationHomeClient from "@/components/PublicationHomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PublicationHomePage() {
  const journals = getAllJournals();
  const allTags = getAllTags();

  return <PublicationHomeClient initialJournals={journals} allTags={allTags} />;
}
