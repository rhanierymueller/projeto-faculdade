const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const MODEL = "models/gemini-2.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent`;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export const sendMessageToGemini = async (messages: ChatMessage[]) => {
  if (!API_KEY) {
    console.error("Faltando API KEY");
    return;
  }

  try {
    const systemMessage = messages.find(m => m.role === "system");
    const conversation = messages.filter(m => m.role !== "system");

    const contents: any[] = [];

    if (systemMessage) {
      contents.push({
        role: "user",
        parts: [{ text: systemMessage.content }]
      });
    }

    contents.push(
      ...conversation.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    );

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.7
      }
    };

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error?.message);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  } catch (error) {
    console.error(error);
    throw error;
  }
};
