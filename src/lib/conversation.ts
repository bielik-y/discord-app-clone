import { db } from '@/lib/db'

export async function getOrCreateConversation(
  memberOneId: string,
  memberTwoId: string
) {
  // The order of id's defines the user who started conversation
  // To find conversation we need to check both variants
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))
  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId)
  }
  return conversation
}

async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }]
      },
      include: {
        memberOne: {
          include: {
            user: true
          }
        },
        memberTwo: {
          include: {
            user: true
          }
        }
      }
    })
  } catch {
    return null
  }
}

async function createConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId
      },
      include: {
        memberOne: {
          include: {
            user: true
          }
        },
        memberTwo: {
          include: {
            user: true
          }
        }
      }
    })
  } catch {
    return null
  }
}
