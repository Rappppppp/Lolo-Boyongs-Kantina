'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Send } from 'lucide-react'

interface Message {
    id: string
    text: string
    sender: 'user' | 'boyong'
    timestamp: Date
}

export function Boyong() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    // Show welcome message when opening for the first time
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: Message = {
                id: '0',
                text: "Hi there! I'm Boyong, your friendly AI assistant. Need help finding a feature? I can guide you. How can I help you today?",
                sender: 'boyong',
                timestamp: new Date(),
            }
            setMessages([welcomeMessage])
        }
    }, [isOpen, messages.length])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages.map((m) => ({
                        role: m.sender === "user" ? "user" : "assistant",
                        content: m.text,
                    })),
                }),
            });

            if (!response.ok) throw new Error('Failed to get response')

            const data = await response.json();
            const boyongMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                sender: 'boyong',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, boyongMessage]);
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I encountered an error. Please try again.",
                sender: 'boyong',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Chat Bubble */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center">
                {/* Tooltip */}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110"
                    aria-label="Open chat with Boyong"
                >
                    {isOpen ? <X className="h-6 w-6" /> : (
                        <img
                            src="/boyongAI.png"
                            alt="BoyongAI"
                            className="h-full w-full object-cover"
                        />
                    )}
                </button>
            </div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-24px)] shadow-xl overflow-y-scroll overflow-x-hidden flex flex-col max-h-[70%] rounded-2xl"
                    >
                        <Card className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center gap-2 bg-blue-600 text-white p-2 border-b mx-4 rounded-3xl shadow-lg">
                                <img src="/boyongAI.png" className='w-20 h-20 rounded-full' alt="" />
                                <div>
                                    <h3 className="font-semibold text-lg">BoyongAI</h3>
                                    <p className="text-sm text-blue-100">Your friendly AI assistant</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4 h-96">
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                                <span className="text-xs opacity-70 mt-1 block">
                                                    {message.timestamp.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none px-4 py-2">
                                                <div className="flex gap-1">
                                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="border-t bg-white p-4 flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex-1 text-sm"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
