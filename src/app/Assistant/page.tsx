'use client'
import { useChat } from 'ai/react';
import { useState } from 'react';

export default function AIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  });
  
  const [familyInfo, setFamilyInfo] = useState({
    destination: '',
    childrenAges: '',
    interests: '',
    budget: 'medium'
  });

  const quickActions = [
    { icon: '🍽️', label: 'Restaurants', prompt: 'Zoek kindvriendelijke restaurants in ' + familyInfo.destination },
    { icon: '🎯', label: 'Activiteiten', prompt: 'Suggereer leuke activiteiten voor kinderen van ' + familyInfo.childrenAges + ' jaar' },
    { icon: '🏥', label: 'Noodhulp', prompt: 'Geef noodinformatie en ziekenhuizen in ' + familyInfo.destination },
    { icon: '🌤️', label: 'Weer Tips', prompt: 'Wat kunnen we doen als het regent in ' + familyInfo.destination }
  ];

  const handleQuickAction = (prompt: string) => {
    if (!familyInfo.destination) {
      alert('Vul eerst je bestemming in!');
      return;
    }
    
    // Trigger de chat met de prompt
    const event = { 
      target: { value: prompt },
      preventDefault: () => {}
    } as any;
    
    handleInputChange(event);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI Reis Assistent</h1>
          <p className="text-gray-600">Ik help je de perfecte gezinsvakantie te plannen!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Familie Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">👨‍👩‍👧‍👦 Gezin Info</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bestemming</label>
                  <input 
                    type="text"
                    value={familyInfo.destination}
                    onChange={(e) => setFamilyInfo({...familyInfo, destination: e.target.value})}
                    placeholder="bijv. Amsterdam"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Leeftijden kinderen</label>
                  <input 
                    type="text"
                    value={familyInfo.childrenAges}
                    onChange={(e) => setFamilyInfo({...familyInfo, childrenAges: e.target.value})}
                    placeholder="bijv. 5, 8, 12"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interesses</label>
                  <input 
                    type="text"
                    value={familyInfo.interests}
                    onChange={(e) => setFamilyInfo({...familyInfo, interests: e.target.value})}
                    placeholder="bijv. musea, natuur, sport"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Budget</label>
                  <select 
                    value={familyInfo.budget}
                    onChange={(e) => setFamilyInfo({...familyInfo, budget: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">💰 Budget</option>
                    <option value="medium">💰💰 Gemiddeld</option>
                    <option value="high">💰💰💰 Ruim</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">⚡ Snelle Acties</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={!familyInfo.destination}
                    className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="text-lg mb-1">{action.icon}</div>
                    <div>{action.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">💬 Chat met AI Assistent</h3>
                <p className="text-sm text-gray-600">Stel je vragen over je reis!</p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="text-4xl mb-4">🤖</div>
                    <p>Hallo! Ik ben je AI reis assistent.</p>
                    <p className="text-sm mt-2">Vul je gezin info in en stel me een vraag!</p>
                  </div>
                )}

                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e, {
                    data: {
                      familyInfo: familyInfo
                    }
                  });
                }} className="flex gap-2">
                  <input 
                    value={input} 
                    onChange={handleInputChange}
                    placeholder="Stel je vraag over de reis..."
                    disabled={isLoading}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    {isLoading ? '⏳' : '🚀'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}