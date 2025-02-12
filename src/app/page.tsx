'use client'

console.log(process.env)
import { Button } from '~/components/ui/button'
import { Calendar, Save, SquarePen, Target, Trash } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Heading } from '~/components/heading'
import { HGroup } from '~/components/hgroup'
import { Input } from '~/components/ui/input'
import { tags } from '../../public/dummy-data'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    toast.success('Task created')
  }

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
    toast.error('Task deleted')
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
    toast.success('Task completed')
  }

  const startEditing = (taskText: string) => {
    console.log('startEditing called with:', taskText)
    console.log('Current editingTask:', editingTask)
    setEditingTask(taskText)
    setEditedText(taskText)
  }

  const saveEdit = () => {
    console.log('saveEdit called, editingTask:', editingTask)
    if (editingTask === null) return
    setTasks(tasks.map((t) => (t === editingTask ? editedText : t)))
    setEditingTask(null)
    toast.success('Task updated')
  }

  return (
    <>
      <header>
        <HGroup subtitle="a simple task app">
          <Heading variant="h1" className="flex">
            min
            <span className="mt-2 self-end text-accent">•</span>
          </Heading>
          <Link href="./pages/xata-queries">Xata Queries</Link>
        </HGroup>
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
        <div className="border-t border-border py-4">
          <ul>
            {tasks.map((task) => {
              console.log('Rendering task:', task, 'editingTask:', editingTask)
              return (
                <div
                  key={task}
                  className="group rounded-md border border-transparent py-2 pl-2 transition-all hover:border-border hover:bg-card"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer justify-center accent-accent opacity-0 transition-opacity group-hover:opacity-100"
                      name={`${task}-checkbox`}
                      id={`${task}-checkbox`}
                      checked={completedTasks.has(task)}
                      onChange={() => completeTask(task)}
                    />
                    {editingTask === task ? (
                      <form
                        name={`edit-form-${task}`}
                        id={`edit-form-${task}`}
                        onSubmit={(e) => {
                          e.preventDefault()
                          saveEdit()
                        }}
                        className="w-full"
                      >
                        <input
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          autoFocus
                          type="text"
                          className="w-full translate-x-2 border-b border-border bg-inherit pr-2 text-inherit outline-none transition-colors duration-300 focus:bg-accent/20"
                        />
                      </form>
                    ) : (
                      <li
                        className={cn(
                          completedTasks.has(task)
                            ? 'text-foreground-muted line-through'
                            : 'text-foreground',
                          'w-full -translate-x-4 cursor-pointer border-b border-transparent pr-2 transition-transform group-hover:translate-x-2',
                        )}
                        key={task}
                        onClick={() => completeTask(task)}
                      >
                        {task}
                      </li>
                    )}
                    {editingTask === task ? (
                      <button
                        type="button"
                        className="inline-flex size-10 translate-x-4 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-muted-foreground opacity-0 ring-offset-background transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:translate-x-0 group-hover:opacity-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          saveEdit()
                        }}
                      >
                        <Save className="size-4 text-foreground-muted hover:text-foreground" />
                      </button>
                    ) : (
                      <button
                        id={`${task}-edit-button`}
                        type="button"
                        className="inline-flex size-10 translate-x-4 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-muted-foreground opacity-0 ring-offset-background transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:translate-x-0 group-hover:opacity-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(task)
                        }}
                      >
                        <SquarePen className="size-4 text-foreground-muted hover:text-foreground" />
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex translate-y-4 items-center opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <div
                      id="tags-container"
                      className="mr-auto flex gap-2 text-xs"
                    >
                      {tags
                        .sort(() => Math.random() - 0.5)
                        .slice(0, Math.floor(Math.random() * 3) + 1)
                        .map((tag) => (
                          <div
                            key={tag.id}
                            className="rounded-sm bg-muted px-1 text-xs"
                          >
                            {tag.label}
                          </div>
                        ))}
                    </div>
                    <div id="action-btn-container">
                      <Button variant="icon" size="icon">
                        <Calendar className="size-4 text-foreground-muted" />
                      </Button>
                      <Button variant="icon" size="icon">
                        <Target className="size-4 text-foreground-muted" />
                      </Button>
                      <button
                        className="inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-foreground-muted opacity-0 ring-offset-background transition-all hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:opacity-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                        onClick={() => deleteTask(tasks.indexOf(task))}
                      >
                        <Trash className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  )
}
