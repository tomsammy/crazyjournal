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

  const ogImageUrl = journal.thumbnail
    ? journal.thumbnail.startsWith("http")
      ? journal.thumbnail
      : `https://crazyjournal.ng${journal.thumbnail}`
    : "https://crazyjournal.ng/images/journals/pigeon-linkedin.jpg";

  const description = journal.subtitle || journal.quote || journal.excerpt;

  return {
    title: `${journal.title} — The Crazy Journal`,
    description,
    openGraph: {
      title: journal.title,
      description,
      url: `https://crazyjournal.ng/journals/${params.slug}`,
      siteName: "The Crazy Journal",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: journal.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: journal.title,
      description,
      images: [ogImageUrl],
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
