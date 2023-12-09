import { generateComponents } from '@uploadthing/react'
import type { CustomFileRouter } from '@/server/uploadthing'

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<CustomFileRouter>()
