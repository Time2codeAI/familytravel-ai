// src/components/FamilyTravelChat.tsx - AI Chat voor familie reizen
'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'

interface FamilyInfo {
  ages: number[]
  dietaryRestrictions: string[]
  interests: string[]
  budget: 'low' | 'medium' | 'high'
}

export function FamilyTravelChat() {
  const { user } = useAuth()
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({
    ages: [],
    dietaryRestrictions: [],
    interests: [],
    budget: 'medium'
  })

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      familyInfo: familyInfo
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hallo! 👋 Ik ben je persoonlijke gezinsreis-assistent. Ik help je met:

🍽️ **Restaurants zoeken** - Familie-vriendelijke eetgelegenheden
🎡 **Activiteiten vinden** - Leeftijdsgeschikte bezienswaardigheden  
🆘 **Noodinformatie** - Belangrijke contactgegevens
📋 **Reisroutes maken** - Complete daagplanningen

Waar ga je naartoe en hoe kan ik helpen? 😊`
      }
    ]
  })

  const quickSuggestions = [
    "Zoek kindvriendelijke restaurants in Amsterdam",
    "Welke activiteiten kan ik doen in Parijs met kinderen van 6 en 10 jaar?",
    "Noodinformatie voor een reis naar Barcelona",
    "Maak een 3-daagse reisroute voor Londen"
  ]

  const handleQuickSuggestion = (suggestion: string) => {
    handleSubmit(new Event('submit') as any, {
      data: { message: suggestion }
    })
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-600">Je moet ingelogd zijn om de familie travel assistent te gebruiken.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Familie Info Setup */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">👨‍👩‍👧‍👦 Familie Informatie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kinderleeftijden (komma gescheiden)</label>
            <input
              type="text"
              placeholder="bijv: 5, 8, 12"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                const ages = e.target.value
                  .split(',')
                  .map(age => parseInt(age.trim()))
                  .filter(age => !isNaN(age))
                setFamilyInfo(prev => ({ ...prev, ages }))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget</label>
            <select
              className="w-full p-2 border rounded"
              value={familyInfo.budget}
              onChange={(e) => setFamilyInfo(prev => ({ 
                ...prev, 
                budget: e.target.value as 'low' | 'medium' | 'high' 
              }))}
            >
              <option value="low">Beperkt (€)</option>
              <option value="medium">Gemiddeld (€€)</option>
              <option value="high">Ruim (€€€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border rounded-lg shadow-sm mb-4">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">💡 Probeer een van deze vragen:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Vraag iets over je gezinsreis..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  )
}