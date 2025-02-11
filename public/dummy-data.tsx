interface Tag {
  label: string
  id: string
}

export const tags: Tag[] = [
  {
    label: 'work',
    get id() {
      return this.label
    },
  },
  {
    label: 'personal',
    get id() {
      return this.label
    },
  },
  {
    label: 'shopping',
    get id() {
      return this.label
    },
  },
  {
    label: 'health',
    get id() {
      return this.label
    },
  },
  {
    label: 'learning',
    get id() {
      return this.label
    },
  },
]
