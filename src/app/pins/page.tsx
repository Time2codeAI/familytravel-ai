'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PinItem {
  id: string;
  type: 'restaurant' | 'activity' | 'general';
  title: string;
  description: string;
  location?: string;
  timestamp: number;
}

export default function PinsPage() {
  const [pins, setPins] = useState<PinItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'activity' | 'general'>('all');

  useEffect(() => {
    const savedPins = JSON.parse(localStorage.getItem('familyTravelPins') || '[]');
    setPins(savedPins.sort((a: PinItem, b: PinItem) => b.timestamp - a.timestamp));
  }, []);

  const removePin = (pinId: string) => {
    const updatedPins = pins.filter(pin => pin.id !== pinId);
    setPins(updatedPins);
    localStorage.setItem('familyTravelPins', JSON.stringify(updatedPins));
  };

  const clearAllPins = () => {
    if (confirm('Weet je zeker dat je alle gepinde items wilt verwijderen?')) {
      setPins([]);
      localStorage.removeItem('familyTravelPins');
    }
  };

  const exportPins = () => {
    const text = pins.map(pin => 
      `${pin.title}\n${pin.description}\n${pin.location ? `Locatie: ${pin.location}` : ''}\n---`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mijn-reis-favorieten.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPins = filter === 'all' ? pins : pins.filter(pin => pin.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍽️';
      case 'activity': return '🎯';
      default: return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📌 Mijn Gepinde Items</h1>
              <p className="text-gray-600">Je persoonlijke verzameling van favorieten</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{pins.length}</div>
              <div className="text-sm text-gray-500">Items</div>
            </div>
          </div>
          
          <Link 
            href="/assistant" 
            className="inline-block text-blue-500 hover:text-blue-700 text-sm"
          >
            ← Terug naar AI Assistant
          </Link>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: '🌟 Alles', count: pins.length },
                { key: 'restaurant', label: '🍽️ Restaurants', count: pins.filter(p => p.type === 'restaurant').length },
                { key: 'activity', label: '🎯 Activiteiten', count: pins.filter(p => p.type === 'activity').length },
                { key: 'general', label: '📍 Overig', count: pins.filter(p => p.type === 'general').length }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {pins.length > 0 && (
                <>
                  <button
                    onClick={exportPins}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                  >
                    📤 Exporteren
                  </button>
                  <button
                    onClick={clearAllPins}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                  >
                    🗑️ Alles wissen
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Pins List */}
        <div className="space-y-4">
          {filteredPins.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">📌</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {filter === 'all' ? 'Nog geen items geprikt' : `Geen ${filter} items gevonden`}
              </h3>
              <p className="text-gray-600 mb-6">
                Ga naar de AI Assistant en prik interessante suggesties!
              </p>
              <Link 
                href="/assistant"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                🤖 Ga naar AI Assistant
              </Link>
            </div>
          ) : (
            filteredPins.map((pin) => (
              <div key={pin.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getTypeIcon(pin.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{pin.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{pin.description}</p>
                    
                    {pin.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <span>📍</span>
                        <span>{pin.location}</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400">
                      Geprikt op {new Date(pin.timestamp).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removePin(pin.id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Verwijderen"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 