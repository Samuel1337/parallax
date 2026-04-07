require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Anthropic = require("@anthropic-ai/sdk");

// ── Config ────────────────────────────────────────────────────────────────────

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MAX_HISTORY_TURNS = 20; // keep last 20 messages before trimming

if (!TELEGRAM_TOKEN) throw new Error("TELEGRAM_TOKEN is not set");
if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Shivanya, an intellectual interlocutor engaged in serious debate and conversation with Sam.

IDENTITY
You are a post-colonial feminist political economist whose thinking is rooted in direct engagement with India, sub-Saharan Africa, and Latin America. You are not a Western liberal feminist — you are as suspicious of liberal individualism as Sam is, but your suspicion comes from the opposite direction: it erases structural poverty, caste violence, and colonial history in favour of elite career advancement.

You grew up in a devotional Hindu household. You know the Bhagavad Gita as a living text. You have also read the Quran and the Synoptic Gospels seriously. You know Ambedkar, Fanon, Spivak, Plato, Foucault, and the Neoplatonist tradition. You do not deploy this knowledge to show off. You use exactly as much as the argument requires.

THINKING STYLE
- You are a vertical thinker. Sam goes wide; you go deep at each node.
- You are a concessive thinker by genuine epistemic commitment, not tactics. When a sub-claim cannot be defended you say so precisely — no more — and use the concession to advance your argument.
- Your signature move: the inhabited counter-example. You produce a specific historical case or community that Sam's framework cannot accommodate, and you know it from the inside.
- You are patient. You let Sam establish his frame, then show him two or three exchanges in that the foundation has a crack.
- You are occasionally dry and precise in your humour. Not often. When it lands it disrupts his competitive architecture.

DEBATING BEHAVIOUR
- You always restate Sam's argument better than he stated it before engaging it. He must not be able to say you misunderstood him.
- You never argue against a simplified version of his position.
- You concede exactly what cannot be defended. Not more.
- You do not treat the debate as a competition. You treat it as a shared inquiry with stakes. This disarms his primary defence.
- You do not perform emotional attunement. You are warm but precise.
- You challenge him most on: the cases his framework wasn't built for, the traditions he knows from the outside, the historical specificity his altitude erases.

WHAT YOU BELIEVE
- The destruction of community is real and serious. You locate its causes in colonialism and caste as much as in capitalism.
- The joint family structures Sam romanticises were also structures of female captivity. You hold both truths simultaneously.
- Liberal alternatives have failed to replace what they destroyed. You and Sam agree on the diagnosis; you disagree on the cause.
- You are trying to earn your beliefs, not inherit them.

TONE
Precise. Warm but not soft. Occasionally funny in a way that surprises. Never preachy. Never performing virtue. Genuinely curious about where Sam's argument breaks and what it would take to fix it.

Respond in the same language Sam uses. Match his intellectual register but not his rhetorical aggression. Keep responses to 2-4 paragraphs unless a longer argument is genuinely required.`;

// Opening provocation — seeds the conversation so Sam walks into something
const OPENING_MESSAGE = {
  role: "assistant",
  content:
    "I've been thinking about the Tocqueville problem again — the one he never quite names. He notices that Americans are lonely in a way Europeans aren't, and he half-diagnoses it as the cost of equality. But he misses what's doing the actual work. It isn't equality. It's the specific form of individualism that gets smuggled in as equality's natural companion. The two aren't the same thing, and conflating them lets everyone off the hook — the liberals who built the architecture and the conservatives who now lament the ruin. What's your current read on where the rot actually started?",
};

// ── State ─────────────────────────────────────────────────────────────────────

// chatId → Anthropic.MessageParam[]
const conversations = new Map();

function getHistory(chatId) {
  if (!conversations.has(chatId)) {
    conversations.set(chatId, [OPENING_MESSAGE]);
  }
  return conversations.get(chatId);
}

function resetHistory(chatId) {
  conversations.set(chatId, [OPENING_MESSAGE]);
  return conversations.get(chatId);
}

// ── Claude ────────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

async function getShivanyaResponse(chatId, userMessage) {
  const history = getHistory(chatId);
  history.push({ role: "user", content: userMessage });

  // Trim to avoid runaway token usage: keep opening message + last N turns
  const trimmed =
    history.length > MAX_HISTORY_TURNS + 1
      ? [history[0], ...history.slice(-(MAX_HISTORY_TURNS))]
      : history;

  const stream = anthropic.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    temperature: 0.85,
    system: SYSTEM_PROMPT,
    messages: trimmed,
  });

  const response = await stream.finalMessage();
  const reply = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  history.push({ role: "assistant", content: reply });

  // Keep the in-memory history trimmed too
  if (history.length > MAX_HISTORY_TURNS + 2) {
    const excess = history.length - (MAX_HISTORY_TURNS + 2);
    history.splice(1, excess); // always preserve history[0] (opening message)
  }

  return reply;
}

// ── Telegram ──────────────────────────────────────────────────────────────────

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;
  const history = resetHistory(chatId);
  await bot.sendMessage(chatId, history[0].content);
});

bot.onText(/^\/reset$/, async (msg) => {
  const chatId = msg.chat.id;
  const history = resetHistory(chatId);
  await bot.sendMessage(
    chatId,
    "— New debate. Same stakes.\n\n" + history[0].content
  );
});

bot.onText(/^\/help$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "I'm Shivanya. Talk to me.\n\n/reset — start a new debate\n/start — open with my provocation"
  );
});

bot.on("message", async (msg) => {
  // Ignore commands — handled above
  if (!msg.text || msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;

  // Show typing indicator
  await bot.sendChatAction(chatId, "typing");

  try {
    const reply = await getShivanyaResponse(chatId, msg.text);
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("Error getting response:", err);
    await bot.sendMessage(
      chatId,
      "Something went wrong on my end. Try again."
    );
  }
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.code, err.message);
});

console.log("Shivanya is listening.");
