import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .limit(1)

        if (error) throw error
        console.info('Connection successful:', data)
        return true
    } catch (error) {
        console.error('Connection error:', error)
        return false
    }
}

export default supabase