'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map Core...</div>
})

export default function LeafletMapWrapper(props: any) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-full w-full bg-slate-50" />

  return <MapView {...props} />
}
