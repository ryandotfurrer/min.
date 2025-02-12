'use client'

import { useEffect, useState } from 'react'
import { Tasks } from '~/lib/xata'
import Link from 'next/link'
import { Input } from '~/components/input'
import { Button } from '~/components/button'
import { taskService } from '~/lib/services/taskService'
// import { Checkbox } from '~/components/ui/checkbox'

export default function ClientQuery() {
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editedTaskName, setEditedTaskName] = useState('')

  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks = await taskService.getAllTasks()
        setTasks(fetchedTasks)
      } catch (err) {
        setError('Failed to fetch tasks')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.xata_id !== taskId))
    } catch (err) {
      console.error(err)
      setError('Failed to delete task')
    }
  }

  const handleUpdate = async (taskId: string) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, editedTaskName)
      setTasks((prev) =>
        prev.map((task) => (task.xata_id === taskId ? updatedTask : task)),
      )
      setEditingTask(null)
      setEditedTaskName('')
    } catch (err) {
      console.error(err)
      setError('Failed to update task')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <Link href="/">Back</Link>
      <h1 className="mb-6 text-2xl font-bold">Client-side Tasks</h1>
      <section id="task-list">
        <h2 className="mb-4 text-xl font-bold">Tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.xata_id}
              className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/10"
            >
              {editingTask === task.xata_id ? (
                <Input
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                  className="max-w-sm"
                  autoFocus
                />
              ) : (
                <span>{task.taskName}</span>
              )}
              <div className="flex gap-2">
                {editingTask === task.xata_id ? (
                  <Button
                    onClick={() => handleUpdate(task.xata_id)}
                    variant="secondary"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditingTask(task.xata_id)
                      setEditedTaskName(task.taskName || '')
                    }}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(task.xata_id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section id="task-form">
        <h2 className="mb-4 mt-8 text-xl font-bold">Add Task</h2>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const input = form.elements.namedItem(
              'taskName',
            ) as HTMLInputElement

            try {
              const newTask = await taskService.createTask(input.value)
              setTasks((prev) => [...prev, newTask])
              form.reset()
            } catch (err) {
              console.error(err)
              setError('Failed to create task')
            }
          }}
        >
          <Input
            name="taskName"
            placeholder="Enter a new task"
            required
            className="max-w-sm"
          />
          <Button type="submit">Add Task</Button>
        </form>
      </section>
    </div>
  )
}
