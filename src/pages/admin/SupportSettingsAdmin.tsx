import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, MessageCircle, Mail, MessagesSquare } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface FormState {
  id: string;
  discord_url: string;
  discord_enabled: boolean;
  email_address: string;
  email_enabled: boolean;
  live_chat_enabled: boolean;
  live_chat_label: string;
  live_chat_embed_script: string;
}

export default function SupportSettingsAdmin() {
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("support_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) toast.error("Eroare la încărcare: " + error.message);
      if (data) {
        setForm({
          id: data.id,
          discord_url: data.discord_url ?? "",
          discord_enabled: !!data.discord_enabled,
          email_address: data.email_address ?? "",
          email_enabled: !!data.email_enabled,
          live_chat_enabled: !!data.live_chat_enabled,
          live_chat_label: data.live_chat_label ?? "Live Chat",
          live_chat_embed_script: data.live_chat_embed_script ?? "",
        });
      }
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const { error } = await supabase
      .from("support_settings")
      .update({
        discord_url: form.discord_url.trim(),
        discord_enabled: form.discord_enabled,
        email_address: form.email_address.trim(),
        email_enabled: form.email_enabled,
        live_chat_enabled: form.live_chat_enabled,
        live_chat_label: form.live_chat_label.trim() || "Live Chat",
        live_chat_embed_script: form.live_chat_embed_script,
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      toast.error("Eroare salvare: " + error.message);
      return;
    }
    toast.success("Setări salvate");
    qc.invalidateQueries({ queryKey: ["support_settings"] });
  };

  if (loading || !form) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat & Support</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configurează butonul de support flotant: Discord, Email și Live Chat (script embed universal).
          </p>
        </div>

        {/* Discord */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessagesSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Discord</h2>
                <p className="text-xs text-muted-foreground">Link de invitație server</p>
              </div>
            </div>
            <Switch
              checked={form.discord_enabled}
              onCheckedChange={(v) => update("discord_enabled", v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discord_url">Discord invite URL</Label>
            <Input
              id="discord_url"
              placeholder="https://discord.gg/xxxxxx"
              value={form.discord_url}
              onChange={(e) => update("discord_url", e.target.value)}
            />
          </div>
        </Card>

        {/* Email */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Email Support</h2>
                <p className="text-xs text-muted-foreground">Adresa de contact</p>
              </div>
            </div>
            <Switch
              checked={form.email_enabled}
              onCheckedChange={(v) => update("email_enabled", v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email_address">Adresa email</Label>
            <Input
              id="email_address"
              type="email"
              placeholder="support@hoxta.com"
              value={form.email_address}
              onChange={(e) => update("email_address", e.target.value)}
            />
          </div>
        </Card>

        {/* Live Chat */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Live Chat (universal)</h2>
                <p className="text-xs text-muted-foreground">
                  Lipește scriptul embed de la orice provider (Tawk.to, Crisp, Tidio, Chatwoot, Intercom, LiveChat, etc.)
                </p>
              </div>
            </div>
            <Switch
              checked={form.live_chat_enabled}
              onCheckedChange={(v) => update("live_chat_enabled", v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="live_chat_label">Etichetă buton</Label>
            <Input
              id="live_chat_label"
              placeholder="Live Chat"
              value={form.live_chat_label}
              onChange={(e) => update("live_chat_label", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="live_chat_embed_script">Script embed</Label>
            <Textarea
              id="live_chat_embed_script"
              placeholder={`<!-- Exemplu Tawk.to -->\n<script type="text/javascript">\nvar Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();\n(function(){\n  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];\n  s1.async=true;\n  s1.src='https://embed.tawk.to/XXXXXXX/default';\n  s1.charset='UTF-8';\n  s1.setAttribute('crossorigin','*');\n  s0.parentNode.insertBefore(s1,s0);\n})();\n</script>`}
              value={form.live_chat_embed_script}
              onChange={(e) => update("live_chat_embed_script", e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Scriptul se va injecta în pagină doar când Live Chat este activat. Majoritatea providerilor vor afișa propriul lor buton flotant.
            </p>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} size="lg">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Salvează setările
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
