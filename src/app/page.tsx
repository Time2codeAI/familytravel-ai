'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('familyTravelTrips') || '[]');
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
    if (isPast(trip.endDate)) return 'bg-gray-100 text-gray-600';
    if (isUpcoming(trip.startDate)) return 'bg-blue-100 text-blue-600';
    return 'bg-green-100 text-green-600'; // Ongoing
  };

  const getStatusText = (trip: Trip) => {
    if (isPast(trip.endDate)) return 'Afgelopen';
    if (isUpcoming(trip.startDate)) return 'Gepland';
    return 'Bezig'; // Ongoing
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✈️</div>
          <p>Reizen worden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🗺️ Mijn Reizen</h1>
              <p className="text-gray-600">Overzicht van al je geplande en afgeronde reizen</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
              <div className="text-sm text-gray-500">Reizen</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/trips/create" 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              ✈️ Nieuwe Reis
            </Link>
            
            <Link 
             href="/" 
             className="text-blue-500 hover:text-blue-700 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-50 font-medium transition-colors"
           >
             ← Terug naar homepage
           </Link>
         </div>
       </div>

       {/* Trips Grid */}
       {trips.length === 0 ? (
         <div className="bg-white rounded-xl shadow-lg p-8 text-center">
           <div className="text-4xl mb-4">✈️</div>
           <h3 className="text-lg font-semibold text-gray-800 mb-2">Nog geen reizen gepland</h3>
           <p className="text-gray-600 mb-6">
             Begin met het plannen van je eerste gezinsreis met AI ondersteuning!
           </p>
           <Link 
             href="/trips/create"
             className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
           >
             ✈️ Plan je Eerste Reis
           </Link>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {trips.map((trip) => (
             <Link
               key={trip.id}
               href={`/trips/${trip.id}`}
               className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
             >
               <div className="p-6">
                 
                 {/* Status Badge */}
                 <div className="flex items-center justify-between mb-3">
                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip)}`}>
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
                     {new Date(trip.startDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} - {' '}
                     {new Date(trip.endDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </span>
                 </div>
                 
                 {/* Family Info */}
                 <div className="flex items-center justify-between text-sm text-gray-500">
                   <div className="flex items-center gap-1">
                     <span>👥</span>
                     <span>{trip.familyInfo.adults + trip.familyInfo.children.length} personen</span>
                   </div>
                   
                   {trip.familyInfo.children.length > 0 && (
                     <div className="flex items-center gap-1">
                       <span>👶</span>
                       <span>{trip.familyInfo.children.length} kind{trip.familyInfo.children.length > 1 ? 'eren' : ''}</span>
                     </div>
                   )}
                 </div>
                 
                 {/* Interests Preview */}
                 {trip.familyInfo.interests.length > 0 && (
                   <div className="mt-3 pt-3 border-t border-gray-100">
                     <div className="flex flex-wrap gap-1">
                       {trip.familyInfo.interests.slice(0, 3).map((interest, index) => (
                         <span key={`item-${index}-${interest}`} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                           {interest.split(' ')[0]}
                         </span>
                       ))}
                       {trip.familyInfo.interests.length > 3 && (
                         <span className="text-xs text-gray-400">
                           +{trip.familyInfo.interests.length - 3} meer
                         </span>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </Link>
           ))}
         </div>
       )}

       {/* Quick Stats */}
       {trips.length > 0 && (
         <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
           <h2 className="text-xl font-semibold mb-4">📊 Reis Statistieken</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
             <div>
               <div className="text-2xl font-bold text-blue-600">
                 {trips.filter(t => isUpcoming(t.startDate)).length}
               </div>
               <div className="text-sm text-gray-600">Gepland</div>
             </div>
             
             <div>
               <div className="text-2xl font-bold text-green-600">
                 {trips.filter(t => !isUpcoming(t.startDate) && !isPast(t.endDate)).length}
               </div>
               <div className="text-sm text-gray-600">Bezig</div>
             </div>
             
             <div>
               <div className="text-2xl font-bold text-gray-600">
                 {trips.filter(t => isPast(t.endDate)).length}
               </div>
               <div className="text-sm text-gray-600">Afgerond</div>
             </div>
             
             <div>
               <div className="text-2xl font-bold text-purple-600">
                 {trips.reduce((total, trip) => total + getDaysDifference(trip.startDate, trip.endDate), 0)}
               </div>
               <div className="text-sm text-gray-600">Totaal dagen</div>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}