import "server-only";

import { get, list, put } from "@vercel/blob";

async function streamToString(stream: ReadableStream<Uint8Array>) {
  return await new Response(stream).text();
}

export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobToken()) return null;
  const res = await get(pathname, { access: "private" });
  if (!res || res.statusCode !== 200) return null;
  const txt = await streamToString(res.stream);
  return JSON.parse(txt) as T;
}

export async function putJson(pathname: string, value: unknown) {
  if (!hasBlobToken()) throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  return await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function listBlobs(prefix: string) {
  if (!hasBlobToken()) return [];
  const res = await list({ prefix, limit: 1000 });
  return res.blobs;
}

