"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch } from "@/lib/hooks"
import { addTask, updateTask, type Task } from "@/lib/tasksSlice"
import { TASK_STATUS, TaskStatus } from "@/constants"

interface TaskFormProps {
  projectId: string
  task?: Task
  initialStatus?: TaskStatus
  onSuccess: () => void
}

export function TaskForm({ projectId, task, initialStatus = TASK_STATUS.TODO, onSuccess }: TaskFormProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || initialStatus,
    estimatedHours: Math.floor((task?.estimatedTime || 0) / 60).toString(),
    estimatedMinutes: ((task?.estimatedTime || 0) % 60).toString(),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)

    try {
      const estimatedTime =
        Number.parseInt(formData.estimatedHours || "0") * 60 + Number.parseInt(formData.estimatedMinutes || "0")

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        estimatedTime,
      }

      if (task) {
        dispatch(
          updateTask({
            id: task.id,
            updates: taskData,
          }),
        )
      } else {
        dispatch(
          addTask({
            ...taskData,
            projectId,
            isRunning: false,
            elapsedTime: 0,
            startTime: null
          }),
        )
      }
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: TaskStatus) => setFormData((prev) => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TASK_STATUS).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Estimated Time</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              min="0"
              max="999"
              value={formData.estimatedHours}
              onChange={(e) => setFormData((prev) => ({ ...prev, estimatedHours: e.target.value }))}
              placeholder="Hours"
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              min="0"
              max="59"
              value={formData.estimatedMinutes}
              onChange={(e) => setFormData((prev) => ({ ...prev, estimatedMinutes: e.target.value }))}
              placeholder="Minutes"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
          {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
