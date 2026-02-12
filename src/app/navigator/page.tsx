
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  Users, 
  Zap, 
  Info,
  Clock,
  Layers
} from "lucide-react"

const facilities = [
  { id: "L1", name: "Quantum Physics Lab", type: "Lab", status: "Full", load: 95, color: "text-red-500", coords: "top-[20%] left-[30%]" },
  { id: "C1", name: "Central Auditorium", type: "Room", status: "Available", load: 20, color: "text-green-500", coords: "top-[40%] left-[50%]" },
  { id: "S1", name: "Innovation Studio", type: "Lab", status: "Busy", load: 70, color: "text-orange-500", coords: "top-[60%] left-[25%]" },
  { id: "R4", name: "Creative Writing Suite", type: "Room", status: "Available", load: 10, color: "text-green-500", coords: "top-[15%] left-[70%]" },
  { id: "T2", name: "Tech Commons", type: "Hub", status: "Active", load: 45, color: "text-blue-500", coords: "top-[75%] left-[65%]" },
]

export default function NavigatorPage() {
  const [selected, setSelected] = useState(facilities[0])
  const [search, setSearch] = useState("")

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" />
            Nexus Navigator
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time visual map of campus labs, classrooms, and social hubs.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search facility or room..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Interactive Map Layout */}
        <Card className="lg:col-span-2 border-none shadow-2xl relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative h-full w-full flex items-center justify-center">
             {/* Schematic Visual */}
             <div className="w-[80%] h-[70%] border-2 border-dashed border-primary/20 rounded-[4rem] relative">
                {facilities.map((f) => (
                  <div 
                    key={f.id} 
                    className={`absolute ${f.coords} group cursor-pointer transition-all duration-300 hover:scale-110`}
                    onClick={() => setSelected(f)}
                  >
                    <div className={`p-3 rounded-2xl bg-white shadow-xl border-2 ${selected.id === f.id ? 'border-primary' : 'border-transparent'} flex items-center justify-center relative`}>
                      <MapPin className={`h-6 w-6 ${f.color}`} />
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-ping" />
                    </div>
                    <span className="mt-2 block text-[10px] font-bold text-center bg-white/80 px-2 rounded-full shadow-sm">{f.id}</span>
                  </div>
                ))}
                
                {/* Connecting Lines (Decorative) */}
                <div className="absolute top-[30%] left-[40%] w-40 h-[2px] bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 -rotate-12" />
                <div className="absolute top-[60%] left-[40%] w-60 h-[2px] bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 rotate-45" />
             </div>
          </div>
          
          <div className="absolute bottom-6 left-6 flex gap-4">
             <Badge className="bg-white/80 backdrop-blur text-foreground border shadow-sm px-3 py-1 gap-1">
               <Users className="h-3 w-3 text-primary" /> 1,240 Students Active
             </Badge>
             <Badge className="bg-white/80 backdrop-blur text-foreground border shadow-sm px-3 py-1 gap-1">
               <Zap className="h-3 w-3 text-accent" /> Eco-Grid: 100%
             </Badge>
          </div>
        </Card>

        {/* Info Side Panel */}
        <div className="space-y-6 overflow-auto pr-2">
          <Card className="border-none shadow-xl border-l-4 border-l-primary overflow-hidden">
             <div className="h-32 bg-primary/10 flex items-center justify-center">
                <div className="text-center">
                   <p className="text-xs uppercase font-bold text-primary tracking-widest">Active Focus</p>
                   <h2 className="text-2xl font-headline font-bold">{selected.name}</h2>
                </div>
             </div>
             <CardContent className="pt-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-bold">CURRENT STATUS</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${selected.color.replace('text-', 'bg-')}`} />
                        <span className="font-bold">{selected.status}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-muted-foreground font-bold">LOAD</p>
                      <span className="text-2xl font-headline font-bold text-primary">{selected.load}%</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-bold">Access Hours</p>
                        <p className="text-xs text-muted-foreground">08:00 AM - 10:00 PM</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-bold">Occupancy Limit</p>
                        <p className="text-xs text-muted-foreground">Max 25 Seats | 4 Available</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-bold">Resources</p>
                        <p className="text-xs text-muted-foreground">High-Speed Fibre, 3D Printers, Cloud Nodes</p>
                      </div>
                   </div>
                </div>

                <Button className="w-full shadow-lg shadow-primary/20">Reserve Study Spot</Button>
             </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Popular Locations</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
                {facilities.map((f) => (
                   <div 
                    key={f.id} 
                    onClick={() => setSelected(f)}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors ${selected.id === f.id ? 'bg-primary/10' : ''}`}
                   >
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-muted-foreground">{f.id}</span>
                        <span className="text-sm font-medium">{f.name}</span>
                     </div>
                     <Badge variant="outline" className="text-[10px] uppercase font-bold">{f.status}</Badge>
                   </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
