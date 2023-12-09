import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { hash, compare } from 'bcryptjs'
import type { GetServerSidePropsContext, PreviewData } from 'next/types'
import type { ParsedUrlQuery } from 'querystring'
import { User } from 'next-auth'

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

import { getCsrfToken } from 'next-auth/react'

export const updateSession = async (newSession: Record<string, any>) => {
  await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/session`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      csrfToken: await getCsrfToken(),
      data: newSession,
    }),
  })
}

// export async function navigateProtectedRoute(
//   context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
// ) {
//   const { req, res } = context
//   const session = await getServerSession(req, res, authOptions)
//   console.log(session)

//   if (!session)
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false
//       }
//     }
//   else {
//     const server = (session.user as User).server
//     if (server)
//       return {
//         redirect: {
//           destination: `/server/${server}`,
//           permanent: false
//         }
//       }
//     else
//       return {
//         props: {}
//       }
//   }
// }
