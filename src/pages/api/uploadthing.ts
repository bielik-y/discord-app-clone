import { createNextPageApiHandler } from 'uploadthing/next-legacy'
import { customFileRouter } from '@/lib/uploadthing'

const handler = createNextPageApiHandler({
  router: customFileRouter
})

export default handler
