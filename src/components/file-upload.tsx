import { UploadDropzone } from '@/lib/uploadthing'
import { X } from 'lucide-react'
import Image from 'next/image'
import '@uploadthing/react/styles.css'

const ENDPOINT = 'serverImage'

interface FileUploadProps {
  onChange: (url?: string) => void
  value: string
}

function FileUpload({ onChange, value }: FileUploadProps) {
  if (value)
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Uploaded image" className="rounded-full" />
        <button
          type="button"
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-md"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  return (
    <UploadDropzone
      endpoint={ENDPOINT}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(err: Error) => {
        console.log(err)
      }}
    />
  )
}

export { FileUpload }
