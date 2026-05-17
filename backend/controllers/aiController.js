const { GoogleGenerativeAI } = require("@google/generative-ai");
const Note = require("../models/Note");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

function getOpenRouterKey() {
  return (
    process.env.OPENROUTER_API_KEY ||
    process.env.OPEN_ROUTER_API_KEY ||
    process.env.OR_API_KEY ||
    ""
  );
}

function buildPrompt(content) {
  return `You are an AI assistant for a notes app. Analyse the note below and respond ONLY with valid JSON.

Return this exact structure:
{
  "summary": "2-4 sentence summary of the note",
  "suggestedTitle": "A concise, descriptive title (max 8 words)",
  "actionItems": ["action 1", "action 2", "action 3"]
}

Rules:
- Do not wrap the response in markdown.
- Keep actionItems concise and practical.
- If there are no clear action items, return an empty array.

NOTE CONTENT:
${content}`;
}

function parseAiResponse(text = "") {
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)```/i) ||
    text.match(/```\s*([\s\S]*?)```/i);

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch {}
  }

  try {
    const parsed = JSON.parse(text.trim());
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}

  const summaryMatch = text.match(/(?:summary|overview)[:\s*]+([^\n*#]+(?:\n(?![#*\n])[^\n*#]+)*)/i);
  const titleMatch = text.match(/(?:suggested[_ ]?title)[:\s*]+["']?([^\n"'#*]+)["']?/i);
  const actionItemsMatch = [...text.matchAll(/[-•*]\s+([^\n]+)/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : text.trim().slice(0, 300),
    suggestedTitle: titleMatch ? titleMatch[1].trim() : "",
    actionItems: actionItemsMatch.length > 0 ? actionItemsMatch.slice(0, 8) : [],
  };
}

function normalizeAiPayload(rawText) {
  const parsed = parseAiResponse(rawText);
  return {
    summary: parsed.summary || rawText.trim().slice(0, 500),
    suggestedTitle: parsed.suggestedTitle || "",
    actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems.filter(Boolean).slice(0, 8) : [],
  };
}

async function generateWithGemini(prompt) {
  const client = getGeminiClient();
  if (!client) {
    throw new Error("Gemini API key is not configured.");
  }

  const model = client.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateWithOpenRouter(prompt) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) {
    throw new Error("OpenRouter API key is not configured.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
      "X-Title": "Peblo Workplace",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You produce compact, valid JSON for a notes product.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

async function generateStructuredSummary(content) {
  const prompt = buildPrompt(content);
  const errors = [];

  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await generateWithGemini(prompt);
      return { provider: "gemini", text };
    } catch (error) {
      errors.push(`Gemini: ${error.message}`);
    }
  }

  if (getOpenRouterKey()) {
    try {
      const text = await generateWithOpenRouter(prompt);
      return { provider: "openrouter", text };
    } catch (error) {
      errors.push(`OpenRouter: ${error.message}`);
    }
  }

  if (!process.env.GEMINI_API_KEY && !getOpenRouterKey()) {
    throw new Error("No AI provider configured. Add GEMINI_API_KEY or OPENROUTER_API_KEY in backend/.env.");
  }

  throw new Error(errors.join(" | "));
}

const generateSummary = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!note.content || note.content.trim().length < 10) {
      return res.status(400).json({ message: "Note content is too short to summarise." });
    }

    const { provider, text } = await generateStructuredSummary(note.content);
    const parsed = normalizeAiPayload(text);

    note.aiSummary = parsed.summary;
    note.suggestedTitle = parsed.suggestedTitle;
    note.actionItems = parsed.actionItems;
    await note.save();

    return res.status(200).json({
      summary: note.aiSummary,
      suggestedTitle: note.suggestedTitle,
      actionItems: note.actionItems,
      provider,
    });
  } catch (error) {
    console.error("AI GENERATION ERROR:", error.message);
    return res.status(500).json({ message: "AI generation failed: " + error.message });
  }
};

module.exports = { generateSummary };
