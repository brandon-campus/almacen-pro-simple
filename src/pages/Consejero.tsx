import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useGlobalContext } from '../context/GlobalContext';

const WEBHOOK_URL = 'https://brandondelabora.app.n8n.cloud/webhook/consejerito';

interface Message {
  id: number;
  role: 'agent' | 'user';
  text: string;
  timestamp: string;
}

const BIENVENIDA = `Hola Carlos! Soy tu consejero del almacén 👋 Podés preguntarme cualquier cosa sobre tus ventas, stock, ganancias o productos. ¿En qué te ayudo hoy?`;

const QUICK_ACTIONS = [
  '¿Cuánto vendí hoy?',
  '¿Qué me falta reponer?',
  '¿Cuál fue mi mejor producto?',
  '¿Gané o perdí esta semana?',
];

function nowTime(): string {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

const Consejero = () => {
  const { productos, ventas, gastos } = useGlobalContext();

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'agent', text: BIENVENIDA, timestamp: nowTime() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: trimmed, timestamp: nowTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickActions(false);
    setIsTyping(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, productos, ventas, gastos }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const text = typeof data === 'string'
        ? data
        : (data.message ?? data.text ?? data.response ?? data.output ?? JSON.stringify(data));

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', text, timestamp: nowTime() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'agent',
        text: 'Tuve un problema al conectarme. Verificá tu conexión e intentá de nuevo.',
        timestamp: nowTime(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:pl-64">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground text-base leading-tight">Mi Consejero 🤖</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-medium">Online</span>
          </div>
        </div>
      </header>

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 pb-36 md:pb-28">
        <div className="mx-auto w-full max-w-[700px] flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div
                className={`relative max-w-[82%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-line
                  ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card text-foreground border border-border rounded-bl-sm'
                  }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Quick actions — visible only after welcome */}
          {showQuickActions && (
            <div className="flex flex-wrap gap-2 mt-1 animate-fade-in">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-secondary hover:bg-primary/10 hover:text-primary text-secondary-foreground border border-border rounded-full px-3 py-1.5 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start animate-fade-in">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 bg-card/95 backdrop-blur border-t border-border px-4 py-3 safe-area-bottom">
        <div className="mx-auto max-w-[700px] flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Preguntame lo que quieras sobre tu almacén..."
            className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground transition-shadow"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

// ── Typing animation component ────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 h-4">
      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

export default Consejero;
