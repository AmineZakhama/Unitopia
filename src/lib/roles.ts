import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function getCurrentUserRole() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  return user?.role as UserRole || null
}

export async function isTeacher() {
    const role = await getCurrentUserRole()
    return role === 'TEACHER' || role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export async function isAdmin() {
    const role = await getCurrentUserRole()
    return role === 'ADMIN' || role === 'SUPER_ADMIN'
}
