import { NextResponse } from 'next/server'
import { getXataClient } from '~/lib/xata'
import { Tasks } from '~/lib/xata'

const getClient = () => {
  return getXataClient()
}

export async function getAllTasks() {
  try {
    const xata = getClient()
    const tasks = await xata.db.Tasks.getAll()
    return tasks
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function createTask(task: Tasks) {
  const xata = getClient()
  const newTask = await xata.db.Tasks.create(task)
  return newTask
}

export async function updateTask(task: Tasks) {
  const xata = getClient()
  const updatedTask = await xata.db.Tasks.update(task)
  return updatedTask
}

export async function deleteTask(task: Tasks) {
  const xata = getClient()
  const deletedTask = await xata.db.Tasks.delete(task)
  return deletedTask
}

export async function GET() {
  try {
    const tasks = await getAllTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const task = await request.json()
    const newTask = await createTask(task)
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const task = await request.json()
    const updatedTask = await updateTask(task)
    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const task = await request.json()
    const deletedTask = await deleteTask(task)
    return NextResponse.json(deletedTask)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 },
    )
  }
}
