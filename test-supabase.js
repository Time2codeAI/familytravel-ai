const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Found' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseKey)
console.log('Supabase client created successfully!')