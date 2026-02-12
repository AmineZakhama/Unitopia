"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Search, MapPin, Layers, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Location, LocationType } from '@/types/prisma'
import { getLocations } from '@/app/actions/map'
import { locationTypeConfig } from '@/components/map/MapView'

// Dynamically import MapView with no SSR
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map Core...</div>
})

export default function CampusMapPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<LocationType | 'ALL'>('ALL')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [locations, setLocations] = useState<(Location & { averageRating?: number, totalReviews?: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function fetchLocations() {
      if (!isMounted) return

      try {
        setLoading(true)
        const result = await getLocations(selectedType === 'ALL' ? undefined : selectedType)
        if (result.success && result.data) {
          setLocations(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isMounted) {
      fetchLocations()
    }
  }, [selectedType, isMounted])

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleLocationSelect = (id: string) => {
    setSelectedLocation(id)
  }

  // Prevent any rendering until mounted to avoid hydration mismatch and window errors
  if (!isMounted) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col pt-4 pb-4 px-4 gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            Campus Navigator
          </h1>
          <p className="text-muted-foreground">Real-time room availability and navigation.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search rooms, labs, or equipment..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <Button variant="outline" size="icon" onClick={() => {
              setLoading(true)
              getLocations(selectedType === 'ALL' ? undefined : selectedType).then(res => {
                  if(res.success && res.data) setLocations(res.data)
                  setLoading(false)
              })
           }}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Sidebar - List View */}
        <Card className="flex flex-col h-full border-none shadow-xl bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <Tabs defaultValue="ALL" className="w-full" onValueChange={(v) => setSelectedType(v as any)}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="CLASSROOM">Rooms</TabsTrigger>
                <TabsTrigger value="LAB">Labs</TabsTrigger>
                <TabsTrigger value="OFFICE">Staff</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0">
            <ScrollArea className="h-full px-4 pb-4">
               <div className="space-y-3 pt-2">
                  {loading && locations.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">Loading specific location data...</div>
                  ) : filteredLocations.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">No locations found matching your filters.</div>
                  ) : (
                      filteredLocations.map((loc) => {
                         const config = locationTypeConfig[loc.type] || locationTypeConfig.OTHER
                         return (
                        <div 
                          key={loc.id}
                          onClick={() => handleLocationSelect(loc.id)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                              selectedLocation === loc.id 
                                ? 'bg-primary/5 border-primary shadow-sm' 
                                : 'bg-white border-slate-100 hover:border-primary/30'
                          }`}
                        >
                           <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-sm">{loc.name}</h3>
                              <Badge variant={loc.isAvailable ? 'outline' : 'secondary'} className={loc.isAvailable ? 'text-green-600 bg-green-50' : ''}>
                                {loc.isAvailable ? 'Available' : 'Busy'}
                              </Badge>
                           </div>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              {/* Render icon as text since it's an emoji in config */}
                              <span>{config.icon}</span> 
                              <span>{loc.building}, Floor {loc.floor}</span>
                              <span>•</span>
                              <span>Rm {loc.roomNumber}</span>
                           </div>
                           <div className="flex flex-wrap gap-1">
                              {loc.features.slice(0, 2).map((f, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{f}</span>
                              ))}
                              {loc.features.length > 2 && <span className="text-[10px] text-slate-400">+{loc.features.length - 2}</span>}
                           </div>
                        </div>
                      )
                    })
                  )}
               </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Content - Map */}
        <div className="lg:col-span-2 flex flex-col h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
             <MapView 
               locations={filteredLocations} 
               selectedLocation={selectedLocation} 
               onLocationSelect={handleLocationSelect} 
             />
        </div>
      </div>
    </div>
  )
}
