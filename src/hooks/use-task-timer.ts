import { useAppDispatch } from '@/lib/hooks'
import { useEffect } from 'react'

const useTaskTimer = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'tasks/updateTasksElapsedTime' })
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  return null;
}

export default useTaskTimer