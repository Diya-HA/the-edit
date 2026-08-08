/**
 * Renders `claude -p --output-format stream-json` as something worth watching.
 *
 * Without this the demo is a four-minute silent pause and then a summary:
 * -p prints only the final message. This turns the event stream into live
 * lines — text as the model writes it, and a marker per tool call.
 */
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin });
let open = false;

const write = (s) => process.stdout.write(s);

for await (const line of rl) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("{")) {
    if (trimmed) write(`${trimmed}\n`);
    continue;
  }
  let e;
  try {
    e = JSON.parse(trimmed);
  } catch {
    continue;
  }

  if (e.type === "assistant" && e.message?.content) {
    for (const block of e.message.content) {
      if (block.type === "text" && block.text) {
        write(block.text);
        open = !block.text.endsWith("\n");
      }
      if (block.type === "tool_use") {
        if (open) write("\n");
        const name = String(block.name ?? "").replace(/^mcp__/, "");
        write(`   · ${name}\n`);
        open = false;
      }
    }
  }

  if (e.type === "result") {
    if (open) write("\n");
    const secs = e.duration_ms ? (e.duration_ms / 1000).toFixed(0) : "?";
    write(`\n   [${e.subtype === "success" ? "ok" : e.subtype}] ${e.num_turns ?? "?"} turns, ${secs}s\n`);
  }
}
