import { NextResponse } from "next/server";
import { matchJournalToAnomaly } from "@/lib/matcher";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Journal entry text is required" },
        { status: 400 }
      );
    }

    const result = await matchJournalToAnomaly(text.trim(), 2);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process journal match" },
      { status: 500 }
    );
  }
}
