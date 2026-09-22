"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, ShieldCheck, Zap, ArrowRight, Download, CheckCircle2, AlertTriangle, RefreshCw, Copy, Mail, ChevronDown, DollarSign } from "lucide-react";
import { toast, Toaster } from "sonner";
import jsPDF from "jspdf";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [outreachEmail, setOutreachEmail] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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
    const emailTemplate = `Γεια σας,\n\nΈτρεξα πρόσφατα μια τεχνική ανάλυση (audit) στην ιστοσελίδα σας (${auditResult.url}) μέσω ενός αυτοματοποιημένου εργαλείου τεχνητής νοημοσύνης.\n\nΠαρατήρησα ορισμένα σημεία που επηρεάζουν την εμφάνισή σας στη Google και την εμπειρία των πελατών σας:\n${auditResult.aiInsights.map((i: any) => `- ${i.title}`).join("\n")}\n\nΕνδεικτικό κόστος αποκατάστασης/αναβάθμισης: ${auditResult.totalEstimatedQuote}.\n\nΣας επισυνάπτω το πλήρες report. Θα χαρώ πολύ να τα πούμε σύντομα για να σας δείξω πώς μπορούν να διορθωθούν άμεσα.\n\nΜε εκτίμηση,\nMiltos Papageorgiou\nWeb & Cloud Developer`;
    setOutreachEmail(emailTemplate);
    toast.success("Το Outreach Email δημιουργήθηκε!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outreachEmail);
    toast.success("Το email αντιγράφηκε στο πρόχειρο!");
  };

  const handleDownloadPDF = () => {
    if (!auditResult) return;
    setDownloadingPdf(true);
    toast("Δημιουργία αρχείου PDF...", { description: "Παρακαλώ περιμένετε..." });

    try {
      const doc = new jsPDF();
      
      doc.setFillColor(11, 12, 16);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(6, 182, 212);
      doc.setFontSize(18);
      doc.text("AI Site Audit & Enterprise Report", 20, 20);

      doc.setTextColor(229, 231, 235);
      doc.setFontSize(11);
      doc.text(`Target URL: ${auditResult.url}`, 20, 30);
      doc.text(`Total Score: ${auditResult.score}/100`, 20, 38);
      doc.text(`Estimated Quote: ${auditResult.totalEstimatedQuote}`, 20, 46);

      doc.setTextColor(6, 182, 212);
      doc.text("--- Technical Metrics ---", 20, 58);
      doc.setTextColor(229, 231, 235);
      doc.text(`- Server Response Time: ${auditResult.loadTimeMs} ms`, 20, 66);
      doc.text(`- HTML Page Size: ${auditResult.pageSizeKB} KB`, 20, 74);
      doc.text(`- SSL / HTTPS Security: ${auditResult.metrics.hasHttps ? 'Active (Yes)' : 'Insecure (No)'}`, 20, 82);
      doc.text(`- Mobile Viewport Support: ${auditResult.metrics.hasViewport ? 'Yes' : 'No'}`, 20, 90);

      doc.setTextColor(6, 182, 212);
      doc.text("--- AI Audit Findings ---", 20, 104);
      
      let y = 112;
      auditResult.aiInsights.forEach((insight: any, idx: number) => {
        if (y > 260) {
          doc.addPage();
          doc.setFillColor(11, 12, 16);
          doc.rect(0, 0, 210, 297, "F");
          y = 20;
        }
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        const cleanTitle = insight.title.replace(/[\u{1F000}-\u{1F6FF}|✅|🚨|⚠️|🔍|⚡]/gu, "").trim();
        doc.text(`${idx + 1}. ${cleanTitle}`, 20, y);
        
        doc.setTextColor(180, 180, 180);
        doc.text(`   Details: ${insight.details.substring(0, 85)}...`, 20, y + 6);
        y += 16;
      });

      doc.save(`site-audit-report-${Date.now()}.pdf`);
      toast.success("Το PDF κατέβηκε με επιτυχία!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Αποτυχία δημιουργίας PDF αρχείου.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e5e7eb] selection:bg-cyan-500/30 selection:text-white p-4 sm:p-8 font-sans">
      <Toaster position="top-center" richColors />

      <main className="max-w-4xl mx-auto space-y-12 pt-12 pb-20">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 animate-pulse" /> AI Site Audit & Outreach Engine 2030
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Βαθιά Τεχνική Ανάλυση Site <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">& Automated Sales Generator</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Σκανάρει ταχύτητα, SEO, ασφάλεια και mobile-friendliness, υπολογίζει κόστος αναβάθμισης και παράγει έτοιμα emails πώλησης.
          </p>
        </div>

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

            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Εκτιμώμενο Κόστος Αποκατάστασης / Agency Quote</span>
                  <p className="text-base sm:text-lg font-black text-white">{auditResult.totalEstimatedQuote}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono opacity-70 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                Market Standard 2030
              </span>
            </div>

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

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-zinc-300 uppercase font-mono tracking-wider">💡 AI Deep Findings & Business Impact (Κάντε κλικ για λεπτομέρειες)</h4>
              <div className="space-y-2">
                {auditResult.aiInsights.map((insight: any, idx: number) => {
                  const isSuccess = insight.status === "success";
                  const isOpen = expandedIndex === idx;

                  return (
                    <div key={idx} className={`rounded-2xl border transition-all overflow-hidden ${isSuccess ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200' : 'bg-red-950/20 border-red-500/20 text-red-200'}`}>
                      <button
                        onClick={() => setExpandedIndex(isOpen ? null : idx)}
                        className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                          {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                          <span>{insight.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 pt-1 text-xs text-zinc-300 border-t border-white/10 space-y-2 font-mono"
                          >
                            <p><strong>Ανάλυση & Επίπτωση:</strong> {insight.details}</p>
                            <p className="text-cyan-400"><strong>Τεχνική Διόρθωση:</strong> {insight.fix}</p>
                            <div className="flex flex-wrap gap-4 pt-1 text-[11px] opacity-80">
                              <span>📈 <strong>Business Impact:</strong> {insight.impact}</span>
                              <span>💰 <strong>Εκτιμώμενο Κόστος:</strong> {insight.costToFix}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

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
                disabled={downloadingPdf}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {downloadingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Δημιουργία PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Αυτόματο Download PDF Report</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
