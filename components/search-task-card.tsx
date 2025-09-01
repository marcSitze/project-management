"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Clock, Play, Pause, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteTask, taskPause, taskStart, updateTask, type Task } from "@/lib/tasksSlice"
import { TaskForm } from "./task-form"
import { TASK_STATUS, TaskStatus } from "@/constants"
import { formatTime, getStatusColor } from "@/utils/utils"

interface SearchTaskCardProps {
  task: Task
  searchQuery: string
}

export function SearchTaskCard({ task, searchQuery }: SearchTaskCardProps) {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((state) => state.projects.projects)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const project = projects.find((p) => p.id === task.projectId)

  const handleDelete = () => {
    if (task.isRunning) {
      dispatch(taskPause(task.id))
    }
    dispatch(deleteTask(task.id))
    setIsDeleteDialogOpen(false)
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    dispatch(updateTask({ id: task.id, updates: { status: newStatus } }))
  }

  const handleTimerToggle = () => {
    if (task.isRunning) {
      dispatch(taskPause(task.id))
    } else {
      dispatch(taskStart(task.id))
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h4 className="font-medium text-sm leading-tight">{highlightText(task.title, searchQuery)}</h4>
              {project && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span>{project.name}</span>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{highlightText(task.description, searchQuery)}</p>
          )}

          <div className="flex items-center justify-between">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={`${getStatusColor(task.status)} h-6 text-xs`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TASK_STATUS).map((status) => (
                  <SelectItem key={status} value={status} className={`${getStatusColor(status)} text-xs`}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant={task.isRunning ? "destructive" : "outline"}
              onClick={handleTimerToggle}
              className="h-6 px-2"
            >
              {task.isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {formatTime(task.elapsedTime)} / {formatTime(task.estimatedTime)}
              </span>
            </div>

            {task.isRunning && (
              <Badge variant="destructive" className="text-xs">
                Running
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm projectId={task.projectId} task={task} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
