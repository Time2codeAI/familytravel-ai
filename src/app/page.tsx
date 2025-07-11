"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTrips = JSON.parse(
      localStorage.getItem("familyTravelTrips") || "[]"
    );
    setTrips(savedTrips.sort((a: Trip, b: Trip) => b.updatedAt - a.updatedAt));
    setLoading(false);
  }, []);

  const getDaysDifference = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const isPast = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusColor = (trip: Trip) => {
    if (isPast(trip.endDate)) return "bg-gray-100 text-gray-600";
    if (isUpcoming(trip.startDate)) return "bg-blue-100 text-blue-600";
    return "bg-green-100 text-green-600"; // Ongoing
  };

  const getStatusText = (trip: Trip) => {
    if (isPast(trip.endDate)) return "Afgelopen";
    if (isUpcoming(trip.startDate)) return "Gepland";
    return "Bezig"; // Ongoing
  };

  const recentTrips = trips.slice(0, 3);
  const upcomingTrips = trips.filter((trip) => isUpcoming(trip.startDate));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✈️</div>
          <p>Welkom bij Family Travel AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welkom bij Family Travel AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Jouw AI-assistent voor de perfecte gezinsvakantie
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips/create"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 font-semibold text-lg transition-colors"
            >
              🚀 Plan je Reis
            </Link>

            <Link
              href="/assistant"
              className="bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-600 font-semibold text-lg transition-colors"
            >
              🤖 AI Assistent
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {trips.length}
              </div>
              <div className="text-gray-600">Totaal Reizen</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {upcomingTrips.length}
              </div>
              <div className="text-gray-600">Gepland</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {trips.reduce(
                  (total, trip) =>
                    total + getDaysDifference(trip.startDate, trip.endDate),
                  0
                )}
              </div>
              <div className="text-gray-600">Totaal Dagen</div>
            </div>
          </div>
        )}

        {/* Recent Trips Section */}
        {trips.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                🗺️ Recente Reizen
              </h2>
              <Link
                href="/trips"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Bekijk alle reizen →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1"
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        trip
                      )}`}
                    >
                      {getStatusText(trip)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getDaysDifference(trip.startDate, trip.endDate)} dagen
                    </span>
                  </div>

                  {/* Trip Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {trip.title}
                  </h3>

                  {/* Destination */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <span>📍</span>
                    <span>{trip.destination}</span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <span>📅</span>
                    <span className="text-sm">
                      {new Date(trip.startDate).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {new Date(trip.endDate).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Family Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>
                        {trip.familyInfo.adults +
                          trip.familyInfo.children.length}{" "}
                        personen
                      </span>
                    </div>

                    {trip.familyInfo.children.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span>👶</span>
                        <span>
                          {trip.familyInfo.children.length} kind
                          {trip.familyInfo.children.length > 1 ? "eren" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* No Trips - Getting Started */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Begin je Reis Avontuur!
            </h2>
            <p className="text-gray-600 mb-8">
              Nog geen reizen gepland? Geen probleem! Onze AI-assistent helpt je
              de perfecte gezinsvakantie te plannen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/trips/create"
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:bg-blue-100 transition-colors group"
              >
                <div className="text-3xl mb-3">✈️</div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Plan je Eerste Reis
                </h3>
                <p className="text-blue-600 text-sm">
                  Maak een nieuwe reis aan met onze slimme planner
                </p>
              </Link>

              <Link
                href="/assistant"
                className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 hover:bg-purple-100 transition-colors group"
              >
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Vraag de AI Assistent
                </h3>
                <p className="text-purple-600 text-sm">
                  Krijg persoonlijke reisadviezen van onze AI
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🚀 Ontdek alle Mogelijkheden
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/trips"
              className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                Mijn Reizen
              </h3>
              <p className="text-sm text-gray-600 mt-1">Bekijk al je reizen</p>
            </Link>

            <Link
              href="/pins"
              className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                Mijn Pins
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Opgeslagen favorieten
              </p>
            </Link>

            <Link
              href="/assistant"
              className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                AI Assistent
              </h3>
              <p className="text-sm text-gray-600 mt-1">Persoonlijke hulp</p>
            </Link>

            <Link
              href="/onboarding"
              className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                Gezinsprofiel
              </h3>
              <p className="text-sm text-gray-600 mt-1">Stel je profiel in</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
