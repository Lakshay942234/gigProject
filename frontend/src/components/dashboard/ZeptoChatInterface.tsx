import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: string;
  sender: "user" | "customer";
  text: string;
  timestamp: Date;
}

export const ZeptoChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "customer",
      text: 'Hi, I ordered groceries 45 mins ago and they haven\'t arrived yet. The app says "Arriving in 10 mins" for the last 30 mins.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate customer reply
    setTimeout(() => {
      const replies = [
        "Okay, please check quickly.",
        "This is really frustrating.",
        "I need these for lunch.",
        "Can you just cancel it then?",
        "Thanks for the update.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "customer",
          text: randomReply,
          timestamp: new Date(),
        },
      ]);
    }, 3000);
  };

  return (
    <div className="flex h-full flex-col bg-[#f0f2f5] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#36046e] px-4 py-3 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage
                src="https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qMMZdwEDKI5VEmKAXfzOqbiaeAsqqrJRemHcFD7"
                alt="Customer"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#36046e]"></span>
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base">John Doe</h2>
            <p className="text-xs text-white/70">
              Order #ZEP-8821 • 10 items • ₹450
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          <div className="flex justify-center my-4">
            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#36046e] text-white rounded-tr-none"
                    : "bg-white text-zinc-900 rounded-tl-none"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">
                  {msg.text}
                </p>
                <p
                  className={`text-[10px] mt-1 text-right ${
                    msg.sender === "user" ? "text-white/60" : "text-zinc-500"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white p-3 md:p-4 border-t">
        <form
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto flex items-end gap-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-[#36046e]"
          >
            <Smile className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-[#36046e]"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 bg-zinc-100 rounded-2xl px-4 py-2 focus-within:ring-1 focus-within:ring-[#36046e]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none focus:outline-none text-sm md:text-base max-h-32"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            className="bg-[#36046e] hover:bg-[#4a0b8f] text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex-shrink-0 shadow-lg transition-transform active:scale-95"
            disabled={!inputValue.trim()}
          >
            <Send className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
          </Button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-zinc-400">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};
