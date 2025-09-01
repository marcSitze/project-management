import { TaskStatus } from "@/constants"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  estimatedTime: number // in minutes
  isRunning: boolean
  elapsedTime: number // in seconds
  startTime: number | null // timestamp in ms
  createdAt: string
  updatedAt: string
}

interface TasksState {
  tasks: Task[]
}

const initialState: TasksState = {
  tasks: [],
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        elapsedTime: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.tasks.push(newTask)
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Task, "id" | "createdAt">> }>) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex((t) => t.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    deleteTasksByProject: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.projectId !== action.payload)
    },
    taskStart: (state, action: PayloadAction<string>) => {
      // This can be used to set a task as active if needed
      state.tasks = state.tasks.map(task =>
        task.id === action.payload && !task.isRunning
          ? { ...task, isRunning: true, startTime: Date.now() }
          : task
      )
    },
    taskPause: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.map(task =>
        task.id === action.payload && task.isRunning
          ? { ...task, isRunning: false,
            elapsedTime: task.elapsedTime + Math.floor((Date.now() - (task.startTime ?? 0)) / 1000) / 60,
            startTime: 0,}
          : task
      )
    },
    taskReset: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.map(task =>
        task.id === action.payload
          ? { ...task, elapsedTime: 0, isRunning: false, startTime: 0 }
          : task
      )
    },
    updateTasksElapsedTime: (state) => {
      state.tasks = state.tasks.map(task => {
        if (!task.isRunning || !task.startTime) return task
        const now = Date.now()
        const delta = Math.floor((now - task.startTime) / 1000) / 60
        return {
          ...task,
          elapsedTime: task.elapsedTime + delta,
          startTime: now,
        }
      })
    }
  },
})

export const { addTask, updateTask, deleteTask, deleteTasksByProject, taskStart, taskPause, taskReset, updateTasksElapsedTime } = tasksSlice.actions
export default tasksSlice.reducer
