"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TASK_STATUS, TaskStatus } from "@/constants"
import { useAppSelector } from "@/lib/hooks"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TaskCard } from "./task-card"
import { TaskForm } from "./task-form"

interface KanbanBoardProps {
  projectId: string
}

const statusColumns: { status: TaskStatus; title: string; color: string }[] = [
  { status: TASK_STATUS.TODO, title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
  { status: TASK_STATUS.IN_PROGRESS, title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/20" },
  { status: TASK_STATUS.Done, title: "Done", color: "bg-green-100 dark:bg-green-900/20" },
]

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const tasks = useAppSelector((state) => state.tasks.tasks.filter((task) => task.projectId === projectId))
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(TASK_STATUS.TODO)

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleCreateTask = (status: TaskStatus) => {
    setSelectedStatus(status)
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
      <div className="flex gap-6 flex-wrap">
    </div>
        <div className="grid grid-cols-3 gap-4 h-full">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.status)

            return (
              <div key={column.status} className="flex flex-col h-full">
                <div className={`rounded-lg p-4 ${column.color} mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      {column.title} ({columnTasks.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCreateTask(column.status)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId={projectId}
            initialStatus={selectedStatus}
            onSuccess={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
