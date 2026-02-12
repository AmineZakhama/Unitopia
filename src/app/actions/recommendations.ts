'use server'

import { prisma } from '@/lib/prisma'
import { RecommendationType, RecommendationStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getRecommendations(status?: RecommendationStatus) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) return { success: false, error: 'User not found' }

    const recommendations = await prisma.recommendation.findMany({
      where: {
        studentId: user.id, // Assuming studentId maps to userId here for now, or fetch profile
        status: status,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    // logic to fetch from studentProfile if needed, but for now assuming direct link or we need to resolve studentId
    // Actually schema says studentId is String. Let's get the profile first.

    const profile = await prisma.studentProfile.findUnique({
        where: { userId: user.id }
    })
    
    if(!profile) return { success: false, error: 'Profile not found'}

    const recs = await prisma.recommendation.findMany({
        where: {
            studentId: profile.studentId,
            status
        },
        orderBy: { createdAt: 'desc'}
    })

    return { success: true, data: recs }
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return { success: false, error: 'Failed to fetch recommendations' }
  }
}

export async function updateRecommendationStatus(id: string, status: RecommendationStatus) {
  try {
    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: { status },
    })
    return { success: true, data: recommendation }
  } catch (error) {
    console.error('Error updating recommendation:', error)
    return { success: false, error: 'Failed to update recommendation' }
  }
}
