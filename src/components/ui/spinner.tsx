import SyncLoader from 'react-spinners/SyncLoader'
import colors from 'tailwindcss/colors'

function Spinner({ loading }: { loading: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <SyncLoader color={colors.indigo['500']} loading={loading} size={6} />
    </div>
  )
}

export { Spinner }
