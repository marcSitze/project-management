import { TASK_STATUS, TaskStatus } from "@/constants"

export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)
  return `${hours}h ${mins}m`
}

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
    case TASK_STATUS.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
    case TASK_STATUS.Done:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
