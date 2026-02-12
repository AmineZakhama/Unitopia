'use server'

import { prisma } from '@/lib/prisma'
import { CitizenshipType, ReadinessType, SelfManagementType, EventStatus, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getStudentProfile() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) return { success: false, error: 'Profile not found' }

  return { success: true, data: user.studentProfile }
}

export async function addReadinessActivity(type: ReadinessType, description: string, points: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    })

    if (!user?.studentProfile) return { success: false, error: 'Student profile not found' }

    // Use transaction to update score and add activity
    const result = await prisma.$transaction(async (tx) => {
      const activity = await tx.readinessActivity.create({
        data: {
          studentId: user.studentProfile!.studentId,
          type,
          description,
          points,
        },
      })

      const updatedProfile = await tx.studentProfile.update({
        where: { id: user.studentProfile!.id },
        data: {
          readinessScore: { increment: points },
        },
      })

      return { activity, updatedProfile }
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error adding readiness activity:', error)
    return { success: false, error: 'Failed to add activity' }
  }
}

export async function addCitizenshipActivity(type: CitizenshipType, description: string, points: number) {
   const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    })

    if (!user?.studentProfile) return { success: false, error: 'Student profile not found' }

    const result = await prisma.$transaction(async (tx) => {
      const activity = await tx.citizenshipActivity.create({
        data: {
          studentId: user.studentProfile!.studentId,
          type,
          description,
          points,
        },
      })

      const updatedProfile = await tx.studentProfile.update({
        where: { id: user.studentProfile!.id },
        data: {
          citizenshipScore: { increment: points },
        },
      })

      return { activity, updatedProfile }
    })

    return { success: true, data: result }
  } catch (error) {
     console.error('Error adding citizenship activity:', error)
    return { success: false, error: 'Failed to add activity' }
  }
}

export async function getRecentActivities(limit = 10) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true }
    })

    if (!user?.studentProfile) return { success: false, error: 'Student profile not found' }

    // Combine activities from different tables if needed, for now just readiness and citizenship
    // Actually schema separates them. We might want to fetch both and sort.
    const readiness = await prisma.readinessActivity.findMany({
      where: { studentId: user.studentProfile.studentId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    const citizenship = await prisma.citizenshipActivity.findMany({
      where: { studentId: user.studentProfile.studentId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Combine and sort
    const allActivities = [
        ...readiness.map(a => ({ ...a, category: 'readiness', date: a.createdAt })),
        ...citizenship.map(a => ({ ...a, category: 'citizenship', date: a.createdAt }))
    ].sort((a: any, b: any) => b.date.getTime() - a.date.getTime()).slice(0, limit);

    return { success: true, data: allActivities }
  } catch (error) {
    console.error('Error fetching activities:', error)
    return { success: false, error: 'Failed to fetch activities' }
  }
}

export async function getLearningStreak() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true }
    })

    if (!user?.studentProfile) return { success: false, error: 'Student profile not found' }

    const streak = await prisma.learningStreak.findUnique({
      where: { studentId: user.studentProfile.studentId }
    })

    return { success: true, data: streak || { currentStreak: 0, longestStreak: 0 } }
  } catch (error) {
    console.error('Error fetching streak:', error)
    return { success: false, error: 'Failed to fetch streak' }
  }
}
