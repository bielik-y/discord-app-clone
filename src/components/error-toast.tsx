interface ErrorToastProps {
  text?: string
  error?: any
}

function ErrorToast({ text, error = null }: ErrorToastProps) {
  let message = text

  if (error) {
    if (error.response) message = error.response.data.message
    else if (error.request) message = 'No server response. Try later.'
    else message = 'Sending request failed. Try again!'
  }

  return (
    <div className="flex p-1 text-sm">
      <div className="flex items-center shrink-0 font-bold text-red-600">
        <p className=" mr-2">Error:</p>{' '}
      </div>
      <div>
        <span>
          {message ? message : 'Oops, something went wrong. Try again!'}
        </span>
      </div>
    </div>
  )
}

export { ErrorToast }
