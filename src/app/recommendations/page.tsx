
"use client"

import { useState, useEffect } from "react"
import { getCareerReadinessTips, type CareerReadinessTipsOutput } from "@/ai/flows/career-readiness-tips"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, BookOpen, Code, FileUser, UserSearch, GraduationCap } from "lucide-react"
import { getRecommendations } from "@/app/actions/recommendations"
import { RecommendationCard } from "@/components/dashboard/RecommendationCard"

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CareerReadinessTipsOutput | null>(null)
  const [profile, setProfile] = useState("Computer Science student interested in AI ethics, full-stack development, and student leadership. Looking to break into the tech industry with a strong emphasis on social impact.")

  const [dbRecommendations, setDbRecommendations] = useState<any[]>([])

  const fetchTips = async () => {
    setLoading(true)
    try {
      const [tips, dbRecs] = await Promise.all([
        getCareerReadinessTips({ studentProfile: profile }),
        getRecommendations()
      ])
      setResults(tips)
      if (dbRecs.success && dbRecs.data) {
        setDbRecommendations(dbRecs.data)
      }
    } catch (error) {
      // Error is handled by global listener
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTips()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          Nexus AI Career Coach
        </h1>
        <p className="text-muted-foreground text-lg">
          Tailored career advice and skill-building recommendations based on your unique Nexus profile.
        </p>
      </div>

      <Card className="border-primary/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-sm font-headline uppercase tracking-wider text-primary">Your Dynamic Profile</CardTitle>
          <CardDescription>We use this context to generate personalized career readiness pathways.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <textarea
            className="w-full bg-background border rounded-lg p-4 focus:ring-2 focus:ring-primary outline-none transition-all min-h-[100px]"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={fetchTips} 
              disabled={loading}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Regenerate Advice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personalized DB Recommendations */}
      {dbRecommendations.length > 0 && (
        <div className="pt-8">
            <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Personalized For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dbRecommendations.map((rec) => (
                <RecommendationCard 
                    key={rec.id}
                    title={rec.title}
                    description={rec.description}
                    type={rec.type}
                    difficulty={rec.metadata?.difficulty || 'Intermediate'}
                    estimatedHours={rec.metadata?.estimatedHours || 5}
                    tags={rec.tags}
                    provider={rec.metadata?.provider || 'University'}
                    relevanceScore={rec.priority / 100}
                    status={rec.status}
                />
            ))}
            </div>
        </div>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Consulting the Nexus Knowledge Core...</p>
          </div>
        ) : results?.tips.map((tip, idx) => (
          <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent overflow-hidden group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                  {tip.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-accent/10 text-accent font-bold">Recommended</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                  <BookOpen className="h-3.5 w-3.5" /> Start Course
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                  <Sparkles className="h-3.5 w-3.5" /> Track Skill
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-8">
        <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          University Workshops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "GitHub Mastery for Research", icon: Code, level: "Intermediate" },
            { title: "Crafting the Perfect Resume", icon: FileUser, level: "Beginner" },
            { title: "Mock Interview Clinic", icon: UserSearch, level: "Advanced" },
            { title: "Leadership in Tech", icon: GraduationCap, level: "Professional" }
          ].map((item, idx) => (
            <Card key={idx} className="border-none shadow hover:translate-y-[-2px] transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.level} Level</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
