import { NotificationManager } from '@/components/admin/notification-manager'
import { RecommendationManager } from '@/components/admin/recommendation-manager'

export default function SuperAdminPage() {
    return (
      <div className="text-white space-y-8">
        <div>
            <h1 className="text-2xl font-bold mb-2">Super Admin Dashboard</h1>
            <p className="text-slate-400">Manage system-wide settings and broadcasts.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NotificationManager />
            <RecommendationManager />
        </div>
      </div>
    )
  }
