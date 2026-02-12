'use server'

import { prisma } from '@/lib/prisma'
import { Location, LocationType } from '@/types/prisma'

export async function getLocations(type?: LocationType) {
  try {
    const locations = await prisma.location.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { name: 'asc' },
    })
    return { success: true, data: locations as unknown as Location[] }
  } catch (error) {
    console.error('Error fetching locations:', error)
    return { success: false, error: 'Failed to fetch locations' }
  }
}

export async function getLocationById(id: string) {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        ratings: true,
      },
    })
    return { success: true, data: location as unknown as Location }
  } catch (error) {
    console.error('Error fetching location:', error)
    return { success: false, error: 'Failed to fetch location' }
  }
}

export async function updateLocationStatus(id: string, isAvailable: boolean) {
  try {
    const location = await prisma.location.update({
      where: { id },
      data: { isAvailable },
    })
    return { success: true, data: location }
  } catch (error) {
    console.error('Error updating location status:', error)
    return { success: false, error: 'Failed to update location status' }
  }
}
