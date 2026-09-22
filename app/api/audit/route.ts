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
        headers: { "User-Agent": "MiltosAuditorBot/1.0" },
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
    const pageSizeKB = Math.round(html.length / 1024);

    let score = 0;
    if (hasTitle) score += 20;
    if (hasDescription) score += 20;
    if (hasViewport) score += 20;
    if (hasHttps) score += 20;
    if (hasH1) score += 20;

    const insights = [
      {
        title: hasDescription ? "✅ Το SEO Description είναι ενεργό." : "⚠️ Λείπει το Meta Description.",
        details: hasDescription ? "Η σελίδα διαθέτει περιγραφή για τις μηχανές αναζήτησης." : "Χωρίς description, η Google αυτοσχεδιάζει κείμενο στα αποτελέσματα αναζήτησης, μειώνοντας τα κλικ.",
        fix: hasDescription ? "Δεν απαιτείται ενέργεια." : "Προσθέστε ετικέτα <meta name='description' content='...'> στο <head>.",
        status: hasDescription ? "success" : "warning"
      },
      {
        title: hasViewport ? "✅ Το site υποστηρίζει Mobile Viewport." : "🚨 Ελλιπές Mobile Viewport.",
        details: hasViewport ? "Η σελίδα προσαρμόζεται σωστά σε οθόνες κινητών." : "Χωρίς viewport tag, οι χρήστες κινητών βλέπουν μικροσκοπική την ιστοσελίδα και φεύγουν αμέσως.",
        fix: hasViewport ? "Συγχαρητήρια, είναι εντάξει." : "Προσθέστε <meta name='viewport' content='width=device-width, initial-scale=1'>.",
        status: hasViewport ? "success" : "warning"
      },
      {
        title: loadTime < 2000 ? "⚡ Η ταχύτητα απόκρισης είναι εξαιρετική." : "⚠️ Ο χρόνος φόρτωσης είναι υψηλός.",
        details: `Ο server αποκρίθηκε σε ${loadTime}ms.`,
        fix: loadTime < 2000 ? "Διατηρήστε τη φιλοξενία." : "Βελτιστοποιήστε τις εικόνες και ενεργοποιήστε Caching / CDN.",
        status: loadTime < 2000 ? "success" : "warning"
      },
      {
        title: hasH1 ? "✅ Η δομή επικεφαλίδων (H1) είναι σωστή." : "🔍 Δεν βρέθηκε βασικός τίτλος H1.",
        details: hasH1 ? "Ο τίτλος H1 καθοδηγεί σωστά τη Google για το αντικείμενο της σελίδας." : "Η απουσία H1 μειώνει την κατανόηση του περιεχομένου από τις μηχανές αναζήτησης.",
        fix: hasH1 ? "Τέλεια." : "Προσθέστε τουλάχιστον μία ετικέτα <h1> στην αρχή της σελίδας.",
        status: hasH1 ? "success" : "warning"
      }
    ];

    return NextResponse.json({
      success: true,
      audit: {
        url,
        loadTimeMs: loadTime,
        pageSizeKB,
        score,
        metrics: { hasTitle, hasDescription, hasViewport, hasHttps, hasH1 },
        aiInsights: insights
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Σφάλμα διακομιστή κατά την ανάλυση." }, { status: 500 });
  }
}
