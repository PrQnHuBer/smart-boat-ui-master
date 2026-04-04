"use client";

import { Bot, User, Send } from "lucide-react";
import { useState } from "react";
import Card from "@/components/Card";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I'm your Smart Boat AI Assistant. I'm here to help you with navigation, system monitoring, and any questions about your boat.",
      time: "14:25",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      role: "user",
      text: input,
      time: "Now",
    };

    setMessages([...messages, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "The battery is currently at 85% capacity. This should give you approximately 6 hours of operation.",
          time: "Now",
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
        <p className="text-gray-400 text-sm">
          Chat with your intelligent boat assistant
        </p>
      </div>

      {/* Chat */}
      <Card className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Assistant</h2>
            <p className="text-gray-400 text-sm">
              Smart Boat AI is online
            </p>
          </div>

          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
            ● Online
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {/* Bot */}
              {msg.role === "bot" && (
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`
                  px-4 py-3 rounded-xl max-w-md text-sm
                  ${
                    msg.role === "bot"
                      ? "bg-gray-600 text-white"
                      : "bg-teal-500 text-white"
                  }
                `}
              >
                {msg.text}
                <div className="text-xs text-gray-300 mt-2">
                  {msg.time}
                </div>
              </div>

              {/* User */}
              {msg.role === "user" && (
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-teal-500 hover:bg-teal-600 px-5 rounded-xl flex items-center gap-2 text-white shadow-lg"
          >
            <Send size={16} />
            Send
          </button>
        </div>

      </Card>
    </div>
  );
}