
"use client"

import { ReadinessScore } from "@/components/dashboard/readiness-score"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  ArrowRight, 
  Map as MapIcon, 
  Rocket,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Welcome to <span className="text-primary">Nexus University</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your utopian academic journey begins here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Post Update
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Rocket className="h-4 w-4" /> Start Learning
          </Button>
        </div>
      </div>

      {/* Primary Metrics */}
      <ReadinessScore />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Navigator Card */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-primary/5 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <MapIcon className="h-6 w-6 text-primary" />
                Campus Navigator
              </CardTitle>
              <p className="text-sm text-muted-foreground italic">Real-time room occupancy and facility guide</p>
            </div>
            <Link href="/map">
              <Button size="icon" variant="ghost" className="rounded-full group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-white/40 rounded-xl flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/400')] bg-cover opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-700" />
               <div className="z-10 text-center space-y-4">
                  <p className="font-medium text-lg text-primary">Exploring Laboratory C-12?</p>
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center">
                       <span className="text-2xl font-bold text-accent">Active</span>
                       <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-2xl font-bold text-primary">45%</span>
                       <span className="text-xs text-muted-foreground">Load</span>
                    </div>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Unified Notification Hub Mini */}
        <Card className="border-none shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Updates
            </CardTitle>
            <Link href="/notifications">
              <Button variant="link" size="sm" className="text-accent">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Robotics Club", desc: "New workshop on AI Ethics tomorrow.", time: "2h ago", color: "text-accent" },
              { title: "Admin", desc: "Spring Semester registration is open.", time: "5h ago", color: "text-primary" },
              { title: "Music Society", desc: "Jazz night at the Nexus Lounge.", time: "1d ago", color: "text-pink-500" }
            ].map((note, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className={`mt-1 h-2 w-2 rounded-full ${note.color.replace('text-', 'bg-')}`} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none">{note.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{note.desc}</p>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60">{note.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
