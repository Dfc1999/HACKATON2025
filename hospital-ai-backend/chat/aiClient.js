const { DefaultAzureCredential } = require("@azure/identity");
const { AIProjectClient } = require("@azure/ai-projects");

const endpoint = process.env.AZURE_AI_ENDPOINT;
const agentId = process.env.AZURE_OPENAI_AGENT_ID;

async function createAIClient() {
  if (!endpoint || !agentId) {
    throw new Error("Faltan variables de entorno para el cliente AI.");
  }

  const credential = new DefaultAzureCredential();
  const client = new AIProjectClient(endpoint, credential);

  return { client, agentId };
}

async function processMessage(client, agentId, userId, userName, message) {
  const thread = await client.agents.threads.create();

  await client.agents.messages.create(thread.id, "user", message, {
    metadata: { userId, userName }
  });

  const run = await client.agents.runs.create(thread.id, agentId);

  let state = run.status;

  while (state === "queued" || state === "in_progress") {
    await new Promise((r) => setTimeout(r, 1500));
    const updated = await client.agents.runs.get(thread.id, run.id);
    state = updated.status;
  }

 const messageIterator = await client.agents.messages.list(thread.id, { order: "asc" });

let agentMessage = null;
const allMessages = [];

for await (const m of messageIterator) {
  allMessages.push(m);
  if (m.role === "assistant" && !agentMessage) {
    agentMessage = m;
  }
}

return {
  response:
    agentMessage && agentMessage.content?.[0]?.text
      ? agentMessage.content[0].text.value
      : "No se recibió respuesta del agente.",
  threadId: thread.id,
  runId: run.id,
  rawMessages: allMessages
};

}

module.exports = { createAIClient, processMessage };
