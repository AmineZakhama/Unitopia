'use client'

import { useState } from 'react'
import { createNotification } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function NotificationManager() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'SYSTEM_ALERT',
        priority: 'NORMAL',
        targetRole: ''
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await createNotification(formData as any)
            setFormData({ title: '', message: '', type: 'SYSTEM_ALERT', priority: 'NORMAL', targetRole: '' })
            alert('Notification created!')
        } catch (e) {
            alert('Failed to create notification')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-slate-900 border-primary/20">
            <CardHeader>
                <CardTitle className="text-white">Create Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input 
                    placeholder="Title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Textarea 
                    placeholder="Message" 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                     <Select onValueChange={(v) => setFormData({...formData, type: v})} defaultValue={formData.type}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
                            <SelectItem value="DEADLINE">Deadline</SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                        </SelectContent>
                     </Select>
                     
                     <Select onValueChange={(v) => setFormData({...formData, priority: v})} defaultValue={formData.priority}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                             <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="LOW">Low</SelectItem>
                             <SelectItem value="NORMAL">Normal</SelectItem>
                             <SelectItem value="HIGH">High</SelectItem>
                             <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                     </Select>
                </div>
                <Button onClick={handleSubmit} disabled={loading || !formData.title} className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Notification'}
                </Button>
            </CardContent>
        </Card>
    )
}
