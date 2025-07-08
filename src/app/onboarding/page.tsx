'use client';

import { useState } from 'react';

interface FamilyMember {
  type: 'adult' | 'child';
  name: string;
  age: number;
}

interface OnboardingData {
  familyMembers: FamilyMember[];
  destination: string;
  budget: number;
  interests: string[];
  dates: {
    start: string;
    end: string;
  };
  description: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    familyMembers: [{ type: 'adult', name: '', age: 30 }],
    destination: '',
    budget: 1000,
    interests: [],
    dates: { start: '', end: '' },
    description: ''
  });

  const totalSteps = 4;

  const addFamilyMember = (type: 'adult' | 'child') => {
    setData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { 
        type, 
        name: '', 
        age: type === 'child' ? 5 : 30 
      }]
    }));
  };

  const removeFamilyMember = (index: number) => {
    setData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const updateFamilyMemberAge = (index: number, age: number) => {
    setData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) => 
        i === index ? { ...member, age } : member
      )
    }));
  };

  const updateFamilyMemberName = (index: number, name: string) => {
    setData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) => 
        i === index ? { ...member, name } : member
      )
    }));
  };

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Onboarding data:', data);
    // Hier zou je de data naar je API sturen
    alert('Profiel aangemaakt! 🎉');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Jouw Gezinsprofiel</h1>
            <span className="text-sm text-gray-600">Stap {currentStep} van {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">👨‍👩‍👧‍👦 Vertel ons over je gezin</h2>
              
              <div className="space-y-4">
                {data.familyMembers.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-medium text-lg">
                        {member.type === 'adult' ? '👨‍👩 Volwassene' : '👶 Kind'}
                      </span>
                      
                      {data.familyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember(index)}
                          className="ml-auto text-red-500 hover:text-red-700 text-xl"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Naam</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFamilyMemberName(index, e.target.value)}
                          placeholder={member.type === 'adult' ? 'bijv. Sarah' : 'bijv. Emma'}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Leeftijd</label>
                        <input
                          type="number"
                          min={member.type === 'child' ? '0' : '18'}
                          max={member.type === 'child' ? '17' : '99'}
                          value={member.age}
                          onChange={(e) => updateFamilyMemberAge(index, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => addFamilyMember('adult')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    + Volwassene toevoegen
                  </button>
                  <button
                    onClick={() => addFamilyMember('child')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    + Kind toevoegen
                  </button>
                </div>
                
                {data.familyMembers.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Jouw reisgezelschap:</h3>
                    <div className="text-blue-700">
                      {data.familyMembers.map((member, index) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {member.name || `${member.type === 'adult' ? 'Volwassene' : 'Kind'} ${index + 1}`}
                          </span>
                          <span>{member.age} jaar</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">🌍 Waar wil je naartoe?</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Bestemming</label>
                  <input
                    type="text"
                    value={data.destination}
                    onChange={(e) => setData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="bijv. Amsterdam, Parijs, of 'verras me!'"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Startdatum</label>
                    <input
                      type="date"
                      value={data.dates.start}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        dates: { ...prev.dates, start: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Einddatum</label>
                    <input
                      type="date"
                      value={data.dates.end}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        dates: { ...prev.dates, end: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">💰 Wat is je budget?</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget voor de hele reis: €{data.budget}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={data.budget}
                    onChange={(e) => setData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>€500</span>
                    <span>€5000</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Dit budget wordt gebruikt voor gepersonaliseerde aanbevelingen voor accommodatie, 
                    activiteiten en restaurants.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">🎯 Wat zijn jullie interesses?</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {[
                  '🏖️ Strand',
                  '🏛️ Cultuur',
                  '🎢 Pretparken',
                  '🥾 Natuur',
                  '🍕 Eten',
                  '🏊‍♂️ Sport',
                  '🎨 Kunst',
                  '🦁 Dierentuinen',
                  '🏰 Geschiedenis',
                  '🎪 Entertainment',
                  '🛍️ Shopping',
                  '🧘‍♀️ Wellness'
                ].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      data.interests.includes(interest)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              
              <div className="mb-6 text-sm text-gray-600">
                Geselecteerd: {data.interests.length} interesses
              </div>

              {/* Nieuwe beschrijving sectie */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  📝 Beschrijf zo veel mogelijk dingen die je leuk vindt om te doen deze vakantie
                </h3>
                
                <textarea
                  value={data.description}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Bijvoorbeeld; wij doen graag een actieve vakantie met wandeltochten, kayak of mountainbiken. Wij gaan graag in de middag uit eten, als we 's avonds uit eten gaan is het vaak eenvoudig zoals pizza. etc."
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                />
                
                <div className="mt-2 text-sm text-gray-500">
                  {data.description.length} karakters - Hoe meer details, hoe beter we kunnen helpen!
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vorige
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Profiel Aanmaken 🎉
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Volgende
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}