import React from 'react'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/roles'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2 border-b border-primary/20 pb-4 mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">Admin Portal</h2>
        </div>
        {children}
      </div>
    </div>
  )
}
