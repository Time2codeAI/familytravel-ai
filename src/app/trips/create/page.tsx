"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreateTripData } from "@/lib/supabase/types";

interface TripFormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  family_composition: {
    adults: number;
    children: number[];
  };
  preferences: {
    interests: string[];
    budget: "low" | "medium" | "high";
  };
  total_budget: number;
  description: string;
}

export default function CreateTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
    family_composition: {
      adults: 2,
      children: [],
    },
    preferences: {
      interests: [],
      budget: "medium",
    },
    total_budget: 0,
    description: "",
  });

  const [newChildAge, setNewChildAge] = useState("");

  const addChild = () => {
    const age = parseInt(newChildAge);
    if (age >= 0 && age <= 18) {
      setFormData((prev) => ({
        ...prev,
        family_composition: {
          ...prev.family_composition,
          children: [...prev.family_composition.children, age].sort(
            (a, b) => a - b
          ),
        },
      }));
      setNewChildAge("");
    }
  };

  const removeChild = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      family_composition: {
        ...prev.family_composition,
        children: prev.family_composition.children.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        interests: prev.preferences.interests.includes(interest)
          ? prev.preferences.interests.filter((i) => i !== interest)
          : [...prev.preferences.interests, interest],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const createTripData: CreateTripData = {
        title: formData.title,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        family_composition: formData.family_composition,
        preferences: {
          ...formData.preferences,
          description: formData.description,
        },
        total_budget: formData.total_budget || undefined,
        status: "planning",
        is_public: false,
      };

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createTripData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create trip");
      }

      // Redirect to trip detail page
      router.push(`/trips/${data.trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Er ging iets mis bij het aanmaken van de reis."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const availableInterests = [
    "🏖️ Strand",
    "🏛️ Cultuur",
    "🎢 Pretparken",
    "🥾 Natuur",
    "🍕 Eten",
    "🏊‍♂️ Sport",
    "🎨 Kunst",
    "🦁 Dierentuinen",
    "🏰 Geschiedenis",
    "🎪 Entertainment",
    "🛍️ Shopping",
    "🧘‍♀️ Wellness",
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ✈️ Nieuwe Reis Plannen
            </h1>
            <p className="text-gray-600">
              Plan je perfecte gezinsvakantie met AI ondersteuning
            </p>

            <Link
              href="/trips"
              className="inline-block mt-3 text-blue-500 hover:text-blue-700 text-sm"
            >
              ← Terug naar mijn reizen
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">❌</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basis Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🎯 Reis Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reis Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="bijv. Zomervakantie Parijs 2025"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bestemming *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    placeholder="bijv. Parijs, Frankrijk"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Startdatum *
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          start_date: e.target.value,
                        }))
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Einddatum *
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          end_date: e.target.value,
                        }))
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Familie Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                👨‍👩‍👧‍👦 Gezin Samenstelling
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aantal Volwassenen
                  </label>
                  <select
                    value={formData.family_composition.adults}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        family_composition: {
                          ...prev.family_composition,
                          adults: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} volwassene{num > 1 ? "n" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kinderen (Leeftijden)
                  </label>

                  {/* Current Children */}
                  {formData.family_composition.children.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.family_composition.children.map(
                        (age, index) => (
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
                        )
                      )}
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
                  <label className="block text-sm font-medium mb-2">
                    Budget
                  </label>
                  <select
                    value={formData.preferences.budget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          budget: e.target.value as "low" | "medium" | "high",
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">💰 Budget (&lt; €1000)</option>
                    <option value="medium">💰💰 Gemiddeld (€1000-3000)</option>
                    <option value="high">💰💰💰 Ruim (&gt; €3000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Geschat Totaalbudget (€)
                  </label>
                  <input
                    type="number"
                    value={formData.total_budget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        total_budget: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="bijv. 2500"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                      formData.preferences.interests.includes(interest)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                Geselecteerd: {formData.preferences.interests.length} interesses
              </div>
            </div>

            {/* Beschrijving */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Extra Wensen</h2>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Beschrijf wat jullie graag willen doen, speciale wensen, etc..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Submit */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.title ||
                  !formData.destination ||
                  !formData.start_date ||
                  !formData.end_date
                }
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                {isLoading ? "✈️ Reis wordt aangemaakt..." : "🚀 Reis Aanmaken"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Na het aanmaken kun je de AI assistent gebruiken voor
                persoonlijke aanbevelingen!
              </p>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
