interface SuccessToastProps {
  text?: string
}

function SuccessToast({ text }: SuccessToastProps) {
  return (
    <div className="flex p-1 text-sm">
      <div className="flex items-center shrink-0 font-bold text-emerald-600">
        <p className="mr-2">Success!</p>
      </div>
      <div>
        <span>
          {text ? text : ''}
        </span>
      </div>
    </div>
  )
}

export { SuccessToast }
