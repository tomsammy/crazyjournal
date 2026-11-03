import { getAllJournals, getJournalBySlug } from "@/lib/journals";
import { notFound } from "next/navigation";
import JournalReaderClient from "@/components/JournalReaderClient";

interface Props {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;
export const revalidate = 0;

export function generateStaticParams() {
  const journals = getAllJournals();
  return journals.map((j) => ({
    slug: j.slug,
  }));
}

export function generateMetadata({ params }: Props) {
  const journal = getJournalBySlug(params.slug);
  if (!journal) {
    return { title: "Journal Not Found — The Crazy Journal" };
  }

  const images = journal.thumbnail ? [{ url: journal.thumbnail }] : [];

  return {
    title: `${journal.title} — The Crazy Journal`,
    description: journal.quote || journal.excerpt,
    openGraph: {
      title: journal.title,
      description: journal.quote || journal.excerpt,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: journal.title,
      description: journal.quote || journal.excerpt,
      images: journal.thumbnail ? [journal.thumbnail] : [],
    },
  };
}

export default function JournalPage({ params }: Props) {
  const journal = getJournalBySlug(params.slug);

  if (!journal) {
    notFound();
  }

  return <JournalReaderClient journal={journal} />;
}
