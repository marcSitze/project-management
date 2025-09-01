import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "@reduxjs/toolkit"
import projectsSlice from "./projectsSlice"
import tasksSlice from "./tasksSlice"
import { PROJECT_DASHBOARD_STATE } from "@/constants"

const rootReducer = combineReducers({
  projects: projectsSlice,
  tasks: tasksSlice,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)

  // Save state to localStorage after each action
  if (typeof window !== "undefined") {
    try {
      const state = store.getState()
      localStorage.setItem(PROJECT_DASHBOARD_STATE, JSON.stringify(state))
    } catch (error) {
      console.error("Failed to save state to localStorage:", error)
    }
  }

  return result
}

const loadStateFromLocalStorage = () => {
  if (typeof window === "undefined") return undefined

  try {
    const serializedState = localStorage.getItem(PROJECT_DASHBOARD_STATE)
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (error) {
    console.error("Failed to load state from localStorage:", error)
    return undefined
  }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadStateFromLocalStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
