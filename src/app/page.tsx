'use client'

import { Button } from '~/components/ui/button'
import { Calendar, Ellipsis, Pencil, Target, Trash2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import { useState, useEffect } from 'react'

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([])
  const [task, setTask] = useState<string>('')
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>('')

  useEffect(() => {
    const savedTasks = sessionStorage.getItem('tasks')
    const savedCompletedTasks = sessionStorage.getItem('completedTasks')

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedCompletedTasks) {
      setCompletedTasks(new Set(JSON.parse(savedCompletedTasks)))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    sessionStorage.setItem(
      'completedTasks',
      JSON.stringify(Array.from(completedTasks)),
    )
  }, [completedTasks])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTasks([...tasks, task])
    setTask('')
  }

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const completeTask = (taskKey: string) => {
    setCompletedTasks((prev) => {
      const newCompleted = new Set(prev)
      if (newCompleted.has(taskKey)) {
        newCompleted.delete(taskKey)
      } else {
        newCompleted.add(taskKey)
      }
      return newCompleted
    })
  }

  const startEditing = (taskText: string) => {
    setEditingTask(taskText)
    setEditedText(taskText)
  }

  const saveEdit = () => {
    if (editingTask === null) return
    setTasks(tasks.map((t) => (t === editingTask ? editedText : t)))
    setEditingTask(null)
  }

  return (
    <>
      <header>
        <hgroup className="pb-12">
          <h1 className="flex text-4xl font-semibold leading-none tracking-tight text-foreground">
            min
            <span className="mt-2 self-end text-accent">•</span>
          </h1>
          <p className="text-xl">a simple task app</p>
        </hgroup>
      </header>
      <main className="space-y-1">
        <form className="mb-12 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="add a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <Button type="submit" className="self-end">
            add task
          </Button>
        </form>
        <div className="border-t py-4">
          <ul>
            {tasks.map((task) => (
              <div
                key={task}
                className="group gap-4 rounded-md border border-transparent p-2 transition-all hover:border-border hover:bg-card"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="size-4 cursor-pointer justify-center accent-accent opacity-0 transition-opacity checked:bg-accent group-hover:opacity-100"
                    name={`${task}-checkbox`}
                    id={`${task}-checkbox`}
                    checked={completedTasks.has(task)}
                    onChange={() => completeTask(task)}
                  />
                  {editingTask === task ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveEdit()
                      }}
                      className="flex-1 -translate-x-8 transition-transform group-hover:translate-x-0"
                    >
                      <Input
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onBlur={saveEdit}
                        autoFocus
                        className="p-0"
                      />
                    </form>
                  ) : (
                    <li
                      className={cn(
                        completedTasks.has(task)
                          ? 'text-foreground-muted line-through'
                          : 'text-foreground',
                        'w-full -translate-x-8 cursor-pointer transition-transform group-hover:translate-x-0',
                      )}
                      key={task}
                      onClick={() => completeTask(task)}
                    >
                      {task}
                    </li>
                  )}
                  <button
                    id={`${task}-edit-button`}
                    type="button"
                    className="translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    onClick={() => startEditing(task)}
                  >
                    <Pencil className="size-4 text-foreground-muted hover:text-foreground" />
                  </button>
                </div>
                <div className="mt-4 flex translate-y-4 items-center gap-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <div
                    id="tags-container"
                    className="mr-auto flex gap-2 text-xs"
                  >
                    <p className="rounded-sm bg-secondary p-1">tag</p>
                    <p className="rounded-sm bg-secondary p-1">tag</p>
                    <p className="rounded-sm bg-secondary p-1">tag</p>
                  </div>
                  <button disabled>
                    <Calendar className="size-4 text-foreground-muted" />
                  </button>
                  <button disabled>
                    <Target className="size-4 text-foreground-muted" />
                  </button>
                  <button onClick={() => deleteTask(tasks.indexOf(task))}>
                    <Trash2 className="size-4 text-foreground-muted hover:text-destructive" />
                  </button>
                  <button disabled>
                    <Ellipsis className="size-4 text-foreground-muted" />
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
