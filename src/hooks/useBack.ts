import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Go back in history when there is somewhere to go back to; otherwise go to a sensible parent. */
export function useBack(fallback: string) {
  const navigate = useNavigate()
  const location = useLocation()
  return useCallback(() => {
    if (location.key !== 'default') navigate(-1)
    else navigate(fallback, { replace: true })
  }, [location.key, navigate, fallback])
}
