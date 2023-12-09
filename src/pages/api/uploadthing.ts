import { createNextPageApiHandler } from 'uploadthing/next-legacy'
import { customFileRouter } from '@/server/uploadthing'

const handler = createNextPageApiHandler({
  router: customFileRouter
})

export default handler
