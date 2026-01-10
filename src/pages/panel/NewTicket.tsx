import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { MockModeBanner } from "@/components/panel/MockModeBanner";
import { whmcsClient } from "@/services/whmcsClient";
import { toast } from "@/hooks/use-toast";

const departments = [
  { id: "DEP001", name: "Technical Support" },
  { id: "DEP002", name: "Sales" },
  { id: "DEP003", name: "Billing" },
];

export default function NewTicketPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departmentId: "DEP001",
    subject: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = await whmcsClient.createTicket(formData);
      if (result.success) {
        toast({
          title: "Ticket Created",
          description: `Your ticket has been created. ID: ${result.ticketId}`,
        });
        navigate(`/panel/tickets/${result.ticketId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <MockModeBanner />

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/panel/tickets")}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Support Ticket</h1>
            <p className="text-sm text-muted-foreground">Submit a new support request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="glass-card p-6 space-y-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <div className="flex gap-3">
                {(["low", "medium", "high"] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.priority === priority
                        ? priority === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/50"
                          : priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                          : "bg-muted text-foreground border border-border"
                        : "bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted"
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground resize-none"
              />
            </div>

            {/* Attachments Placeholder */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Paperclip className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 10MB
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/panel/tickets")}
                className="btn-outline py-2.5 px-6"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-glow py-2.5 px-6 flex items-center gap-2 flex-1 justify-center"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </PanelLayout>
  );
}
