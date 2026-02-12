'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createStudentProfile, checkProfileStatus } from '@/app/actions/onboarding'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Sparkles, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'

const INTEREST_OPTIONS = [
  "Artificial Intelligence", "Robotics", "Quantum Computing", 
  "Sustainable Energy", "Bio-Engineering", "Digital Ethics",
  "Space Exploration", "Cybersecurity", "Data Science",
  "Game Design", "Blockchain", "Art & Technology"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    yearOfStudy: 1,
    major: '',
    interests: [] as string[]
  })

  useEffect(() => {
    // Check if already onboarded
    const check = async () => {
      const status = await checkProfileStatus()
      if (status.success && status.hasProfile) {
        router.push('/')
      } else {
        setLoading(false)
      }
    }
    check()
  }, [router])

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) }
      } else {
        if (prev.interests.length >= 5) return prev // Limit to 5
        return { ...prev, interests: [...prev.interests, interest] }
      }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const result = await createStudentProfile(formData)
      if (result.success) {
        router.push('/')
        router.refresh()
      } else {
        console.error(result.error)
        setSubmitting(false)
      }
    } catch(e) {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full border-none shadow-2xl bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">
            Setup Your Nexus Profile
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            Step {step} of 2: {step === 1 ? 'Academic Details' : 'Select Interests'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label htmlFor="major" className="text-slate-200">What is your Major?</Label>
                <Input 
                  id="major"
                  placeholder="e.g. Computer Science, Quantum Physics..." 
                  className="bg-slate-800/50 border-slate-700 text-white"
                  value={formData.major}
                  onChange={(e) => setFormData({...formData, major: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year" className="text-slate-200">Year of Study</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((year) => (
                    <button
                      key={year}
                      onClick={() => setFormData({...formData, yearOfStudy: year})}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.yearOfStudy === year 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      Year {year}
                    </button>
                  ))}
                </div>
              </div>

               <Button 
                className="w-full mt-6" 
                onClick={() => setStep(2)}
                disabled={!formData.major}
              >
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
               <div className="space-y-2">
                  <Label className="text-slate-200">Select Interests (Max 5)</Label>
                  <p className="text-xs text-slate-400">This helps our AI recommend the best courses and events for you.</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {INTEREST_OPTIONS.map((interest) => (
                      <div 
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-sm flex items-center gap-2 ${
                            formData.interests.includes(interest)
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                         <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                             formData.interests.includes(interest) ? 'bg-primary border-primary' : 'border-slate-500'
                         }`}>
                            {formData.interests.includes(interest) && <div className="w-2 h-2 bg-white rounded-sm" />}
                         </div>
                         {interest}
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex gap-3">
                 <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                 </Button>
                 <Button 
                    className="flex-[2]" 
                    onClick={handleSubmit}
                    disabled={submitting || formData.interests.length === 0}
                 >
                    {submitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Profile...</>
                    ) : (
                        <>Complete Setup <GraduationCap className="h-4 w-4 ml-2" /></>
                    )}
                 </Button>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
