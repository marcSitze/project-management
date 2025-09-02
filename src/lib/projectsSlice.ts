import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface ProjectsState {
  projects: Project[]
}

const initialState: ProjectsState = {
  projects: [],
}

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Omit<Project, "id" | "createdAt" | "updatedAt">>) => {
      const newProject: Project = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.projects.push(newProject)
    },
    updateProject: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Omit<Project, "id" | "createdAt">> }>,
    ) => {
      const { id, updates } = action.payload
      const projectIndex = state.projects.findIndex((p) => p.id === id)
      if (projectIndex !== -1) {
        state.projects[projectIndex] = {
          ...state.projects[projectIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload)
    },
  },
})

export const { addProject, updateProject, deleteProject } = projectsSlice.actions
export default projectsSlice.reducer
