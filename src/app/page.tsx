export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          🌟 Welkom bij FamilyTravel AI! 🌟
        </h1>
        
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-600">
            Jouw AI-assistent voor de perfecte gezinsvakantie
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🏖️ Bestemmingen</h3>
              <p className="text-gray-600">
                Ontdek kindvriendelijke bestemmingen wereldwijd
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🎯 Gepersonaliseerd</h3>
              <p className="text-gray-600">
                AI-aanbevelingen op basis van gezinsbehoeften
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📱 Eenvoudig</h3>
              <p className="text-gray-600">
                Plan je perfecte reis in een paar stappen
              </p>
            </div>
          </div>
          
          <a href="/onboarding" className="inline-block mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Start Planning 🚀
          </a>
        </div>
      </div>
    </main>
  );
}