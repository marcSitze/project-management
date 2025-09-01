"use client"

import { useState, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector } from "@/lib/hooks"
import { SearchTaskCard } from "./search-task-card"
import { TASK_STATUS, TaskStatus } from "@/constants"
import useTaskTimer from "@/hooks/use-task-timer"

export function TaskSearch() {
  const projects = useAppSelector((state) => state.projects.projects)
  const tasks = useAppSelector((state) => state.tasks.tasks)
  useTaskTimer()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus>(TASK_STATUS.All)
  const [projectFilter, setProjectFilter] = useState<string>("All")

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === TASK_STATUS.All || task.status === statusFilter

      const matchesProject = projectFilter === "All" || task.projectId === projectFilter

      return matchesSearch && matchesStatus && matchesProject
    })
  }, [tasks, searchQuery, statusFilter, projectFilter])

  const searchStats = useMemo(() => {
    const total = filteredTasks.length
    const todo = filteredTasks.filter((task) => task.status === TASK_STATUS.TODO).length
    const inProgress = filteredTasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS).length
    const done = filteredTasks.filter((task) => task.status === TASK_STATUS.Done).length

    return { total, todo, inProgress, done }
  }, [filteredTasks])

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter(TASK_STATUS.All)
    setProjectFilter("All")
  }

  const hasActiveFilters = searchQuery !== "" || statusFilter !== TASK_STATUS.All || projectFilter !== "All"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Search & Filter</h2>
        <p className="text-muted-foreground">Find and filter tasks across all projects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "All")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Badge variant="outline">{searchStats.total} total</Badge>
            {searchStats.todo > 0 && <Badge variant="secondary">{searchStats.todo} todo</Badge>}
            {searchStats.inProgress > 0 && <Badge variant="default">{searchStats.inProgress} in progress</Badge>}
            {searchStats.done > 0 && <Badge variant="outline">{searchStats.done} done</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {tasks.length === 0 ? "No Tasks Found" : "No Matching Tasks"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tasks.length === 0
                  ? "Create some tasks to start searching"
                  : hasActiveFilters
                    ? "Try adjusting your search criteria"
                    : "No tasks match your search"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <SearchTaskCard key={task.id} task={task} searchQuery={searchQuery} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
