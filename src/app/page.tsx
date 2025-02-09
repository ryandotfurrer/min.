'use client'

import { Button } from '~/components/ui/button'
import { Calendar, Ellipsis, Target, Trash2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import { useState, useEffect } from 'react'

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([])
  const [task, setTask] = useState<string>('')
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

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

  const handleDelete = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const handleComplete = (taskKey: string) => {
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
      <main className="space-y-12">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          <ul className="space-y-1">
            {tasks.map((task) => (
              <div
                key={task}
                className="group -ml-2 flex items-center rounded-md border border-transparent p-2 transition-all hover:border-border hover:bg-card"
              >
                <div className="mr-auto flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="cursor-pointer accent-accent opacity-0 transition-opacity checked:bg-accent group-hover:opacity-100"
                    name=""
                    id=""
                    checked={completedTasks.has(task)}
                    onChange={() => handleComplete(task)}
                  />
                  <li
                    className={cn(
                      completedTasks.has(task)
                        ? 'text-foreground-muted line-through'
                        : 'text-foreground',
                      '-translate-x-4 cursor-pointer transition-transform group-hover:translate-x-0',
                    )}
                    key={task}
                    onClick={() => handleComplete(task)}
                  >
                    {task}
                  </li>
                </div>
                <div className="flex translate-x-4 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <button disabled>
                    <Calendar className="text-foreground-muted size-4" />
                  </button>
                  <button disabled>
                    <Target className="text-foreground-muted size-4" />
                  </button>
                  <button
                    className=""
                    onClick={() => handleDelete(tasks.indexOf(task))}
                  >
                    <Trash2 className="text-foreground-muted size-4 hover:text-destructive" />
                  </button>
                  <button disabled>
                    <Ellipsis className="text-foreground-muted size-4" />
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
