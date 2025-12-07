import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCcw,
  Copy,
  Lightbulb,
  History,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// --- KONFIGURASI API ---
// Ganti URL ini dengan URL NGROK Anda jika backend berjalan di Google Colab/Jupyter
// Contoh: "https://xxxx-xx-xx-xx-xx.ngrok-free.app"
const API_BASE_URL = "https://6b1ed58c16d3.ngrok-free.app";

// --- Types ---
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
  messages: Message[];
}

const initialMessage: Message = {
  id: "1",
  role: "assistant",
  content:
    "Halo! Saya Bizness AI, asisten cerdas Anda. Ada yang bisa saya bantu terkait bisnis hari ini?",
  timestamp: new Date(),
};

const ChatBot = () => {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Ref untuk auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- Handlers ---

  // 1. Send Message (INTEGRATED WITH BACKEND)
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // A. Add User Message UI
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // B. Call Backend API
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Header penting jika pakai ngrok
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // C. Add AI Response UI
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Maaf, saya tidak menerima balasan yang valid.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      toast({
        title: "Connection Error",
        description: "Gagal terhubung ke AI Server. Pastikan backend aktif.",
        variant: "destructive",
      });

      // Optional: Add error message to chat bubble
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ Maaf, terjadi gangguan koneksi ke server AI.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // 2. Save Current Session & Start New
  const handleNewChat = () => {
    // Hanya simpan jika ada percakapan lebih dari pesan pembuka
    if (messages.length > 1) {
      const firstUserMessage = messages.find((m) => m.role === "user");
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 30) +
          (firstUserMessage.content.length > 30 ? "..." : "")
        : "Percakapan Baru";

      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: title,
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        preview: messages[messages.length - 1].content.slice(0, 40) + "...",
        messages: messages,
      };

      setSessions((prev) => [newSession, ...prev]);
      toast({
        title: "Tersimpan",
        description: "Percakapan sebelumnya telah masuk ke riwayat.",
      });
    }

    // Reset Chat
    setMessages([initialMessage]);
    setActiveSessionId(null);
  };

  // 3. Load Session from History
  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
  };

  // 4. Delete Session
  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setMessages([initialMessage]);
      setActiveSessionId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
            Bizness AI Chat
          </h1>
          <p className="text-muted-foreground">
            Konsultasikan strategi dan performa bisnis Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* --- LEFT PANEL: HISTORY --- */}
        <Card
          variant="glass"
          className="lg:col-span-1 flex flex-col overflow-hidden h-full border-border/50"
        >
          <div className="p-4 border-b border-border/50">
            <Button
              onClick={handleNewChat}
              className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 shadow-none"
            >
              <Plus className="w-4 h-4 mr-2" /> Chat Baru
            </Button>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {sessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Belum ada riwayat
                </div>
              )}
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg text-sm transition-all group relative border",
                    activeSessionId === session.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/30 hover:bg-secondary border-transparent hover:border-border"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold truncate pr-4">
                      {session.title}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] opacity-70 whitespace-nowrap",
                        activeSessionId === session.id
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {session.date}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate opacity-80",
                      activeSessionId === session.id
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {session.preview}
                  </p>

                  {/* Delete Button (Visible on Hover) */}
                  <div
                    onClick={(e) => deleteSession(e, session.id)}
                    className="absolute right-2 bottom-2 p-1.5 rounded-md hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                  >
                    <Trash2 className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* --- RIGHT PANEL: CHAT INTERFACE --- */}
        <Card
          variant="glass"
          className="lg:col-span-3 flex flex-col overflow-hidden shadow-lg border-primary/10 h-full"
        >
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex w-full gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Bot Avatar */}
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-tl-sm"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] mt-2 block opacity-70",
                        msg.role === "user"
                          ? "text-primary-foreground/70 text-right"
                          : "text-muted-foreground"
                      )}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 border border-border mt-1">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-12">
                  <span
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background/40 backdrop-blur-md border-t border-border">
            {/* Quick Suggestions */}
            {messages.length < 3 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { label: "Analisa Profit", icon: Lightbulb },
                  { label: "Cek Stok Menipis", icon: Copy },
                  { label: "Ide Marketing", icon: Sparkles },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSendMessage(item.label)}
                    disabled={isTyping}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 border border-transparent transition-all text-xs font-medium whitespace-nowrap"
                  >
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <Input
                placeholder="Ketik pesan Anda..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                className="min-h-[50px] py-3 px-4 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all shadow-sm resize-none"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="h-[50px] w-[50px] rounded-xl shrink-0 shadow-md bg-gradient-to-br from-primary to-primary/90"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </form>

            <div className="flex items-center justify-center gap-1 mt-3">
              <AlertCircle className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-center text-muted-foreground">
                AI dapat membuat kesalahan. Cek kembali informasi penting.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
