"use client"

import { useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { ProjectCard } from "./project-card"
import { ProjectForm } from "./project-form"
import { SearchTaskCard } from "./search-task-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskStatus, TASK_STATUS } from "@/constants"
import useTaskTimer from "@/hooks/use-task-timer"

export function ProjectsOverview() {
  const projects = useAppSelector((state) => state.projects.projects)
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useTaskTimer()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus>(TASK_STATUS.All)
  const [projectFilter, setProjectFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === TASK_STATUS.All || task.status === statusFilter
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter

    return matchesSearch && matchesStatus && matchesProject
  })

  const searchStats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter((t) => t.status === TASK_STATUS.TODO).length,
    inProgress: filteredTasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
    done: filteredTasks.filter((t) => t.status === TASK_STATUS.Done).length,
  }

  const hasActiveFilters = searchQuery || statusFilter !== TASK_STATUS.All || projectFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-muted-foreground">Manage your projects and search tasks</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">All Projects</TabsTrigger>
          <TabsTrigger value="search" className="relative">
            <Search className="h-4 w-4 mr-2" />
            Search Tasks
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {filteredTasks.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started</p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm onSuccess={() => setIsCreateDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value: TaskStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TASK_STATUS.All}>All Status</SelectItem>
                    <SelectItem value={TASK_STATUS.TODO}>Todo</SelectItem>
                    <SelectItem value={TASK_STATUS.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TASK_STATUS.Done}>Done</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Statistics */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium">{searchStats.total}</span> tasks found
                </div>
                <div className="flex gap-4 text-sm">
                  <span>
                    <Badge variant="secondary">{searchStats.todo}</Badge> Todo
                  </span>
                  <span>
                    <Badge variant="secondary">{searchStats.inProgress}</Badge> In Progress
                  </span>
                  <span>
                    <Badge variant="secondary">{searchStats.done}</Badge> Done
                  </span>
                </div>
              </div>
            )}

            {/* Search Results */}
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground">Create some projects and tasks to search through them</p>
              </div>
            ) : filteredTasks.length === 0 && hasActiveFilters ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter(TASK_STATUS.All)
                    setProjectFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {(hasActiveFilters ? filteredTasks : tasks).map((task) => {
                  // const project = projects.find((p) => p.id === task.projectId)
                  return <SearchTaskCard key={task.id} task={task} searchQuery={searchQuery} />
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
