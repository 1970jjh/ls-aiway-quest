import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.API_KEY ?? "";

function getClient() {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing — falling back to mock scoring");
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

const DEFAULT_MODEL = "gemini-2.5-flash";

export async function geminiJsonScore(prompt: string): Promise<{ score: number; rationale: string }> {
  const client = getClient();
  if (!client) {
    return mockScore(prompt);
  }
  try {
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object" as any,
          properties: {
            score: { type: "number" as any },
            rationale: { type: "string" as any },
          },
          required: ["score", "rationale"],
        },
      },
    });
    const text = (response as any).text ?? "";
    const parsed = JSON.parse(text);
    const score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 50)));
    return { score, rationale: String(parsed.rationale ?? "").slice(0, 600) };
  } catch (e) {
    console.error("Gemini scoring failed:", e);
    return mockScore(prompt);
  }
}

export async function geminiChat(
  history: { role: "user" | "model"; text: string }[]
): Promise<string> {
  const client = getClient();
  if (!client) {
    return "AI 채팅 일시 미사용 (API 키 미설정). 입력 내용은 시스템에 저장됩니다.";
  }
  try {
    const contents = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
    });
    return (response as any).text ?? "";
  } catch (e) {
    console.error("Gemini chat failed:", e);
    return "AI 응답 일시 오류. 잠시 후 다시 시도해주세요.";
  }
}

// 모의 채점 (API 키 없을 때) — 입력 길이 기반 휴리스틱
function mockScore(prompt: string): { score: number; rationale: string } {
  const len = prompt.length;
  let score = 60;
  if (len > 500) score = 75;
  if (len > 1500) score = 85;
  return {
    score,
    rationale:
      "(모의 채점) Gemini API 키 미연결 상태입니다. 운영 시 .env.local에 GEMINI_API_KEY 설정 시 실제 AI 채점이 작동합니다.",
  };
}
