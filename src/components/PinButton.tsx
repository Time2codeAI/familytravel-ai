'use client'
import { useState, useEffect } from 'react';

interface PinItem {
  id: string;
  type: 'restaurant' | 'activity' | 'general';
  title: string;
  description: string;
  location?: string;
  timestamp: number;
}

interface PinButtonProps {
  item: {
    title: string;
    description: string;
    location?: string;
    type?: 'restaurant' | 'activity' | 'general';
  };
}

export function PinButton({ item }: PinButtonProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemId = `${item.title}-${item.description}`.replace(/\s+/g, '-').toLowerCase();

  useEffect(() => {
    // Check if item is already pinned
    const pins = JSON.parse(localStorage.getItem('familyTravelPins') || '[]');
    setIsPinned(pins.some((pin: PinItem) => pin.id === itemId));
  }, [itemId]);

  const togglePin = async () => {
    setIsLoading(true);
    
    try {
      const pins: PinItem[] = JSON.parse(localStorage.getItem('familyTravelPins') || '[]');
      
      if (isPinned) {
        // Remove pin
        const updatedPins = pins.filter(pin => pin.id !== itemId);
        localStorage.setItem('familyTravelPins', JSON.stringify(updatedPins));
        setIsPinned(false);
      } else {
        // Add pin
        const newPin: PinItem = {
          id: itemId,
          type: item.type || 'general',
          title: item.title,
          description: item.description,
          location: item.location,
          timestamp: Date.now()
        };
        
        const updatedPins = [...pins, newPin];
        localStorage.setItem('familyTravelPins', JSON.stringify(updatedPins));
        setIsPinned(true);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={togglePin}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isPinned
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <span className="text-base">
        {isLoading ? '⏳' : isPinned ? '📌' : '📍'}
      </span>
      <span>
        {isLoading ? 'Bezig...' : isPinned ? 'Geprikt' : 'Prikken'}
      </span>
    </button>
  );
}