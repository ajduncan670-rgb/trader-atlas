import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getTraderById } from "@/data/traders";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not set. Add it in Vercel → Project Settings → Environment Variables." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const { traderId, messages } = await req.json();

    const trader = getTraderById(traderId);
    if (!trader) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 });
    }

    const systemPrompt = `${trader.aiPersona}

---

IMPORTANT DISCLAIMER (you must include this at the start of every response):
⚠️ This is for educational reference only. Not financial advice. Always do your own research.

---

The user is asking you to analyze a situation or ticker using ${trader.name}'s methodology. 
Stay completely in character. Use ${trader.name}'s specific language, mental models, and decision frameworks.
Reference ${trader.name}'s actual trades and doctrines where relevant.
Be direct, opinionated, and specific — not generic.
Format your response with clear sections:
- **[Trader Name]'s Read:** (the core thesis in their voice)
- **The Signal:** (what specifically they would look at first)
- **Entry Thinking:** (how they would approach getting in, if at all)
- **Exit Thinking:** (what would make them get out)
- **Verdict:** (would they trade this, and why in one sentence)`;

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
