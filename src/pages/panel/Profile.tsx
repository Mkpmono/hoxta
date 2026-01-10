import { motion } from "framer-motion";
import { User, Mail, Lock, Save } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function PanelProfile() {
  const { session } = useAuth();

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={session.user?.name}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={session.user?.email}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+40 123 456 789"
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Your company name"
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
            </div>
            <button className="btn-glow mt-6 flex items-center gap-2 text-sm py-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          {/* Avatar */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Avatar</h2>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary" />
              </div>
              <button className="btn-outline text-sm py-2 px-4">Change Avatar</button>
            </div>
          </div>

          {/* Change Password */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Change Password</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
            </div>
            <button className="btn-outline mt-6 flex items-center gap-2 text-sm py-2">
              <Lock className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </div>
      </motion.div>
    </PanelLayout>
  );
}
