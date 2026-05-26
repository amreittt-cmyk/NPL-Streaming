"use client";

import { useState } from "react";
import { toast } from "sonner";

type ChatMessage = {
  id: string;
  body: string;
  createdAt: Date | string;
  user: { name: string };
};

export function ChatPanel({ streamId, initialMessages }: { streamId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");

  async function submit() {
    if (!body.trim()) return;

    const response = await fetch(`/api/streams/${streamId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Message failed");
      return;
    }

    setMessages((current) => [...current, payload.message]);
    setBody("");
  }

  return (
    <div className="glass-panel rounded-3xl p-5">
      <h3 className="text-xl font-black uppercase tracking-[0.16em] text-white">Live Chat</h3>
      <div className="mt-4 h-96 space-y-3 overflow-y-auto pr-2">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl border border-white/5 bg-white/5 p-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">{message.user.name}</p>
            <p className="mt-1 text-slate-200">{message.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Join the conversation"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
        />
        <button onClick={submit} className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.18em] text-slate-950">
          Send
        </button>
      </div>
    </div>
  );
}
