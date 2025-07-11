'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PinButton } from '@/components/PinButton';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  familyInfo: {
    adults: number;
    children: number[];
    interests: string[];
    budget: string;
  };
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tripId = params.id as string;
    const trips: Trip[] = JSON.parse(localStorage.getItem('familyTravelTrips') || '[]');
    const foundTrip = trips.find(t => t.id === tripId);
    
    setTrip(foundTrip || null);
    setLoading(false);
  }, [params.id]);

  const deleteTrip = () => {
    if (!trip) return;
    
    if (confirm(`Weet je zeker dat je "${trip.title}" wilt verwijderen?`)) {
      const trips: Trip[] = JSON.parse(localStorage.getItem('familyTravelTrips') || '[]');
      const updatedTrips = trips.filter(t => t.id !== trip.id);
      localStorage.setItem('familyTravelTrips', JSON.stringify(updatedTrips));
      router.push('/trips');
    }
  };

  const getDaysDifference = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case 'low': return '💰 Budget';
      case 'medium': return '💰💰 Gemiddeld';
      case 'high': return '💰💰💰 Ruim';
      default: return budget;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✈️</div>
          <p>Reis wordt geladen...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Reis niet gevonden</h1>
          <p className="text-gray-600 mb-6">De reis die je zoekt bestaat niet of is verwijderd.</p>
          <Link 
            href="/trips"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Terug naar Mijn Reizen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{trip.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  📍 {trip.destination}
                </span>
                <span className="flex items-center gap-1">
                  📅 {getDaysDifference(trip.startDate, trip.endDate)} dagen
                </span>
                <span className="flex items-center gap-1">
                  👥 {trip.familyInfo.adults + trip.familyInfo.children.length} personen
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link
                href={`/assistant?tripId=${trip.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
              >
                🤖 AI Assistent
              </Link>
              <button
                onClick={deleteTrip}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                🗑️ Verwijderen
              </button>
            </div>
          </div>
          
          <Link 
            href="/trips" 
            className="inline-block text-blue-500 hover:text-blue-700 text-sm"
          >
            ← Terug naar mijn reizen
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Reisdata */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📅 Reisdata</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Startdatum</p>
                  <p className="font-medium">
                    {new Date(trip.startDate).toLocaleDateString('nl-NL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Einddatum</p>
                  <p className="font-medium">
                    {new Date(trip.endDate).toLocaleDateString('nl-NL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Beschrijving */}
            {trip.description && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">📝 Beschrijving</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{trip.description}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">⚡ Snelle Acties</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/assistant?destination=${encodeURIComponent(trip.destination)}&children=${trip.familyInfo.children.join(',')}`}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">🍽️</div>
                  <div className="font-medium">Restaurants</div>
                </Link>
                
                <Link
                  href={`/assistant?destination=${encodeURIComponent(trip.destination)}&children=${trip.familyInfo.children.join(',')}`}
                  className="p-4 bg-green-100 hover:bg-green-200 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium">Activiteiten</div>
                </Link>
                
                <Link
                  href="/pins"
                  className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">📌</div>
                  <div className="font-medium">Gepinde Items</div>
                </Link>
                
                <Link
                  href={`/assistant?destination=${encodeURIComponent(trip.destination)}&children=${trip.familyInfo.children.join(',')}`}
                  className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-medium">Noodhulp</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Familie Info */}
          <div className="space-y-6">
            
            {/* Familie Samenstelling */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">👨‍👩‍👧‍👦 Gezin</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Volwassenen</p>
                  <p className="font-medium">{trip.familyInfo.adults} personen</p>
                </div>
                
                {trip.familyInfo.children.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Kinderen</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trip.familyInfo.children.map((age, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {age} jaar
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">{getBudgetLabel(trip.familyInfo.budget)}</p>
                </div>
              </div>
            </div>

            {/* Interesses */}
            {trip.familyInfo.interests.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">🎯 Interesses</h2>
                <div className="flex flex-wrap gap-2">
                  {trip.familyInfo.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">ℹ️ Trip Info</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Aangemaakt: {new Date(trip.createdAt).toLocaleDateString('nl-NL')}</p>
                <p>Laatst gewijzigd: {new Date(trip.updatedAt).toLocaleDateString('nl-NL')}</p>
                <p>Trip ID: {trip.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
