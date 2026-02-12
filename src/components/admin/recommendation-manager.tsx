'use client'

import { useState } from 'react'
import { createRecommendation } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function RecommendationManager() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'COURSE',
        priority: 50,
        tags: ''
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await createRecommendation({
                ...formData,
                priority: Number(formData.priority),
                tags: formData.tags.split(',').map(t => t.trim())
            } as any)
            setFormData({ title: '', description: '', type: 'COURSE', priority: 50, tags: '' })
            alert('Recommendation broadcasted!')
        } catch (e) {
            alert('Failed to broadcast recommendation')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-slate-900 border-primary/20">
            <CardHeader>
                <CardTitle className="text-white">Broadcast Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input 
                    placeholder="Title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Textarea 
                    placeholder="Description" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                     <Select onValueChange={(v) => setFormData({...formData, type: v})} defaultValue={formData.type}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="COURSE">Course</SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                            <SelectItem value="WORKSHOP">Workshop</SelectItem>
                            <SelectItem value="activity">Activity</SelectItem>
                        </SelectContent>
                     </Select>
                     
                     <Input 
                        type="number" 
                        placeholder="Priority (0-100)"
                        value={formData.priority}
                        onChange={e => setFormData({...formData, priority: Number(e.target.value)})}
                        className="bg-slate-800 border-slate-700 text-white"
                     />
                </div>
                <Input 
                    placeholder="Tags (comma separated)" 
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Button onClick={handleSubmit} disabled={loading || !formData.title} className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Broadcast to All Students'}
                </Button>
            </CardContent>
        </Card>
    )
}
