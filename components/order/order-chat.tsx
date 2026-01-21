'use client';

import { Send, HelpCircle, Clock, Package } from 'lucide-react';
import { useState } from 'react';

export default function OrderChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', text: 'Your order has been confirmed!', time: '14:32' },
    { id: 2, sender: 'support', text: 'The restaurant started preparing your food.', time: '14:38' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'user',
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setInput('');
    }
  };

  const quickReplies = [
    { icon: '🚪', label: 'Gate Code', hint: '1234' },
    { icon: '⏰', label: 'Running Late', hint: '10 mins' },
    { icon: '🚫', label: 'Cancel Order', hint: 'Cancel' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[600px]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Support</h3>
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Chat with support or share special instructions
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-gray-100 text-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm break-words">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(reply.hint);
            }}
            className="p-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition text-center border border-gray-100 hover:border-primary"
          >
            <p className="text-lg mb-1">{reply.icon}</p>
            <p className="text-xs font-medium text-foreground line-clamp-1">
              {reply.label}
            </p>
          </button>
        ))}
      </div>

      {/* Input field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
