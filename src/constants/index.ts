export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
export const TASK_STATUS = {
  All: "All",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  Done: "Done",
} as const

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

export const PROJECT_DASHBOARD_STATE = "project-dashboard-state";