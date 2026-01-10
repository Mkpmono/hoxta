import { motion } from "framer-motion";
import { Palette, Globe, Image } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Brand & UI Settings</h1>
        
        <div className="grid gap-6">
          {/* Brand Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Brand Identity</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Brand Name</label>
                <input 
                  type="text" 
                  defaultValue="Hoxta" 
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    defaultValue="#19c3ff" 
                    className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                  <input 
                    type="color" 
                    defaultValue="#19c3ff" 
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    defaultValue="#0a1628" 
                    className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                  <input 
                    type="color" 
                    defaultValue="#0a1628" 
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Accent Color</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    defaultValue="#06b6d4" 
                    className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                  <input 
                    type="color" 
                    defaultValue="#06b6d4" 
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Logo & Assets</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Logo (Light)</label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-2">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, SVG up to 2MB</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Logo (Dark)</label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-2">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, SVG up to 2MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Website Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Website Settings</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Site Title</label>
                <input 
                  type="text" 
                  defaultValue="Hoxta - Premium Game Hosting" 
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@hoxta.com" 
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Meta Description</label>
                <textarea 
                  rows={3}
                  defaultValue="Premium game server hosting with DDoS protection, instant setup, and 24/7 support." 
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
