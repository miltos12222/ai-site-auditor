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
      !hasDescription ? "⚠️ Το site σας δεν διαθέτει Meta Description, με αποτέλεσμα η Google να μην το προβάλλει σωστά στις αναζητήσεις, χάνοντας πελάτες." : "✅ Το SEO description είναι ενεργό.",
      !hasViewport ? "🚨 Λείπει η ετικέτα Mobile Viewport, κάνοντας το site δύσχρηστο σε κινητά τηλέφωνα." : "✅ Το site υποστηρίζει mobile viewport.",
      loadTime > 2000 ? `⚡ Ο χρόνος απόκρισης είναι υψηλός (${loadTime}ms), γεγονός που κουράζει τους επισκέπτες.` : "⚡ Η ταχύτητα απόκρισης είναι εξαιρετική.",
      !hasH1 ? "🔍 Δεν ανιχνεύθηκε βασικός τίτλος H1 στη σελίδα για τη σωστή ιεραρχία SEO." : "✅ Η δομή επικεφαλίδων (H1) είναι σωστή."
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
