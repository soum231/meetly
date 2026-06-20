import { StreamClient } from "@stream-io/node-sdk";

function getStreamClient(): StreamClient {
  const apiKey = process.env.STREAM_API_KEY;
  const secret = process.env.STREAM_SECRET;

  if (!apiKey || !secret) {
    throw new Error("STREAM_API_KEY and STREAM_SECRET must be set");
  }

  return new StreamClient(apiKey, secret);
}

let streamClientInstance: StreamClient | null = null;

export function getStreamClientInstance(): StreamClient {
  if (!streamClientInstance) {
    streamClientInstance = getStreamClient();
  }
  return streamClientInstance;
}

export function generateUserToken(userId: string): string {
  return getStreamClientInstance().generateUserToken({ user_id: userId });
}
