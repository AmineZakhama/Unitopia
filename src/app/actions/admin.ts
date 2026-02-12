'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUserRole } from '@/lib/roles'
import { NotificationType, NotificationPriority, RecommendationType, RecommendationStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createNotification(data: {
    title: string,
    message: string,
    type: NotificationType,
    priority: NotificationPriority,
    targetRole?: string
}) {
    const role = await getCurrentUserRole()
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        await prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                priority: data.priority,
                targetRole: data.targetRole ? data.targetRole as any : null,
                readBy: []
            }
        })
        revalidatePath('/notifications')
        return { success: true }
    } catch (error) {
        console.error('Error creating notification:', error)
        return { success: false, error: 'Failed to create notification' }
    }
}

export async function createRecommendation(data: {
    title: string,
    description: string,
    type: RecommendationType,
    priority: number,
    tags: string[]
}) {
    const role = await getCurrentUserRole()
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // For demo purposes, we'll assign this recommendation to ALL student profiles
        // In a real app, you'd target specific users or have a "global" recommendation system
        const students = await prisma.studentProfile.findMany({ select: { studentId: true }})
        
        const recommendations = students.map((student: { studentId: string }) => ({
            studentId: student.studentId,
            title: data.title,
            description: data.description,
            type: data.type,
            status: RecommendationStatus.PENDING,
            priority: data.priority,
            tags: data.tags,
            metadata: { provider: 'University Admin', difficulty: 'Intermediate', estimatedHours: 5 }
        }))

        await prisma.recommendation.createMany({
            data: recommendations
        })

        revalidatePath('/recommendations')
        return { success: true, count: students.length }
    } catch (error) {
        console.error('Error creating recommendation:', error)
        return { success: false, error: 'Failed to create recommendation' }
    }
}
