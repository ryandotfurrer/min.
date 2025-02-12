import { Tasks } from '~/lib/xata'

export const taskService = {
  async getAllTasks() {
    const response = await fetch('/api/tasks')
    if (!response.ok) throw new Error('Failed to fetch tasks')
    return response.json()
  },

  async createTask(taskName: string) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName }),
    })
    if (!response.ok) throw new Error('Failed to create task')
    return response.json()
  },

  async updateTask(id: string, taskName: string) {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, taskName }),
    })
    if (!response.ok) throw new Error('Failed to update task')
    return response.json()
  },

  async deleteTask(id: string) {
    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error('Failed to delete task')
    return response.json()
  },
}
