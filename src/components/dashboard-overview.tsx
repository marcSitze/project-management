"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Circle, Users } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"
import { TASK_STATUS } from "@/constants"
import { formatTime } from "../utils/utils"

export function DashboardOverview() {
  const projects = useAppSelector((state) => state.projects.projects)
  const tasks = useAppSelector((state) => state.tasks.tasks)

  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const todoTasks = tasks.filter((task) => task.status === TASK_STATUS.TODO).length
    const inProgressTasks = tasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS).length
    const doneTasks = tasks.filter((task) => task.status === TASK_STATUS.Done).length

    const totalEstimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0)
    const totalSpentTime = tasks.reduce((sum, task) => sum + (task.elapsedTime || 0), 0)

    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
    const timeEfficiency = totalEstimatedTime > 0 ? Math.round((totalSpentTime / totalEstimatedTime) * 100) : 0

    return {
      totalProjects: projects.length,
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      totalEstimatedTime,
      totalSpentTime,
      completionRate,
      timeEfficiency,
    }
  }, [projects, tasks])

  const taskStatusData = [
    { name: TASK_STATUS.TODO, value: stats.todoTasks, color: "#64748b" },
    { name: TASK_STATUS.IN_PROGRESS, value: stats.inProgressTasks, color: "#3b82f6" },
    { name: TASK_STATUS.Done, value: stats.doneTasks, color: "#10b981" },
  ].filter((item) => item.value > 0)

  const projectTimeData = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id)
      const estimatedTime = projectTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
      const elapsedTime = projectTasks.reduce((sum, task) => sum + (task.elapsedTime || 0), 0)

      return {
        name: project.name.length > 15 ? project.name.substring(0, 15) + "..." : project.name,
        estimated: Math.round((estimatedTime / 60) * 100) / 100, // Convert to hours
        spent: Math.round((elapsedTime / 60) * 100) / 100,
      }
    })
  }, [projects, tasks])

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <p className="text-muted-foreground">Get insights into your projects and tasks</p>
        </div>

        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Projects Yet</h3>
          <p className="text-sm text-muted-foreground">Create your first project to see dashboard insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Get insights into your projects and tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.todoTasks} Todo
              </Badge>
              <Badge variant="default" className="text-xs">
                {stats.inProgressTasks} In Progress
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.doneTasks} Done
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.doneTasks} of {stats.totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Tracking</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeEfficiency}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTime(stats.totalSpentTime)} / {formatTime(stats.totalEstimatedTime)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {taskStatusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent = 0 }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {projectTimeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Spent vs Estimated (Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="estimated" fill="#e2e8f0" name="Estimated" />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => {
                const projectTasks = tasks.filter((task) => task.projectId === project.id)
                const completedTasks = projectTasks.filter((task) => task.status === TASK_STATUS.Done).length
                const totalProjectTasks = projectTasks.length
                const projectCompletion =
                  totalProjectTasks > 0 ? Math.round((completedTasks / totalProjectTasks) * 100) : 0
                const projectEstimated = projectTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
                const projectSpent = projectTasks.reduce((sum, task) => sum + (task.elapsedTime || 0), 0)

                return (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {totalProjectTasks} tasks
                        </Badge>
                        <Badge variant={projectCompletion === 100 ? "default" : "secondary"} className="text-xs">
                          {projectCompletion}% complete
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {formatTime(projectSpent)} / {formatTime(projectEstimated)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {projectEstimated > 0 ? Math.round((projectSpent / projectEstimated) * 100) : 0}% time used
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
