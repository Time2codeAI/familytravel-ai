'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Check your email for verification!')
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md mx-auto p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏖️ Family Travel App</h1>
          <p className="text-gray-600">Plan je perfecte gezinsvakantie met AI</p>
        </div>
        
        {user ? (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Logged in as: {user.email}
            </div>
            
            {/* Navigation Menu */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">🚀 Start Planning:</h2>
              
              <Link 
                href="/assistant" 
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                🤖 AI Reis Assistent
              </Link>
              
              <Link 
                href="/onboarding" 
                className="block w-full bg-purple-500 hover:bg-purple-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                👨‍👩‍👧‍👦 Gezinsprofiel Instellen
              </Link>
              
              <Link 
                href="/trips" 
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                🗺️ Mijn Reizen
              </Link>
            </div>

            <button 
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welkom terug!</h2>
              <p className="text-gray-600">Log in om te beginnen met plannen</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                🚀 Inloggen
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Of</span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <p className="text-center text-sm text-gray-600">Nog geen account?</p>
              <button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                ✨ Account Aanmaken
              </button>
            </form>

            {/* Demo Access */}
            <div className="border-t pt-4">
              <p className="text-center text-sm text-gray-600 mb-3">Of probeer zonder account:</p>
              <Link 
                href="/assistant" 
                className="block w-full bg-gray-500 hover:bg-gray-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                🎯 Demo Versie
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}