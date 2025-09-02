"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteProject, type Project } from "@/lib/projectsSlice"
import { deleteTasksByProject } from "@/lib/tasksSlice"
import { ProjectForm } from "./project-form"
import { KanbanBoard } from "./kanban-board"
import { TASK_STATUS } from "@/constants"
import { formatTime, getStatusColor } from "../utils/utils"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.tasks.filter((task) => task.projectId === project.id))
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isKanbanOpen, setIsKanbanOpen] = useState(false)

  const handleDelete = () => {
    dispatch(deleteTasksByProject(project.id))
    dispatch(deleteProject(project.id))
    setIsDeleteDialogOpen(false)
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === TASK_STATUS.TODO).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
    done: tasks.filter((t) => t.status === TASK_STATUS.Done).length,
  }

  const totalEstimated = tasks.reduce((sum, task) => sum + task.estimatedTime, 0)
  const totalSpent = tasks.reduce((sum, task) => sum + (task.elapsedTime || 0), 0)

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsKanbanOpen(true)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditDialogOpen(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleteDialogOpen(true)
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tasks</span>
              <Badge variant="secondary">{taskStats.total}</Badge>
            </div>

            {taskStats.total > 0 && (
              <div className="flex gap-1">
                <Badge variant="outline" className={`text-xs ${getStatusColor("To Do")}`}>
                  Todo: {taskStats.todo}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor("In Progress")}`}>
                  Progress: {taskStats.inProgress}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor("Done")}`}>
                  Done: {taskStats.done}
                </Badge>
              </div>
            )}
          </div>

          {taskStats.total > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatTime(totalSpent)} / {formatTime(totalEstimated)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm project={project} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This will also delete all associated tasks. This action
              cannot be undone.
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

      {/* Kanban Board Dialog */}
      <Dialog open={isKanbanOpen} onOpenChange={setIsKanbanOpen}>
        <DialogContent className="max-w-4/5! w-full max-h-[90vh] overflow-scroll">
          <DialogHeader>
            <DialogTitle>{project.name} - Task Board</DialogTitle>
          </DialogHeader>
          <KanbanBoard projectId={project.id} />
        </DialogContent>
      </Dialog>
    </>
  )
}
