import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MessageSquare, 
  Send,
  Clock,
  User,
  AlertCircle
} from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";

import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { whmcsClient, Ticket } from "@/services/whmcsClient";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await whmcsClient.getTicket(id);
        setTicket(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load ticket details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  const handleReply = async () => {
    if (!id || !replyMessage.trim()) return;

    try {
      setSubmitting(true);
      await whmcsClient.replyTicket(id, replyMessage);
      
      // Add the reply to local state
      if (ticket) {
        setTicket({
          ...ticket,
          status: "customer-reply",
          lastReply: new Date().toLocaleString(),
          messages: [
            ...(ticket.messages || []),
            {
              id: `MSG${Date.now()}`,
              sender: session.user?.name || "You",
              senderType: "client",
              message: replyMessage,
              date: new Date().toLocaleString(),
            },
          ],
        });
      }
      
      setReplyMessage("");
      toast({
        title: "Reply Sent",
        description: "Your reply has been added to the ticket.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors = {
    open: "bg-yellow-500/20 text-yellow-400",
    answered: "bg-green-500/20 text-green-400",
    "customer-reply": "bg-primary/20 text-primary",
    closed: "bg-muted text-muted-foreground",
    "on-hold": "bg-orange-500/20 text-orange-400",
  };

  const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  };

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/panel/tickets")}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Ticket #{id}</h1>
            {ticket && (
              <p className="text-sm text-muted-foreground">{ticket.department}</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : ticket ? (
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{ticket.subject}</h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status] || statusColors.closed}`}>
                      {ticket.status.replace("-", " ")}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority] || priorityColors.low}`}>
                      {ticket.priority} priority
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Created: {ticket.createdAt}</p>
                  <p>Last Reply: {ticket.lastReply}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {ticket.messages?.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-5 ${
                    message.senderType === "admin" ? "ml-6 border-l-2 border-primary/50" : "mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${
                        message.senderType === "admin" ? "bg-primary/20" : "bg-muted"
                      }`}>
                        {message.senderType === "admin" ? (
                          <MessageSquare className="w-3 h-3 text-primary" />
                        ) : (
                          <User className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        message.senderType === "admin" ? "text-primary" : "text-foreground"
                      }`}>
                        {message.sender}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {message.date}
                    </div>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{message.message}</p>
                </motion.div>
              ))}
            </div>

            {/* Reply Box */}
            {ticket.status !== "closed" ? (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Reply to Ticket</h3>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your reply..."
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground resize-none"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={handleReply}
                    disabled={!replyMessage.trim() || submitting}
                    className="btn-glow py-2 px-6 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">This ticket is closed</p>
                <Link to="/panel/tickets/new" className="text-primary hover:underline text-sm mt-2 inline-block">
                  Open a new ticket
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Ticket not found</p>
            <Link to="/panel/tickets" className="text-primary hover:underline text-sm mt-2 inline-block">
              Back to Tickets
            </Link>
          </div>
        )}
      </motion.div>
    </PanelLayout>
  );
}
