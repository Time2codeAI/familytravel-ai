"use client";
import { useChat } from "ai/react";
import { useState } from "react";
import { PinButton } from "@/components/PinButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const [familyInfo, setFamilyInfo] = useState({
    destination: "",
    childrenAges: "",
    interests: "",
    budget: "medium",
  });

  const quickActions = [
    {
      icon: "🍽️",
      label: "Restaurants",
      prompt: "Zoek kindvriendelijke restaurants in " + familyInfo.destination,
    },
    {
      icon: "🎯",
      label: "Activiteiten",
      prompt:
        "Suggereer leuke activiteiten voor kinderen van " +
        familyInfo.childrenAges +
        " jaar",
    },
    {
      icon: "🏥",
      label: "Noodhulp",
      prompt:
        "Geef noodinformatie en ziekenhuizen in " + familyInfo.destination,
    },
    {
      icon: "🌤️",
      label: "Weer Tips",
      prompt: "Wat kunnen we doen als het regent in " + familyInfo.destination,
    },
  ];

  const handleQuickAction = (prompt: string) => {
    if (!familyInfo.destination) {
      alert("Vul eerst je bestemming in!");
      return;
    }

    // Trigger de chat met de prompt
    const event = {
      target: { value: prompt },
      preventDefault: () => {},
    } as any;

    handleInputChange(event);
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        const submitEvent = new Event("submit", { bubbles: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🤖 Familie Reisassistent
            </h1>
            <p className="text-gray-600">
              Jouw AI-helper voor de perfecte familievakantie
            </p>
          </div>

          {/* Familie Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              👨‍👩‍👧‍👦 Familie Informatie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bestemming
                </label>
                <input
                  type="text"
                  value={familyInfo.destination}
                  onChange={(e) =>
                    setFamilyInfo((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  placeholder="bijv. Amsterdam, Parijs, Barcelona"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kinderleeftijden
                </label>
                <input
                  type="text"
                  value={familyInfo.childrenAges}
                  onChange={(e) =>
                    setFamilyInfo((prev) => ({
                      ...prev,
                      childrenAges: e.target.value,
                    }))
                  }
                  placeholder="bijv. 5, 8, 12"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interesses
                </label>
                <input
                  type="text"
                  value={familyInfo.interests}
                  onChange={(e) =>
                    setFamilyInfo((prev) => ({
                      ...prev,
                      interests: e.target.value,
                    }))
                  }
                  placeholder="bijv. musea, pretparken, natuur"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <select
                  value={familyInfo.budget}
                  onChange={(e) =>
                    setFamilyInfo((prev) => ({
                      ...prev,
                      budget: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Beperkt (€)</option>
                  <option value="medium">Gemiddeld (€€)</option>
                  <option value="high">Ruim (€€€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ⚡ Snelle Acties
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex flex-col items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                💬 Chat met AI Assistent
              </h2>
            </div>

            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>Stel een vraag over je gezinsreis!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg relative ${
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                      {message.role === "assistant" && (
                        <PinButton
                          content={message.content}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-100">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Vraag iets over je gezinsreis..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Bezig...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Verstuur</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
