'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TripFormData {
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
  description: string;
}

export default function CreateTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    familyInfo: {
      adults: 2,
      children: [],
      interests: [],
      budget: 'medium'
    },
    description: ''
  });

  const [newChildAge, setNewChildAge] = useState('');

  const addChild = () => {
    const age = parseInt(newChildAge);
    if (age >= 0 && age <= 18) {
      setFormData(prev => ({
        ...prev,
        familyInfo: {
          ...prev.familyInfo,
          children: [...prev.familyInfo.children, age].sort((a, b) => a - b)
        }
      }));
      setNewChildAge('');
    }
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        children: prev.familyInfo.children.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        interests: prev.familyInfo.interests.includes(interest)
          ? prev.familyInfo.interests.filter(i => i !== interest)
          : [...prev.familyInfo.interests, interest]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to localStorage
      const trips = JSON.parse(localStorage.getItem('familyTravelTrips') || '[]');
      const newTrip = {
        id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      trips.push(newTrip);
      localStorage.setItem('familyTravelTrips', JSON.stringify(trips));

      // Redirect naar trip detail
      router.push(`/trips/${newTrip.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Er ging iets mis bij het aanmaken van de reis.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableInterests = [
    '🏖️ Strand', '🏛️ Cultuur', '🎢 Pretparken', '🥾 Natuur', 
    '🍕 Eten', '🏊‍♂️ Sport', '🎨 Kunst', '🦁 Dierentuinen',
    '🏰 Geschiedenis', '🎪 Entertainment', '🛍️ Shopping', '🧘‍♀️ Wellness'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">✈️ Nieuwe Reis Plannen</h1>
          <p className="text-gray-600">Plan je perfecte gezinsvakantie met AI ondersteuning</p>
          
          <Link 
            href="/trips" 
            className="inline-block mt-3 text-blue-500 hover:text-blue-700 text-sm"
          >
            ← Terug naar mijn reizen
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basis Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Reis Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reis Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="bijv. Zomervakantie Parijs 2025"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bestemming *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="bijv. Parijs, Frankrijk"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Startdatum *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Einddatum *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Familie Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">👨‍👩‍👧‍👦 Gezin Samenstelling</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Aantal Volwassenen</label>
                <select
                  value={formData.familyInfo.adults}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    familyInfo: { ...prev.familyInfo, adults: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} volwassene{num > 1 ? 'n' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kinderen (Leeftijden)</label>
                
                {/* Current Children */}
                {formData.familyInfo.children.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.familyInfo.children.map((age, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {age} jaar
                        <button
                          type="button"
                          onClick={() => removeChild(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Child */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder="Leeftijd"
                    min="0"
                    max="18"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addChild}
                    disabled={!newChildAge}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Voeg toe
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget</label>
                <select
                  value={formData.familyInfo.budget}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    familyInfo: { ...prev.familyInfo, budget: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">💰 Budget (&lt; €1000)</option>
                  <option value="medium">💰💰 Gemiddeld (€1000-3000)</option>
                  <option value="high">💰💰💰 Ruim (&gt; €3000)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interesses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Interesses</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    formData.familyInfo.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              Geselecteerd: {formData.familyInfo.interests.length} interesses
            </div>
          </div>

          {/* Beschrijving */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📝 Extra Wensen</h2>
            
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beschrijf wat jullie graag willen doen, speciale wensen, etc..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Submit */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              type="submit"
              disabled={isLoading || !formData.title || !formData.destination || !formData.startDate || !formData.endDate}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              {isLoading ? '✈️ Reis wordt aangemaakt...' : '🚀 Reis Aanmaken'}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-3">
              Na het aanmaken kun je de AI assistent gebruiken voor persoonlijke aanbevelingen!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}