import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

async function checkAdmin(userId) {
  if (!userId) return false
  const { data } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .single()
  return !!data
}

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      checkAdmin(currentUser?.id)
        .then(setIsAdmin)
        .finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      checkAdmin(currentUser?.id).then(setIsAdmin)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, isAdmin, loading }
}
