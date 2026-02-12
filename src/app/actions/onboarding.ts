'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function checkProfileStatus() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { studentProfile: true }
  })

  // If user has a student profile, they are onboarded
  return { 
      success: true, 
      hasProfile: !!user?.studentProfile,
      userId: user?.id
  }
}

export async function createStudentProfile(data: {
    yearOfStudy: number,
    major: string,
    interests: string[]
}) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { success: false, error: 'Unauthorized' }

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return { success: false, error: 'User not found' }

        // Create the profile
        const profile = await prisma.studentProfile.create({
            data: {
                userId: user.id,
                yearOfStudy: data.yearOfStudy,
                major: data.major,
                interests: data.interests,
                // Initialize scores
                readinessScore: 500,
                citizenshipScore: 500,
                selfManagementScore: 500,
                // Initialize default components
                readinessComponents: {
                    learningDiscipline: 50,
                    skillGrowth: 50,
                    engagement: 50,
                    careerReadiness: 50,
                    autonomy: 50
                },
                citizenshipComponents: {
                    sharedNotes: 0,
                    helpedPeers: 0,
                    reportedIssues: 0,
                    gaveFeedback: 0,
                    qualityContributions: 0
                },
                selfManagementComponents: {
                    appointments: 100,
                    deadlines: 100,
                    attendance: 100,
                    adminInteractions: 100
                }
            }
        })

        // Also create a learning streak record
        await prisma.learningStreak.create({
            data: {
                studentId: profile.studentId,
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: new Date()
            }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error creating profile:', error)
        return { success: false, error: 'Failed to create profile' }
    }
}
