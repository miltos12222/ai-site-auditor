"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Globe, ShieldCheck, Zap, ArrowRight, Download, CheckCircle2, AlertTriangle, RefreshCw, Copy, Mail, TrendingUp } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [outreachEmail, setOutreachEmail] = useState("");

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setAuditResult(null);
    setOutreachEmail("");
    toast("Σάρωση σε εξέλιξη...", { description: "Αναλύουμε ταχύτητα, SEO, ασφάλεια και δομή του site." });

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAuditResult(data.audit);
        toast.success("Η ανάλυση ολοκληρώθηκε με επιτυχία!");
      } else {
        toast.error(data.error || "Αποτυχία σάρωσης του site.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Σφάλμα σύνδεσης με τον διακομιστή.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = () => {
    if (!auditResult) return;
    const emailTemplate = `Γεια σας,\n\nΈτρεξα πρόσφατα μια τεχνική ανάλυση (audit) στην ιστοσελίδα σας (${auditResult.url}) μέσω ενός αυτοματοποιημένου εργαλείου που έχω αναπτύξει.\n\nΠαρατήρησα ορισμένα σημεία που επηρεάζουν την εμφάνισή σας στη Google και την εμπειρία των πελατών σας:\n${auditResult.aiInsights.map((i: string) => `- ${i}`).join("\n")}\n\nΣας επισυνάπτομαι το πλήρες report. Θα χαρώ πολύ να τα πούμε σύντομα για να σας δείξω πώς μπορούν να διορθωθούν άμεσα.\n\nΜε εκτίμηση,\nMiltos Papageorgiou\nWeb & Cloud Developer`;
    setOutreachEmail(emailTemplate);
    toast.success("Το Outreach Email δημιουργήθηκε!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outreachEmail);
    toast.success("Το email αντιγράφηκε στο πρόχειρο!");
  };

  const handleDownloadPDF = () => {
    toast.success("Δημιουργία PDF Report...");
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e5e7eb] selection:bg-cyan-500/30 selection:text-white p-4 sm:p-8 font-sans">
      <Toaster position="top-center" richColors />

      <main className="max-w-4xl mx-auto space-y-12 pt-12 pb-20">
        
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 animate-pulse" /> AI Site Audit & Outreach Engine 2030
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Βαθιά Τεχνική Ανάλυση Site <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">& Automated Sales Generator</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Σκανάρει ταχύτητα, SEO, ασφάλεια και mobile-friendliness, βγάζει scores ανά κατηγορία και παράγει έτοιμα emails προσέγγισης πελατών.
          </p>
        </div>

        {/* Audit Form Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/15 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Πλήρης Σάρωση...</span>
                </>
              ) : (
                <>
                  <span>Εκκίνηση Deep Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        {auditResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-cyan-500/30 space-y-6 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Αναφορά Τεχνικού Ελέγχου</span>
                <h3 className="text-xl font-bold text-white">{auditResult.url}</h3>
              </div>
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-2xl">
                <span className="text-xs text-zinc-400 font-mono">Συνολικό Score:</span>
                <span className={`text-lg font-black font-mono ${auditResult.score >= 80 ? 'text-emerald-400' : auditResult.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {auditResult.score}/100
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono">Χρόνος Φόρτωσης</span>
                <p className="text-sm font-bold text-white">{auditResult.loadTimeMs} ms</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono">Μέγεθος Σελίδας</span>
                <p className="text-sm font-bold text-white">{auditResult.pageSizeKB} KB</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono">SSL / HTTPS</span>
                <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> {auditResult.metrics.hasHttps ? 'Ναι' : 'Όχι'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono">Mobile Viewport</span>
                <p className="text-sm font-bold text-cyan-400 flex items-center gap-1">
                  <Zap className="w-4 h-4" /> {auditResult.metrics.hasViewport ? 'Ενεργό' : 'Ελλιπές'}
                </p>
              </div>
            </div>

            {/* AI Insights & Recommendations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-zinc-300 uppercase font-mono tracking-wider">💡 AI Findings & Business Impact</h4>
              <div className="space-y-2">
                {auditResult.aiInsights.map((insight: string, idx: number) => {
                  const isSuccess = insight.includes("✅") || insight.includes("⚡");
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm ${isSuccess ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200' : 'bg-red-950/20 border-red-500/20 text-red-200'}`}>
                      {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                      <span>{insight}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outreach Email Section */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Cold Outreach Email Generator
                </h4>
                <button
                  onClick={generateEmail}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Δημιουργία Email Πώλησης
                </button>
              </div>

              {outreachEmail && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3 relative font-mono text-xs text-zinc-300">
                  <button onClick={copyToClipboard} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" /> Αντιγραφή
                  </button>
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">{outreachEmail}</pre>
                </motion.div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" /> <span>Λήψη Professional PDF Report</span>
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
