const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Professor, aqui eu configurei múltiplos modelos como fallback. Se um estiver sobrecarregado, o sistema tenta automaticamente outro.
const MODELS = [
  "models/gemini-2.5-flash",
  "models/gemini-2.5-flash-lite",
  "models/gemini-2.0-flash"
];

const MAX_RETRIES_PER_MODEL = 2;
const INITIAL_RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
      const currentModel = MODELS[modelIndex];
      const baseUrl = `https://generativelanguage.googleapis.com/v1beta/${currentModel}:generateContent`;

      for (let attempt = 0; attempt < MAX_RETRIES_PER_MODEL; attempt++) {
        try {
          const response = await fetch(`${baseUrl}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const data = await response.json();
            if (modelIndex > 0 || attempt > 0) {
              console.log(`✓ Sucesso com modelo fallback: ${currentModel} (tentativa ${attempt + 1})`);
            }
            return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          }

          if (response.status === 404) {
            console.warn(`Modelo ${currentModel} não encontrado. Tentando próximo modelo...`);
            break;
          }

          if (response.status === 503) {
            const isLastAttempt = attempt === MAX_RETRIES_PER_MODEL - 1;
            const isLastModel = modelIndex === MODELS.length - 1;

            if (isLastAttempt && !isLastModel) {
              console.warn(`Modelo ${currentModel} sobrecarregado. Tentando próximo modelo...`);
              break;
            } else if (!isLastAttempt) {
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
              console.warn(`Modelo ${currentModel} sobrecarregado. Retentando em ${delay}ms...`);
              await sleep(delay);
              continue;
            }
          }

          const error = await response.json();
          console.error(error);
          throw new Error(error.error?.message);

        } catch (error: any) {
          const isLastAttempt = attempt === MAX_RETRIES_PER_MODEL - 1;
          const isLastModel = modelIndex === MODELS.length - 1;
          
          if (isLastModel && isLastAttempt) {
            throw error;
          }
          
          if (error.message?.includes('not found') || error.message?.includes('404')) {
            console.warn(`Erro com modelo ${currentModel}. Tentando próximo modelo...`);
            break;
          }
          
          if (!error.message?.includes('503')) {
            throw error;
          }
        }
      }
    }

    throw new Error("Todos os modelos estão indisponíveis no momento. Tente novamente mais tarde.");

  } catch (error) {
    console.error(error);
    throw error;
  }
};
