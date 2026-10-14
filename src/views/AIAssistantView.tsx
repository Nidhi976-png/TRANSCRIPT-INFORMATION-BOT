import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Database,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';
import { ChatMessage } from '../types/transcript';

export const AIAssistantView: React.FC = () => {
  const {
    chatMessages,
    setChatMessages,
    studentProfile,
    transcriptRecords,
    gradingSystem,
    metrics,
  } = useTranscript();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGroundTruth, setShowGroundTruth] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const recommendedPrompts = [
    'Explain my transcript in simple language.',
    'Which subject has my highest marks?',
    'Which subjects should I focus on improving?',
    'Compare my first and second semester performance.',
    'How many subjects have I passed?',
    'What is my SGPA?',
    'What is my CGPA?',
    'Explain the grades shown in my transcript.',
    'Which subjects have missing marks?',
    'Summarize my academic performance this semester.',
    'What should I revise before my next examination?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-8),
          studentProfile,
          transcriptRecords,
          gradingSystem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.fallbackReply || 'Failed to fetch AI response.');
      }

      const assistantMessage: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || data.fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ ${err.message || 'Error communicating with AI service.'}

*Note: Your local records are intact. You can continue to view marks and calculate SGPA in the Grade Calculator.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: `msg_reset_${Date.now()}`,
        sender: 'assistant',
        text: `Chat history reset. How can I assist you with your academic transcript today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-4">
      {/* Assistant Header & Ground Truth Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">AI Transcript Assistant</h1>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Grounded on {transcriptRecords.length} Verified Records
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Powered by Google Gemini 3.8 Flash • Deterministic Academic Logic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGroundTruth(!showGroundTruth)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Database className="h-3.5 w-3.5 text-purple-600" />
              <span>Ground Truth Data</span>
              {showGroundTruth ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <button
              onClick={handleResetChat}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
              title="Clear chat history"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Collapsible Ground Truth Drawer */}
        {showGroundTruth && (
          <div className="mt-3 rounded-xl bg-slate-900 p-3.5 text-xs text-slate-200 border border-slate-800 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified Context Injected into Gemini Prompt
              </span>
              <span>Student: {studentProfile.name} ({studentProfile.rollNumber})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 bg-slate-800/60 p-2.5 rounded-lg">
              <div>Current SGPA: <strong className="text-purple-300">{metrics.currentSgpa?.toFixed(2) ?? 'N/A'}</strong></div>
              <div>CGPA: <strong className="text-purple-300">{metrics.cgpa?.toFixed(2) ?? 'N/A'}</strong></div>
              <div>Earned Credits: <strong className="text-purple-300">{metrics.totalEarnedCredits}</strong></div>
              <div>Grading Rule: <strong className="text-purple-300">10-Point Scale</strong></div>
            </div>
            <p className="text-[10px] text-slate-400">
              The AI is instructed strictly: "Never invent marks, grades, credits, SGPA, CGPA, backlogs, or academic policies. Use only verified records."
            </p>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-purple-700 border border-purple-200 shadow-2xs'
                }`}
              >
                {isUser ? 'PS' : <Bot className="h-4 w-4" />}
              </div>

              <div className={`relative max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                isUser
                  ? 'bg-purple-700 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
              }`}>
                {/* Message text with newline / bullet support */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text.split('\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 pl-1">
                          <span className={isUser ? 'text-purple-200' : 'text-purple-600'}>•</span>
                          <span>{paragraph.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <p key={idx} className="font-bold text-sm my-1">
                          {paragraph.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    return <p key={idx}>{paragraph}</p>;
                  })}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:opacity-100 transition-opacity ml-4 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 border border-purple-200">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-white p-4 border border-slate-200 text-xs text-slate-500 shadow-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping"></span>
              <span>Transcript Bot is analyzing your academic records with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-purple-600" /> Suggested:
        </span>
        {recommendedPrompts.slice(0, 5).map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            disabled={isLoading}
            className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about marks, SGPA, highest subject, semester comparison, or revision topics..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs hover:bg-purple-700 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
