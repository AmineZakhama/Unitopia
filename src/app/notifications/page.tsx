
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  Flag, 
  CheckCircle,
  MoreVertical,
  Search
} from "lucide-react"

const notifications = [
  { id: 1, type: "Admin", title: "Semester Kickoff Event", content: "Join us in the Central Auditorium for the utopian future kickoff ceremony.", time: "1 hour ago", unread: true, priority: "High" },
  { id: 2, type: "Club", title: "Nexus Robotics: New Workshop", content: "Learn advanced robotics and AI ethics this Friday at Studio S1.", time: "3 hours ago", unread: true, priority: "Medium" },
  { id: 3, type: "Academic", title: "Score Milestone Reached!", content: "Congratulations! Your 'University Readiness Score' has reached 80%.", time: "5 hours ago", unread: false, priority: "Normal" },
  { id: 4, type: "System", title: "Scheduled Maintenance", content: "The Nexus Navigator will be offline for 10 minutes tonight at 02:00 AM.", time: "1 day ago", unread: false, priority: "Low" },
  { id: 5, type: "Club", title: "Sustainable Living Club", content: "Recycling drive results are in: We reached our 100% goal!", time: "2 days ago", unread: false, priority: "Medium" },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notification Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay synchronized with the university ecosystem.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Mark all as read</Button>
          <Button size="sm">Notification Settings</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-white/50 border">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="admin">Administration</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Flag className="h-3 w-3 text-red-500" /> High</span>
            <span className="flex items-center gap-1 ml-2"><Flag className="h-3 w-3 text-yellow-500" /> Medium</span>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {notifications.map((note) => (
            <Card 
              key={note.id} 
              className={`border-none shadow-md overflow-hidden transition-all hover:translate-x-1 ${note.unread ? 'bg-white' : 'bg-white/60 opacity-80'}`}
            >
              <CardContent className="p-0 flex">
                <div className={`w-1.5 ${
                  note.type === 'Admin' ? 'bg-primary' : 
                  note.type === 'Club' ? 'bg-accent' : 
                  note.type === 'Academic' ? 'bg-green-500' : 'bg-muted'
                }`} />
                <div className="flex-1 p-5 flex gap-4">
                  <div className={`p-3 rounded-xl h-fit ${
                    note.type === 'Admin' ? 'bg-primary/10 text-primary' : 
                    note.type === 'Club' ? 'bg-accent/10 text-accent' : 
                    note.type === 'Academic' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {note.type === 'Admin' ? <Flag className="h-5 w-5" /> : 
                     note.type === 'Club' ? <Calendar className="h-5 w-5" /> : 
                     note.type === 'Academic' ? <CheckCircle className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-headline font-bold ${note.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {note.title}
                        </h3>
                        {note.unread && <Badge className="h-2 w-2 rounded-full p-0 bg-primary" />}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{note.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <Badge variant="outline" className="text-[10px] tracking-widest">{note.type}</Badge>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">View Details</Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Placeholder for other tabs */}
        <TabsContent value="admin" className="py-20 text-center">
          <Flag className="h-12 w-12 text-primary/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-headline text-lg">Filtering for Administration announcements...</p>
        </TabsContent>
        <TabsContent value="clubs" className="py-20 text-center">
          <Calendar className="h-12 w-12 text-accent/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-headline text-lg">Filtering for Club and Society events...</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
