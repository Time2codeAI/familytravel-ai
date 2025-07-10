'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

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
    <div className="max-w-md mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Family Travel App</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded">
            <p className="text-green-800">✅ Logged in as: {user.email}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-100 rounded">
            <p className="text-blue-800">❌ Not logged in</p>
          </div>
          
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            
            <div className="flex gap-2">
              <button 
                onClick={handleSignIn}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
              
              <button 
                onClick={handleSignUp}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}