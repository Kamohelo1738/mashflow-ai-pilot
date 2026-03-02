const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function streamEdgeFunction({
  functionName,
  body,
  onDelta,
  onDone,
  onError,
}: {
  functionName: string;
  body: Record<string, unknown>;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError?: (error: string) => void;
}) {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok || !resp.body) {
    const errorText = await resp.text();
    try {
      const errorJson = JSON.parse(errorText);
      onError?.(errorJson.error || "Request failed");
    } catch {
      onError?.(errorText || "Request failed");
    }
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        onDone();
        return;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  onDone();
}
