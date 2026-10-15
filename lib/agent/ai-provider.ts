import { generateText, streamText, type LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createVertex } from "@ai-sdk/google-vertex";

/**
 * Recursively removes $schema and additionalProperties from tool parameters
 * to guarantee compatibility with OpenAI-compatible & AWS Bedrock Mantle endpoints.
 */
function cleanSchemaParameters(schema: any): any {
  if (!schema || typeof schema !== "object") return schema;
  if (Array.isArray(schema)) {
    return schema.map(cleanSchemaParameters);
  }
  const copy = { ...schema };
  delete copy.$schema;
  delete copy.additionalProperties;
  if (copy.properties && typeof copy.properties === "object") {
    const cleanProps: Record<string, any> = {};
    for (const [key, val] of Object.entries(copy.properties)) {
      cleanProps[key] = cleanSchemaParameters(val);
    }
    copy.properties = cleanProps;
  }
  if (copy.items) {
    copy.items = cleanSchemaParameters(copy.items);
  }
  return copy;
}

// Dynamic language model instantiation using Vercel AI SDK
export function getLanguageModel(
  provider: string = "gemma-4",
  model?: string,
): LanguageModel {
  switch (provider.toLowerCase()) {
    case "live":
    case "google-live":
    case "gemini-live":
    case "google-genai": {
      const apiKey = process.env.GEMINI_API_KEY || "";
      const selectedModel =
        model ||
        process.env.LIVE_VOICE_MODEL ||
        "gemini-3.8-live";
      console.log(
        `[AI-PROVIDER] Instantiating Multimodal Live GenAI model: ${selectedModel}`,
      );

      const liveClient = createOpenAI({
        apiKey,
        baseURL:
          process.env.GEMINI_BASE_URL ||
          "https://generativelanguage.googleapis.com/v1beta/openai/",
      });

      const cleanModelName = selectedModel.replace(/^models\//, "");
      return liveClient.chat(cleanModelName);
    }

    case "vertex":
    case "google-vertex": {
      const project = process.env.GOOGLE_VERTEX_PROJECT;
      const location = process.env.GOOGLE_VERTEX_LOCATION || "global";
      const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
      let privateKey = process.env.GOOGLE_PRIVATE_KEY;

      if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, "\n");
      }

      const selectedModel =
        model || process.env.LIVE_VOICE_MODEL || "gemini-3.8-live";
      console.log(
        `[AI-PROVIDER] Instantiating Vertex model: ${selectedModel} (Project: ${project}, Location: ${location})`,
      );

      const vertexClient = createVertex({
        project,
        location,
        googleAuthOptions: {
          credentials: {
            client_email: clientEmail,
            private_key: privateKey,
          },
        },
      });

      return vertexClient(selectedModel);
    }

    case "gemma-4":
    case "gemma":
    case "openai":
    default: {
      const apiKey =
        process.env.GEMMA_API_KEY || process.env.OPENAI_API_KEY || "";
      let baseURL =
        process.env.GEMMA_BASE_URL || process.env.OPENAI_BASE_URL || undefined;

      // Auto-normalize bedrock-mantle base URL to ensure OpenAI-compatible /openai/v1 path is used
      if (
        baseURL &&
        baseURL.includes("bedrock-mantle") &&
        !baseURL.includes("/openai/v1")
      ) {
        baseURL = baseURL.replace(/\/v1\/?$/, "/openai/v1");
      }

      const selectedModel =
        model ||
        process.env.GEMMA_MODEL ||
        process.env.OPENAI_MODEL ||
        "google.gemma-4-31b";
      console.log(
        `[AI-PROVIDER] Instantiating Gemma 4 model: ${selectedModel} (baseURL: ${baseURL || "default"})`,
      );

      const openaiClient = createOpenAI({
        apiKey,
        baseURL,
        fetch: async (url, init) => {
          if (init && init.body) {
            try {
              const body = JSON.parse(init.body as string);
              if (Array.isArray(body.tools)) {
                body.tools = body.tools.map((t: any) => {
                  const type = t.type || "function";
                  const name = t.name || t.function?.name;
                  const description = t.description || t.function?.description;
                  const parameters = cleanSchemaParameters(
                    t.parameters || t.function?.parameters || {},
                  );

                  return {
                    type,
                    function: {
                      name,
                      description,
                      parameters,
                    },
                  };
                });
                init.body = JSON.stringify(body);
              }
            } catch (e) {
              console.error("[OpenAI FETCH INTERCEPTOR ERROR]:", e);
            }
          }
          return fetch(url, init);
        },
      });

      return openaiClient.chat(selectedModel);
    }
  }
}

// Unified dispatch function for executing models using Vercel AI SDK
export async function runAIModel(
  provider: string = "gemma-4",
  model: string = process.env.GEMMA_MODEL || process.env.OPENAI_MODEL || "google.gemma-4-31b",
  systemInstruction: string = "",
  prompt: string = "",
): Promise<string> {
  const selectedModel =
    model || process.env.GEMMA_MODEL || process.env.OPENAI_MODEL || "google.gemma-4-31b";
  console.log(
    `[AI-PROVIDER] Vercel AI SDK Dispatching to: ${provider} (model: ${selectedModel})`,
  );

  const modelInstance = getLanguageModel(provider, selectedModel);

  const { text } = await generateText({
    model: modelInstance,
    system: systemInstruction,
    prompt,
  });

  return text;
}
