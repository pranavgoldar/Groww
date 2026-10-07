import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-xl font-semibold">We couldn’t find that page</h1>
      <p className="mt-2 text-sm text-ink-2">This prototype covers a small set of demo stocks.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white">
        Go to Home
      </Link>
    </main>
  )
}
