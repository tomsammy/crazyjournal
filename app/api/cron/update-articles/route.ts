import { NextResponse } from "next/server";
import { harvestPublicationArticles } from "@/lib/feed-harvester";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await harvestPublicationArticles(6);

    return NextResponse.json({
      success: true,
      updated_at: new Date().toISOString(),
      articles_harvested: articles.length,
      outlets: Array.from(new Set(articles.map((a) => a.outlet))),
      sample: articles.slice(0, 3).map((a) => ({ title: a.title, outlet: a.outlet })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to run update cron" },
      { status: 500 }
    );
  }
}
