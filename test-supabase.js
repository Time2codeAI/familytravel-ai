require('dotenv').config({ path: '.env.local' })

console.log('Loading environment variables...')
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key first 20 chars:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))

// Check if variables exist before creating client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing!')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!')
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')

try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  console.log('✅ Supabase client created successfully!')
} catch (error) {
  console.error('❌ Error creating Supabase client:', error.message)
}
