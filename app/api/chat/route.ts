import { NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { history } = await req.json();
  if (!Array.isArray(history)) {
    return NextResponse.json({ error: "history required" }, { status: 400 });
  }
  try {
    const reply = await geminiChat(history);
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json(
      { reply: `[AI 호출 실패: ${e?.message ?? e}]` },
      { status: 200 },
    );
  }
}
