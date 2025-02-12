// import { GetServerSideProps } from 'next'
import { getXataClient } from '~/lib/xata'

const xata = getXataClient()

export default async function XataQueries() {
  const tasks = await xata.db.Tasks.getAll()

  return (
    <div>
      <h1>Xata Queries</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.xata_id}>{task.taskName}</li>
        ))}
      </ul>
    </div>
  )
}
