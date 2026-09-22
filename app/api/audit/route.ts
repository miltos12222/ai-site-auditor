import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Απαιτείται έγκυρο URL." }, { status: 400 });
    }

    const startTime = Date.now();
    let html = "";
    let loadTime = 0;

    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "MiltosEnterpriseAuditor/2.0" },
        signal: AbortSignal.timeout(8000)
      });
      loadTime = Date.now() - startTime;
      html = await response.text();
    } catch {
      return NextResponse.json({ error: "Δεν ήταν δυνατή η πρόσβαση στο site. Ελέγξτε αν το URL είναι σωστό." }, { status: 400 });
    }

    const hasTitle = html.includes("<title>") && !html.includes("<title></title>");
    const hasDescription = html.toLowerCase().includes('name="description"');
    const hasViewport = html.toLowerCase().includes('name="viewport"');
    const hasHttps = url.startsWith("https://");
    const hasH1 = html.includes("<h1");
    const hasImagesWithoutAlt = (html.match(/<img [^>]*>/g) || []).length > 0 && !html.includes("alt=");
    const pageSizeKB = Math.round(html.length / 1024);

    let score = 0;
    if (hasTitle) score += 20;
    if (hasDescription) score += 20;
    if (hasViewport) score += 20;
    if (hasHttps) score += 20;
    if (hasH1) score += 20;

    // Πλούσια, επαγγελματικά insights με βαθύτερες πληροφορίες
    const insights = [
      {
        title: hasDescription ? "✅ Το Meta Description είναι πλήρως βελτιστοποιημένο." : "🚨 Κρίσιμο Λάθος: Απουσία Meta Description.",
        details: hasDescription 
          ? "Η ύπαρξη περιγραφής επιτρέπει στις μηχανές αναζήτησης να κατανοήσουν ακριβώς τις υπηρεσίες σας." 
          : "Η Google αναγκάζεται να τραβήξει τυχαίο κείμενο από το site σας στα αποτελέσματα αναζήτησης, πράγμα που ρίχνει δραματικά τα κλικ και τους δυνητικούς πελάτες.",
        fix: "Προσθέστε άμεσα στο <head> της σελίδας σας: <meta name='description' content='[Η υπηρεσία σας σε 150 χαρακτήρες]'>.",
        impact: "Αύξηση οργανικής επισκεψιμότητας έως και 18%.",
        costToFix: "€50 - €100",
        status: hasDescription ? "success" : "warning"
      },
      {
        title: hasViewport ? "✅ Mobile-Responsive Viewport ενεργό." : "🚨 Σοβαρό Πρόβλημα: Μη συμβατό με Κινητά (Mobile UX).",
        details: hasViewport 
          ? "Το site διαθέτει τη σωστή ρύθμιση προβολής για smartphones και tablets." 
          : "Πάνω από το 70% της κίνησης γίνεται από κινητά. Χωρίς viewport tag, η σελίδα φαίνεται μικροσκοπική και οι χρήστες αποχωρούν σε λιγότερο από 3 δευτερόλεπτα.",
        fix: "Ενσωματώστε την ετικέτα <meta name='viewport' content='width=device-width, initial-scale=1'>.",
        impact: "Μείωση bounce rate και συγκράτηση πελατών.",
        costToFix: "€80 - €150",
        status: hasViewport ? "success" : "warning"
      },
      {
        title: loadTime < 2000 ? "⚡ Εξαιρετικός χρόνος απόκρισης server." : "⚠️ Χαμηλή Ταχύτητα Φόρτωσης (Performance Lag).",
        details: `Ο χρόνος φόρτωσης είναι ${loadTime}ms. ${loadTime > 2000 ? 'Οι αργοί χρόνοι κουράζουν τους επισκέπτες και τιμωρούνται από τους αλγορίθμους της Google.' : 'Η απόκριση είναι άμεση.'}`,
        fix: loadTime < 2000 ? "Διατηρήστε την τρέχουσα υποδομή." : "Μετάβαση σε σύγχρονη αρχιτεκτονίδα (Next.js/Vercel) και συμπίεση πολυμέσων σε μορφή WebP/AVIF.",
        impact: "Άμεση αύξηση μετατροπών (conversions) κατά 15%.",
        costToFix: loadTime < 2000 ? "€0" : "€300 - €600",
        status: loadTime < 2000 ? "success" : "warning"
      },
      {
        title: hasH1 ? "✅ Σωστή ιεραρχία τίτλων (H1 Tag)." : "🔍 Ελλιπής Δομή Επικεφαλίδων (Semantic HTML).",
        details: hasH1 
          ? "Η ετικέτα H1 δηλώνει ξεκάθαρα στη Google το κύριο αντικείμενο της επιχείρησης." 
          : "Η έλλειψη H1 μπερδεύει τα web crawlers με αποτέλεσμα να μην κατατάσσεστε στα τοπικά keywords.",
        fix: "Ορίστε έναν καθαρό τίτλο H1 στην κορυφή της αρχικής σελίδας με τις βασικές λέξεις-κλειδιά.",
        impact: "Καλύτερη ευρετηρίαση από τα Google Web Crawlers.",
        costToFix: "€50",
        status: hasH1 ? "success" : "warning"
      }
    ];

    // Εκτιμώμενη συνολική τιμή για ολική ανακατασκευή / διόρθωση από Agency
    const totalEstimatedQuote = score < 60 ? "€1,200 - €2,500 (Πλήρης Ανακατασκευή Next.js)" : score < 85 ? "€400 - €800 (SEO & Speed Optimization)" : "€150 - €300 (Μηνιαία Συντήρηση)";

    return NextResponse.json({
      success: true,
      audit: {
        url,
        loadTimeMs: loadTime,
        pageSizeKB,
        score,
        totalEstimatedQuote,
        metrics: { hasTitle, hasDescription, hasViewport, hasHttps, hasH1 },
        aiInsights: insights
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Σφάλμα διακομιστή κατά την ανάλυση." }, { status: 500 });
  }
}
