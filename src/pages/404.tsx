import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-xl">
        <span className="font-mono font-semibold">404</span> Page not found
      </p>
      <Link href="/" className="text-xl text-indigo underline">
        Go back to the main page
      </Link>
    </div>
  )
}