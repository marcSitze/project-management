"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/lib/hooks"
import { addProject, updateProject, type Project } from "@/lib/projectsSlice"

interface ProjectFormProps {
  project?: Project
  onSuccess: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)

    try {
      if (project) {
        dispatch(
          updateProject({
            id: project.id,
            updates: formData,
          }),
        )
      } else {
        dispatch(addProject(formData))
      }
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
          {isSubmitting ? "Saving..." : project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
