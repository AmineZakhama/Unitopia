'use server'

import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationPriority } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getNotifications() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    
    if (!user) return { success: false, error: 'User not found' }

    // Fetch notifications targeted at user or their role
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetUsers: { has: user.id } },
          { targetRole: user.role },
          { targetRole: null } // All roles
        ]
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: notifications }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}

export async function markAsRead(notificationId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return { success: false, error: 'User not found' }

        await prisma.notification.update({
            where: { id: notificationId },
            data: {
                readBy: { push: user.id }
            }
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to mark as read' }
    }
}
