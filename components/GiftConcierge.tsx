
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ProductWithPrice } from '../types';

interface GiftConciergeProps {
  products: ProductWithPrice[];
  onNavigateToProduct: (id: string) => void;
}

const GiftConcierge: React.FC<GiftConciergeProps> = ({ products, onNavigateToProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Dynamically import the SDK to avoid bundling server-only libs into the client.
      let GoogleGenAI: any = null;
      try {
        const mod: any = await import('@google/genai');
        GoogleGenAI = mod.GoogleGenAI || (mod as any).default || mod;
      } catch (e) {
        console.warn('Dynamic import of @google/genai failed (likely server-only). Falling back to mock response.');
      }

      const ai = GoogleGenAI ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;
      
      const productContext = products.map(p => 
        `- ${p.name} (Metal: ${p.metal} ${p.purity}, Weight: ${p.totalGrams}g): Current Dynamic Price ₹${p.pricing.finalPrice}`
      ).join('\n');

      const systemInstruction = `
        You are the "Aura Luxe AI Concierge", a luxury Indian jewellery expert.
        Available Catalogue:
        ${productContext}

        Your Rules:
        1. Be sophisticated, elite, and deeply knowledgeable about Indian jewellery.
        2. Recommend products ONLY from the list above. Mention their specific prices.
        3. Explain the heritage or suitability of the piece (e.g., weddings, formal gifts).
        4. If a piece is low on stock, mention its rarity.
        5. Keep responses concise and formatted beautifully.
      `;

      // Correct generateContent call as per guideline
      let aiText = "I apologize, my connection to the vault is currently fluctuating. How else may I assist you?";
      if (ai && ai.models && typeof ai.models.generateContent === 'function') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userMessage,
          config: { systemInstruction: systemInstruction, temperature: 0.7 },
        });
        aiText = response?.text || aiText;
      } else {
        // Provide a helpful mock response when SDK isn't available in the browser
        aiText = `I can recommend these pieces: ${products.slice(0,3).map(p => p.name).join(', ')}.`;
      }
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Forgive me, the vault is currently undergoing a security refresh. I cannot provide recommendations at this moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-gold/30 group"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] sm:w-[400px] bg-white rounded-sm shadow-2xl border border-beige flex flex-col overflow-hidden animate-slideUp">
          <div className="bg-gray-900 p-5 border-b border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                 <span className="text-gold text-[10px] font-bold tracking-tighter">AL</span>
              </div>
              <div>
                <h3 className="text-white text-xs font-bold uppercase tracking-widest serif">Concierge</h3>
                <p className="text-[8px] text-gold uppercase tracking-[0.2em] font-bold">Artisan Intelligence</p>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 h-[400px] overflow-y-auto p-5 space-y-5 bg-[#FDFBF7]"
          >
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-60">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-4">Establishing Secure Link</p>
                <p className="text-sm text-gray-600 serif italic leading-relaxed">"Greetings. I am your personal Aura Luxe consultant. Which occasion shall we commemorate with excellence today?"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-xs leading-[1.6] ${
                  m.role === 'user' 
                  ? 'bg-gold text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-sm' 
                  : 'bg-white border border-beige text-gray-800 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm font-medium'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-beige p-3 rounded-xl flex gap-1 items-center">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest mr-2">Analyzing Vault</span>
                  <div className="w-1 h-1 bg-gold rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-beige flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Find me an 18k gold gift..."
              className="flex-1 bg-[#FDFBF7] border border-beige px-4 py-3 text-xs focus:border-gold outline-none transition-all placeholder:text-gray-400 font-medium"
            />
            <button 
              onClick={handleSend}
              className="bg-gray-900 text-white px-4 rounded-sm hover:bg-black transition-colors flex items-center justify-center border border-gold/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftConcierge;