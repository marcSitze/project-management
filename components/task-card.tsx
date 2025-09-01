"use client"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TASK_STATUS, TaskStatus } from "@/constants"
import { useAppDispatch } from "@/lib/hooks"
import { deleteTask, taskPause, taskStart, updateTask, type Task } from "@/lib/tasksSlice"
import { formatTime, getStatusColor } from "@/utils/utils"
import { Clock, Edit, MoreHorizontal, Pause, Play, Trash2 } from "lucide-react"
import { useState } from "react"
import { TaskForm } from "./task-form"

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const dispatch = useAppDispatch()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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


  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
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
          {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

          <div className="flex items-center justify-between">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={`h-6 text-xs ${getStatusColor(task.status)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TASK_STATUS).map((status) => (
                  <SelectItem key={status} value={status} className={`text-xs ${getStatusColor(status)}`}>
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
              play
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
