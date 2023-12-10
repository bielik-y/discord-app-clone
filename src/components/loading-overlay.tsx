import SyncLoader from 'react-spinners/SyncLoader'
import colors from 'tailwindcss/colors'

// Full screen overlay can be placed anywhere

function LoadingOverlay({ loading }: { loading: boolean }) {
  return (
    <div
      {...(loading && {
        className:
          'absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center opacity-70 bg-background'
      })}
    >
      <SyncLoader color={colors.indigo['500']} loading={loading} size={6} />
    </div>
  )
}

export { LoadingOverlay }
