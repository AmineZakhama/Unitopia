
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  TrendingUp, 
  UserCheck, 
  HeartHandshake, 
  Clock,
  Sparkles
} from "lucide-react"

interface ScoreProps {
  label: string
  score: number
  colorClass: string
  icon: React.ElementType
  description: string
}

function ScoreRow({ label, score, colorClass, icon: Icon, description }: ScoreProps) {
  return (
    <div className="space-y-2 mb-6 last:mb-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20`}>
            <Icon className={`h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className="font-headline font-bold text-lg">{score}%</span>
      </div>
      <Progress value={score} className="h-1.5" />
    </div>
  )
}

export function ReadinessScore() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Readiness
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary">Advanced</Badge>
          </div>
          <CardDescription>Academic & Job Market Preparation</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreRow 
            label="Learning Discipline" 
            score={88} 
            colorClass="bg-blue-500" 
            icon={TrendingUp}
            description="Completing tutorials & prep"
          />
          <ScoreRow 
            label="Skill Growth" 
            score={75} 
            colorClass="bg-accent" 
            icon={Sparkles}
            description="New validated skills"
          />
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-pink-500" />
              Citizenship
            </CardTitle>
            <Badge variant="secondary" className="bg-accent/10 text-accent">Elite Contributor</Badge>
          </div>
          <CardDescription>Ecosystem Contribution & Peer Support</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreRow 
            label="Knowledge Sharing" 
            score={98} 
            colorClass="bg-pink-500" 
            icon={UserCheck}
            description="Verified notes & Tutoring"
          />
          <ScoreRow 
            label="Community Feedback" 
            score={90} 
            colorClass="bg-green-500" 
            icon={HeartHandshake}
            description="Quality reporting & reviews"
          />
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Management
            </CardTitle>
            <Badge variant="secondary">Reliable</Badge>
          </div>
          <CardDescription>Self-Organization & Deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreRow 
            label="Attendance & Deadlines" 
            score={82} 
            colorClass="bg-indigo-500" 
            icon={Clock}
            description="Consistency & Appointments"
          />
          <ScoreRow 
            label="Admin Autonomy" 
            score={70} 
            colorClass="bg-orange-500" 
            icon={UserCheck}
            description="Reduced back-and-forth"
          />
        </CardContent>
      </Card>
    </div>
  )
}
