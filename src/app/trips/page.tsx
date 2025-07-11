import Link from 'next/link';

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🗺️ Mijn Reizen</h1>
        <p className="text-gray-600 mb-6">Hier vind je binnenkort al je reizen en gepinde locaties!</p>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">🚧</div>
            <p>Deze pagina wordt binnenkort beschikbaar gemaakt.</p>
          </div>
        </div>
        
        <Link href="/" className="inline-block mt-6 text-blue-500 hover:text-blue-700">
        ← Terug naar homepage
        </Link>
      </div>
    </div>
  );
} 