import { useQuery } from '@tanstack/react-query'
import { getUserData } from '@/server/user'
import { useUser } from '@/context/UserContext'

export function useUserData() {
  const { user } = useUser()

  return useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id as string),
    enabled: !!user?.id,
  })
}
