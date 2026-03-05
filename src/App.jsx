import React, { useState, useCallback, useMemo } from "react";

// ── Utilities ─────────────────────────────────────────────────────────────────

const MERCHANT_ALIASES = {
  // ── Streaming & Entertainment ──────────────────────────────────────────────
  NETFLIX:       ["NETFLIX", "NETFLIX.COM", "NETFLIX *", "NETFLIX1"],
  SPOTIFY:       ["SPOTIFY", "SPOTIFY AB", "SPOTIFY.COM", "SPOTIFY *", "SPOTIFY P"],
  YOUTUBE:       ["YOUTUBE", "YOUTUBE PREMIUM", "YOUTUBEPREMIUM", "YT PREMIUM"],
  DISNEY:        ["DISNEY", "DISNEY+", "DISNEY PLUS", "DISNEYPLUS", "DISNEY *"],
  HBO:           ["HBO", "HBO MAX", "HBOMAX", "MAX.COM"],
  APPLE:         ["APPLE", "APPLE.COM", "APPLE *", "APP STORE", "APPLE STORE", "ITUNES", "ITUNES.COM"],
  GOOGLE:        ["GOOGLE", "GOOGLE *", "GOOGLE.COM", "GOOGLE PLAY", "GOOGLE ONE", "GOOGLE STORAGE"],
  DEEZER:        ["DEEZER", "DEEZER *"],
  TIDAL:         ["TIDAL", "TIDAL *", "TIDAL.COM"],
  TWITCH:        ["TWITCH", "TWITCH *", "TWITCH.TV"],

  // ── Food Delivery ──────────────────────────────────────────────────────────
  WOLT:          ["WOLT", "WOLT.COM", "WOLT *"],
  BOLT:          ["BOLT", "BOLT.EU", "BOLT FOOD", "BOLT *", "BOLT DRIVE"],
  UBER_EATS:     ["UBER EATS", "UBEREATS", "UBER* EATS"],

  // ── Groceries (Eesti) ──────────────────────────────────────────────────────
  RIMI:          ["RIMI", "RIMI *", "RIMI EESTI"],
  LIDL:          ["LIDL", "LIDL *", "LIDL ESTONIA"],
  MAXIMA:        ["MAXIMA", "MAXIMA *", "MAXIMA EESTI"],
  SELVER:        ["SELVER", "SELVER *", "AS SELVER"],
  PRISMA:        ["PRISMA", "PRISMA *", "PRISMA PEREMARKET"],
  COOP:          ["COOP", "COOP *", "COOP ESTONIA"],
  GROSSI:        ["GROSSI", "GROSSI *"],
  BARBORA:       ["BARBORA", "BARBORA.EE"],

  // ── Transport ──────────────────────────────────────────────────────────────
  UBER:          ["UBER", "UBER *", "UBER.COM", "UBERTRIP"],
  TAXIFY:        ["TAXIFY", "TAXIFY *"],
  ELRON:         ["ELRON", "ELRON *", "AS ELRON"],
  TALLINNA_BUSS: ["TALLINNA BUSSIJAAM", "TBUSS", "TALLINN BUS"],
  CITYRIDE:      ["CITYRIDE", "CITY RIDE"],

  // ── Cloud & Software ───────────────────────────────────────────────────────
  MICROSOFT:     ["MICROSOFT", "MICROSOFT *", "MSFT", "MS *", "OFFICE 365", "OFFICE365", "XBOX", "XBOX *", "AZURE"],
  ADOBE:         ["ADOBE", "ADOBE *", "ADOBE.COM", "ADOBE SYSTEMS"],
  DROPBOX:       ["DROPBOX", "DROPBOX *", "DROPBOX.COM"],
  GITHUB:        ["GITHUB", "GITHUB *", "GITHUB.COM"],
  NOTION:        ["NOTION", "NOTION *", "NOTION.SO"],
  SLACK:         ["SLACK", "SLACK *", "SLACK.COM"],
  ZOOM:          ["ZOOM", "ZOOM.US", "ZOOM *"],
  CHATGPT:       ["OPENAI", "CHATGPT", "OPENAI *", "CHAT.OPENAI"],
  CANVA:         ["CANVA", "CANVA *", "CANVA.COM"],
  FIGMA:         ["FIGMA", "FIGMA *", "FIGMA.COM"],
  CLAUDE:        ["ANTHROPIC", "CLAUDE.AI", "ANTHROPIC *"],

  // ── E-commerce ─────────────────────────────────────────────────────────────
  AMAZON:        ["AMAZON", "AMAZON.COM", "AMZ*", "AMAZON EU", "AMAZON DE", "AMAZON.DE", "AMZN"],
  ALIEXPRESS:    ["ALIEXPRESS", "ALIPAY", "ALIBABA", "ALI*"],
  EBAY:          ["EBAY", "EBAY *", "EBAY.COM"],
  ZARA:          ["ZARA", "ZARA *", "INDITEX"],
  HM:            ["H&M", "H & M", "HM.COM", "H&M *"],
  IKEA:          ["IKEA", "IKEA *", "IKEA.COM"],
  SHOPIFY:       ["SHOPIFY", "SHOPIFY *"],
  KLARNA:        ["KLARNA", "KLARNA *"],

  // ── Telecoms (Eesti) ───────────────────────────────────────────────────────
  TELIA:         ["TELIA", "TELIA *", "TELIA EESTI"],
  ELISA:         ["ELISA", "ELISA *", "ELISA EESTI"],
  TELE2:         ["TELE2", "TELE2 *", "TELE2.EE"],

  // ── Banking & Finance ──────────────────────────────────────────────────────
  SWEDBANK:      ["SWEDBANK", "SWEDBANK *"],
  SEB:           ["SEB", "SEB PANK", "SEB *"],
  LHV:           ["LHV", "LHV PANK", "LHV *"],
  COOP_PANK:     ["COOP PANK", "COOPPANK"],
  LUMINOR:       ["LUMINOR", "LUMINOR *", "NORDEA"],
  PAYPAL:        ["PAYPAL", "PAYPAL *", "PAYPAL.COM"],
  WISE:          ["WISE", "WISE *", "TRANSFERWISE", "TRANSFER WISE"],
  REVOLUT:       ["REVOLUT", "REVOLUT *"],

  // ── Health & Fitness ───────────────────────────────────────────────────────
  MYFIT:         ["MYFIT", "MY FITNESS", "MYFITNESS"],
  SPORTS_DIRECT: ["SPORTS DIRECT", "SPORTSDIRECT"],
  DECATHLON:     ["DECATHLON", "DECATHLON *"],

  // ── Travel & Accommodation ─────────────────────────────────────────────────
  AIRBNB:        ["AIRBNB", "AIRBNB *", "AIRBNB.COM"],
  BOOKING:       ["BOOKING.COM", "BOOKING *", "BOOKING"],
  EXPEDIA:       ["EXPEDIA", "EXPEDIA *"],
  RYANAIR:       ["RYANAIR", "RYANAIR *"],
  WIZZ:          ["WIZZ", "WIZZ AIR", "WIZZAIR"],
  NORWEGIAN:     ["NORWEGIAN", "NORWEGIAN AIR"],

  // ── Food & Cafes ───────────────────────────────────────────────────────────
  MCDONALDS:     ["MCDONALDS", "MCDONALD", "MC DONALDS", "MCD *"],
  STARBUCKS:     ["STARBUCKS", "STARBUCKS *"],
  CIRCLE_K:      ["CIRCLE K", "CIRCLEK", "CIRCLE*K", "CK *"],
  NESTE:         ["NESTE", "NESTE *", "NESTE OIL"],
};

const CATEGORY_RULES = {
  "Toit & Toidupoed": ["LIDL", "RIMI", "MAXIMA", "SELVER", "PRISMA", "COOP", "GROSSI", "BARBORA", "WOLT", "UBER_EATS", "BOLT_FOOD", "MCDONALDS", "STARBUCKS", "CAFE", "RESTAURANT", "RESTO", "PIZZA", "KOHVIK", "LUNCHBOX"],
  "Transport":        ["BOLT", "UBER", "TAXIFY", "ELRON", "TALLINNA_BUSS", "CITYRIDE", "RIDESHARING", "FUEL", "KÜTUS", "PARKIMINE", "PARKING", "RYANAIR", "WIZZ", "NORWEGIAN", "CIRCLE_K", "NESTE"],
  "Tellimuseed":      ["NETFLIX", "SPOTIFY", "APPLE", "GOOGLE", "YOUTUBE", "DISNEY", "HBO", "DEEZER", "TIDAL", "TWITCH", "MICROSOFT", "ADOBE", "DROPBOX", "GITHUB", "NOTION", "SLACK", "ZOOM", "CHATGPT", "CANVA", "FIGMA", "CLAUDE"],
  "Kommunaalid":      ["ELERING", "ENERGIA", "ELEKTER", "VESI", "GAAS", "TELIA", "ELISA", "TELE2", "INTERNET"],
  "Üür":              ["ÜÜR", "RENT", "KINNISVARA", "ELUASE"],
  "Tervis":           ["APTEEK", "PHARMACY", "ARST", "DOCTOR", "KLIINIK", "CLINIC", "GYM", "SPORDIKLUBI", "MYFIT", "SPORTS_DIRECT", "DECATHLON"],
  "Meelelahutus":     ["KINO", "CINEMA", "TEATER", "KONTSERT", "EVENT", "TICKET", "PILET", "AIRBNB", "BOOKING", "EXPEDIA"],
  "Ostud":            ["AMAZON", "ALIEXPRESS", "EBAY", "ZARA", "HM", "IKEA", "SHOPIFY", "KLARNA"],
  "Pangateenused":    ["SWEDBANK", "SEB", "LHV", "COOP_PANK", "LUMINOR", "PAYPAL", "WISE", "REVOLUT"],
};

function normalizeMerchant(raw) {
  if (!raw) return "TUNDMATU";
  let s = raw.toUpperCase().trim();
  s = s.replace(/[*#@]/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/\b\d{4,}\b/g, "").trim();
  for (const [norm, aliases] of Object.entries(MERCHANT_ALIASES)) {
    if (aliases.some(a => s.includes(a))) return norm;
  }
  const words = s.split(" ");
  return words[0] || s;
}

function categorize(merchant) {
  const m = merchant.toUpperCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(k => m.includes(k))) return cat;
  }
  return "Muu";
}

function hashTransaction(t) {
  return `${t.date}_${t.merchant_norm}_${Math.abs(t.amount).toFixed(2)}`;
}

function parseCSV(text, mapping) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(/[,;]/).map(h => h.trim().replace(/"/g, ""));
  const transactions = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(/[,;]/).map(v => v.trim().replace(/"/g, ""));
    if (vals.length < 2) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = vals[idx] || ""; });
    const rawDate = row[mapping.date] || "";
    const rawAmount = (row[mapping.amount] || "0").replace(",", ".");
    const rawDesc = row[mapping.description] || "";
    const rawCurrency = row[mapping.currency] || "EUR";
    const amount = parseFloat(rawAmount);
    if (isNaN(amount)) continue;
    const merchant_norm = normalizeMerchant(rawDesc);
    // Normalize date to YYYY-MM-DD for reliable string comparison in filters
    const normDate = (() => {
      if (!rawDate) return rawDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) return rawDate;
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(rawDate)) {
        const [d, m, y] = rawDate.split(".");
        return `${y}-${m}-${d}`;
      }
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
        const [m, d, y] = rawDate.split("/");
        return `${y}-${m}-${d}`;
      }
      return rawDate;
    })();
    const t = {
      date: normDate,
      amount,
      currency: rawCurrency,
      description_raw: rawDesc,
      merchant_norm,
      category: categorize(merchant_norm),
      source_file: "upload",
    };
    t.hash_id = hashTransaction(t);
    transactions.push(t);
  }
  return transactions.filter(t => t.amount < 0); // only expenses
}

function detectRecurring(transactions) {
  const byMerchant = {};
  transactions.forEach(t => {
    if (!byMerchant[t.merchant_norm]) byMerchant[t.merchant_norm] = [];
    byMerchant[t.merchant_norm].push(t);
  });

  const patterns = [];
  for (const [merchant, txns] of Object.entries(byMerchant)) {
    if (txns.length < 2) continue;
    const sorted = [...txns].sort((a, b) => new Date(a.date) - new Date(b.date));
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i].date) - new Date(sorted[i - 1].date)) / 86400000;
      gaps.push(diff);
    }
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    let period = null;
    if (avgGap >= 6 && avgGap <= 8) period = "Nädalane";
    else if (avgGap >= 13 && avgGap <= 16) period = "Kahenädalane";
    else if (avgGap >= 28 && avgGap <= 35) period = "Kuine";

    if (!period) continue;

    const amounts = sorted.map(t => Math.abs(t.amount));
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const maxDiff = Math.max(...amounts) - Math.min(...amounts);
    if (maxDiff > avgAmount * 0.3) continue; // too irregular

    const last6 = sorted.slice(-6);
    const recentAvg = last6.slice(-3).reduce((a, t) => a + Math.abs(t.amount), 0) / Math.min(3, last6.length);
    const prevAvg = last6.slice(0, 3).reduce((a, t) => a + Math.abs(t.amount), 0) / Math.min(3, last6.length);
    const trend = prevAvg > 0 ? ((recentAvg - prevAvg) / prevAvg) * 100 : 0;

    const now = new Date();
    const firstDate = new Date(sorted[0].date);
    const daysSinceFirst = (now - firstDate) / 86400000;
    const isNew = daysSinceFirst <= 60 && sorted.length >= 2;

    patterns.push({
      merchant,
      period,
      avgAmount,
      trend,
      transactions: sorted,
      last6,
      isNew,
      category: sorted[0].category,
    });
  }
  return patterns.sort((a, b) => b.avgAmount - a.avgAmount);
}

function detectDuplicates(transactions, recurringPatterns) {
  // Build set of merchants already identified as recurring — skip them entirely
  const recurringMerchants = new Set((recurringPatterns || []).map(r => r.merchant));

  const groups = {};
  transactions.forEach(t => {
    if (recurringMerchants.has(t.merchant_norm)) return; // skip known recurring
    const key = t.merchant_norm + "|" + Math.abs(t.amount).toFixed(2);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const dupes = [];
  for (const [, txns] of Object.entries(groups)) {
    if (txns.length < 2) continue;
    const sorted = [...txns].sort((a, b) => a.date.localeCompare(b.date));

    // Check consecutive pairs only — if two adjacent charges are within 5 days, flag it
    for (let i = 0; i < sorted.length - 1; i++) {
      const dayDiff = Math.round(
        (new Date(sorted[i + 1].date) - new Date(sorted[i].date)) / 86400000
      );
      if (dayDiff <= 5) {
        dupes.push({ a: sorted[i], b: sorted[i + 1], dayDiff, allOccurrences: sorted });
        break; // one flag per merchant+amount group is enough
      }
    }
  }
  return dupes;
}

function detectAnomalies(transactions) {
  const byMerchant = {};
  transactions.forEach(t => {
    if (!byMerchant[t.merchant_norm]) byMerchant[t.merchant_norm] = [];
    byMerchant[t.merchant_norm].push(Math.abs(t.amount));
  });

  const anomalies = [];
  transactions.forEach(t => {
    const amounts = byMerchant[t.merchant_norm];
    if (amounts.length < 3) return;
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / amounts.length;
    const std = Math.sqrt(variance);
    const z = std > 0 ? (Math.abs(t.amount) - mean) / std : 0;
    if (z > 2) anomalies.push({ transaction: t, zScore: z, mean, std });
  });
  return anomalies.sort((a, b) => b.zScore - a.zScore);
}

function getNewMerchants(transactions, days = 60) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const merchantFirst = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    if (!merchantFirst[t.merchant_norm] || d < new Date(merchantFirst[t.merchant_norm])) {
      merchantFirst[t.merchant_norm] = t.date;
    }
  });
  return Object.entries(merchantFirst)
    .filter(([, d]) => new Date(d) >= cutoff)
    .map(([m, d]) => ({ merchant: m, firstSeen: d, count: transactions.filter(t => t.merchant_norm === m).length }))
    .filter(x => x.count >= 1)
    .sort((a, b) => new Date(b.firstSeen) - new Date(a.firstSeen));
}

function getMonthlySummary(transactions) {
  const byMonth = {};
  transactions.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(t);
  });
  return Object.entries(byMonth)
    .map(([month, txns]) => ({
      month,
      total: txns.reduce((a, t) => a + Math.abs(t.amount), 0),
      count: txns.length,
      byCategory: txns.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {}),
      topMerchants: Object.entries(
        txns.reduce((acc, t) => { acc[t.merchant_norm] = (acc[t.merchant_norm] || 0) + Math.abs(t.amount); return acc; }, {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 10),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// ── Date display helper ───────────────────────────────────────────────────────
const fmtDate = iso => {
  if (!iso || iso.length < 10) return iso;
  const [y, m, d] = iso.slice(0, 10).split("-");
  return m + "/" + d + "/" + y;
};

// ── Demo Data ──────────────────────────────────────────────────────────────────

const DEMO_CSV = `Date,Amount,Currency,Description
2024-01-03,-12.99,EUR,NETFLIX.COM *1234
2024-01-05,-9.99,EUR,SPOTIFY AB
2024-01-10,-45.20,EUR,RIMI HYPERMARKET
2024-01-14,-8.50,EUR,BOLT *RIDE
2024-01-15,-400.00,EUR,RIMI HYPERMARKET
2024-02-03,-12.99,EUR,NETFLIX *STREAMING
2024-02-05,-9.99,EUR,SPOTIFY.COM
2024-02-10,-38.70,EUR,RIMI HYPERMARKET
2024-02-15,-8.50,EUR,BOLT.EU RIDE
2024-02-20,-22.50,EUR,WOLT.COM ORDER
2024-03-03,-14.99,EUR,NETFLIX.COM
2024-03-05,-9.99,EUR,SPOTIFY AB
2024-03-05,-9.99,EUR,SPOTIFY AB
2024-03-10,-42.10,EUR,RIMI HYPERMARKET
2024-03-15,-8.50,EUR,BOLT *RIDE
2024-03-18,-29.90,EUR,AMAZON.COM ORDER
2024-03-22,-15.00,EUR,NEWSERVICE *MONTHLY
2024-04-03,-14.99,EUR,NETFLIX.COM
2024-04-05,-9.99,EUR,SPOTIFY AB
2024-04-10,-55.30,EUR,RIMI HYPERMARKET
2024-04-15,-8.50,EUR,BOLT *RIDE
2024-04-22,-15.00,EUR,NEWSERVICE *MONTHLY
2024-04-28,-180.00,EUR,AMAZON.COM PURCHASE`;

// ── Components ─────────────────────────────────────────────────────────────────

const Badge = ({ color, children }) => {
  const colors = {
    green: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    red: "bg-red-500/15 text-red-400 border border-red-500/30",
    yellow: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    blue: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    purple: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
    gray: "bg-zinc-700/50 text-zinc-400 border border-zinc-600/50",
  };
  return <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${colors[color] || colors.gray}`}>{children}</span>;
};

const Stat = ({ label, value, sub, accent }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-bold font-mono ${accent || "text-white"}`}>{value}</p>
    {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
  </div>
);

const TrendArrow = ({ pct }) => {
  if (Math.abs(pct) < 1) return <span className="text-zinc-500 text-xs">≈ sama</span>;
  return pct > 0
    ? <span className="text-red-400 text-xs font-mono">▲ +{pct.toFixed(1)}%</span>
    : <span className="text-emerald-400 text-xs font-mono">▼ {pct.toFixed(1)}%</span>;
};

const MiniBar = ({ value, max, color }) => (
  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden w-full">
    <div
      className={`h-full rounded-full transition-all duration-700 ${color || "bg-violet-500"}`}
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    />
  </div>
);

// ── CalendarPicker Component ─────────────────────────────────────────────────

const CalendarPicker = ({ localStart, localEnd, setLocalStart, setLocalEnd, minDate, maxDate, setDateRange, onClose }) => {
  const toISO = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");

  const initMonth = localEnd
    ? new Date(localEnd.slice(0,7) + "-01T12:00:00")
    : maxDate ? new Date(maxDate.slice(0,7) + "-01T12:00:00") : new Date();
  const initPrev = new Date(initMonth.getFullYear(), initMonth.getMonth() - 1, 1, 12);

  const [leftMonth, setLeftMonth] = React.useState(initPrev);
  const [rightMonth, setRightMonth] = React.useState(initMonth);
  const [hoverDay, setHoverDay] = React.useState(null);
  // yearPicker: null | "left" | "right"
  const [yearPicker, setYearPicker] = React.useState(null);

  const DAYS = ["E","T","K","N","R","L","P"];
  const MONTHS_ET = ["Jaan","Veebr","Märts","Apr","Mai","Juuni","Juuli","Aug","Sept","Okt","Nov","Dets"];

  const minYear = minDate ? parseInt(minDate.slice(0,4)) : 2000;
  const maxYear = maxDate ? parseInt(maxDate.slice(0,4)) : new Date().getFullYear();
  const years = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  const applyLive = (s, e) => setDateRange({ start: s || null, end: e || null });

  const handleDayClick = iso => {
    if (!localStart || (localStart && localEnd)) {
      setLocalStart(iso); setLocalEnd(""); applyLive(iso, null);
    } else {
      if (iso < localStart) {
        setLocalEnd(localStart); setLocalStart(iso); applyLive(iso, localStart);
      } else {
        setLocalEnd(iso); applyLive(localStart, iso);
      }
    }
  };

  const selectYear = (y, side) => {
    if (side === "left") {
      const d = new Date(y, leftMonth.getMonth(), 1, 12);
      setLeftMonth(d);
      setRightMonth(new Date(d.getFullYear(), d.getMonth()+1, 1, 12));
    } else {
      const d = new Date(y, rightMonth.getMonth(), 1, 12);
      setRightMonth(d);
      setLeftMonth(new Date(d.getFullYear(), d.getMonth()-1, 1, 12));
    }
    setYearPicker(null);
  };

  const inRange = iso => {
    const end = localEnd || hoverDay;
    if (!localStart || localEnd) return false;
    if (!end) return false;
    const [s, e] = localStart < end ? [localStart, end] : [end, localStart];
    return iso > s && iso < e;
  };
  const isStart = iso => iso === localStart;
  const isEnd = iso => iso === (localEnd || (localStart && hoverDay && hoverDay !== localStart ? hoverDay : null));

  const renderMonth = (baseDate, side) => {
    const y = baseDate.getFullYear(), m = baseDate.getMonth();
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const prevMonth = () => {
      const d = new Date(baseDate); d.setMonth(d.getMonth() - 1);
      if (side === "left") { setLeftMonth(d); setRightMonth(new Date(d.getFullYear(), d.getMonth()+1, 1, 12)); }
      else { setRightMonth(d); setLeftMonth(new Date(d.getFullYear(), d.getMonth()-1, 1, 12)); }
    };
    const nextMonth = () => {
      const d = new Date(baseDate); d.setMonth(d.getMonth() + 1);
      if (side === "left") { setLeftMonth(d); setRightMonth(new Date(d.getFullYear(), d.getMonth()+1, 1, 12)); }
      else { setRightMonth(d); setLeftMonth(new Date(d.getFullYear(), d.getMonth()-1, 1, 12)); }
    };

    const isYearOpen = yearPicker === side;

    return (
      <div style={{ width:"200px", position:"relative" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
          <button onClick={prevMonth} style={{ background:"none", border:"none", color:"#71717a", cursor:"pointer", fontSize:"16px", padding:"2px 6px", fontFamily:"inherit" }}>‹</button>
          <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <span style={{ fontSize:"12px", fontWeight:600, color:"#d4d4d8" }}>{MONTHS_ET[m]}</span>
            {/* Year button — opens year picker */}
            <button
              onClick={() => setYearPicker(isYearOpen ? null : side)}
              style={{
                fontSize:"12px", fontWeight:600, padding:"2px 7px", borderRadius:"6px", cursor:"pointer",
                fontFamily:"inherit", border:"1px solid " + (isYearOpen ? "#7c3aed" : "#27272a"),
                background: isYearOpen ? "#1e1028" : "#18181b",
                color: isYearOpen ? "#a78bfa" : "#d4d4d8",
                transition:"all 0.15s",
              }}
            >{y} {isYearOpen ? "▲" : "▼"}</button>
          </div>
          <button onClick={nextMonth} style={{ background:"none", border:"none", color:"#71717a", cursor:"pointer", fontSize:"16px", padding:"2px 6px", fontFamily:"inherit" }}>›</button>
        </div>

        {/* Year picker dropdown */}
        {isYearOpen && (
          <div style={{
            position:"absolute", top:"36px", left:"50%", transform:"translateX(-50%)",
            zIndex:10, background:"#0a0a0a", border:"1px solid #2d2d2d", borderRadius:"10px",
            padding:"8px", maxHeight:"180px", overflowY:"auto", width:"120px",
            boxShadow:"0 6px 24px rgba(0,0,0,0.7)",
          }}>
            {years.map(yr => (
              <div
                key={yr}
                onClick={() => selectYear(yr, side)}
                style={{
                  padding:"6px 12px", fontSize:"12px", borderRadius:"6px", cursor:"pointer",
                  background: yr === y ? "#7c3aed" : "transparent",
                  color: yr === y ? "#fff" : "#a1a1aa",
                  fontWeight: yr === y ? 700 : 400,
                  textAlign:"center",
                }}
                onMouseEnter={e => { if (yr !== y) e.target.style.background = "#1a1a1a"; }}
                onMouseLeave={e => { if (yr !== y) e.target.style.background = "transparent"; }}
              >{yr}</div>
            ))}
          </div>
        )}

        {/* Day-of-week headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:"4px" }}>
          {DAYS.map(d => <div key={d} style={{ textAlign:"center", fontSize:"9px", color:"#3f3f46", padding:"2px 0" }}>{d}</div>)}
        </div>
        {/* Day cells */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"1px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={"e"+i} />;
            const iso = toISO(new Date(y, m, day, 12));
            const isDisabled = (minDate && iso < minDate) || (maxDate && iso > maxDate);
            const start = isStart(iso), end = isEnd(iso), mid = inRange(iso);
            const isToday = iso === toISO(new Date());
            return (
              <div
                key={iso}
                onClick={() => !isDisabled && handleDayClick(iso)}
                onMouseEnter={() => localStart && !localEnd && setHoverDay(iso)}
                onMouseLeave={() => setHoverDay(null)}
                style={{
                  textAlign:"center", padding:"5px 0", fontSize:"11px", borderRadius:"6px",
                  cursor: isDisabled ? "default" : "pointer",
                  background: (start||end) ? "#7c3aed" : mid ? "#2d1f4e" : "transparent",
                  color: isDisabled ? "#2d2d2d" : (start||end) ? "#fff" : mid ? "#a78bfa" : isToday ? "#a78bfa" : "#a1a1aa",
                  fontWeight: (start||end) ? 700 : isToday ? 600 : 400,
                  outline: isToday && !(start||end) ? "1px solid #4c1d95" : "none",
                  transition:"background 0.1s",
                }}
              >{day}</div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:99 }} />
      <div onClick={e => e.stopPropagation()} style={{
        position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:100,
        background:"#0f0f0f", border:"1px solid #2d2d2d", borderRadius:"14px",
        padding:"16px", boxShadow:"0 8px 40px rgba(0,0,0,0.8)",
      }}>
        <div style={{ fontSize:"10px", color:"#7c3aed", letterSpacing:"0.1em", marginBottom:"14px" }}>◈ VALI VAHEMIK</div>

        {/* Two month calendars side by side */}
        <div style={{ display:"flex", gap:"20px", marginBottom:"14px" }}>
          {renderMonth(leftMonth, "left")}
          <div style={{ width:"1px", background:"#1f1f1f" }} />
          {renderMonth(rightMonth, "right")}
        </div>

        {/* Selection display */}
        <div style={{ fontSize:"11px", color:"#71717a", padding:"6px 10px", background:"#0a0a0a", borderRadius:"6px", marginBottom:"12px", minHeight:"28px" }}>
          {localStart
            ? <>{fmtDate(localStart)} → {fmtDate(localEnd) || <span style={{color:"#3f3f46"}}>vali lõppkuupäev</span>}</>
            : <span style={{color:"#3f3f46"}}>Vali alguskuupäev</span>
          }
        </div>

        <div style={{ display:"flex", gap:"8px" }}>
          <button
            onClick={() => { setLocalStart(""); setLocalEnd(""); setDateRange({start:null,end:null}); onClose(); }}
            style={{ flex:1, fontSize:"11px", padding:"8px", borderRadius:"7px", border:"1px solid #27272a", background:"#18181b", color:"#71717a", cursor:"pointer", fontFamily:"inherit" }}
          >Tühista</button>
          <button
            onClick={onClose}
            style={{ flex:1, fontSize:"11px", padding:"8px", borderRadius:"7px", border:"none", background: localStart && localEnd ? "#7c3aed" : "#27272a", color: localStart && localEnd ? "white" : "#52525b", cursor: localStart && localEnd ? "pointer" : "default", fontFamily:"inherit", fontWeight:600 }}
          >Sulge ✓</button>
        </div>
      </div>
    </>
  );
};

// ── SummaryDateFilter Component ──────────────────────────────────────────────

const SummaryDateFilter = ({ dateRange, setDateRange, showDatePicker, setShowDatePicker, transactions }) => {
  // Convert a Date object to "YYYY-MM-DD" using LOCAL time (avoids UTC midnight shifts)
  const toISO = d => {
    if (!d || isNaN(d)) return "";
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  };

  // Parse any date string into a Date at local noon (avoids timezone -1 day bugs)
  const parseDate = str => {
    if (!str) return null;
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split("-").map(Number);
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    // DD.MM.YYYY
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(str)) {
      const [d, m, y] = str.split(".").map(Number);
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    // MM/DD/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [m, d, y] = str.split("/").map(Number);
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    // Fallback
    const d = new Date(str);
    if (!isNaN(d)) { d.setHours(12, 0, 0, 0); return d; }
    return null;
  };

  // Sort dates properly by converting to comparable YYYY-MM-DD
  const sortedDates = transactions
    .map(t => parseDate(t.date))
    .filter(Boolean)
    .sort((a, b) => a - b);

  const minDate = sortedDates.length ? toISO(sortedDates[0]) : "";
  const maxDate = sortedDates.length ? toISO(sortedDates[sortedDates.length - 1]) : "";

  const [localStart, setLocalStart] = React.useState(dateRange.start || "");
  const [localEnd, setLocalEnd] = React.useState(dateRange.end || "");

  const isActive = !!(dateRange.start || dateRange.end);

  const applyAndClose = (s, e) => {
    setDateRange({ start: s || null, end: e || null });
    setShowDatePicker(false);
  };

  // Reference = today, but clamped to data's last date so presets always show results
  const todayDate = new Date();
  todayDate.setHours(12, 0, 0, 0);
  const today = toISO(todayDate);
  // If today is after the data, use data's last date as anchor so presets yield results
  const refStr = (maxDate && maxDate < today) ? maxDate : today;
  const ref = new Date(refStr + "T12:00:00");

  // N days before today
  const daysBack = n => {
    const d = new Date(ref);
    d.setDate(d.getDate() - n);
    return toISO(d);
  };

  // end = today (or maxDate if today is after data range — show all available data up to today)
  const capEnd = maxDate < today ? maxDate : today;

  const presets = [
    {
      label: "Jooksev nädal",
      fn: () => {
        const dow = ref.getDay() === 0 ? 7 : ref.getDay();
        const s = daysBack(dow - 1); const e = refStr;
        setLocalStart(s); setLocalEnd(e); applyAndClose(s, e);
      }
    },
    {
      label: "Jooksev kuu",
      fn: () => {
        const s = toISO(new Date(ref.getFullYear(), ref.getMonth(), 1, 12));
        const e = refStr;
        setLocalStart(s); setLocalEnd(e); applyAndClose(s, e);
      }
    },
    {
      label: "Eelmine nädal",
      fn: () => {
        const dow = ref.getDay() === 0 ? 7 : ref.getDay();
        const s = daysBack(dow + 6); const e = daysBack(dow);
        setLocalStart(s); setLocalEnd(e); applyAndClose(s, e);
      }
    },
    {
      label: "Eelmine kuu",
      fn: () => {
        const s = toISO(new Date(ref.getFullYear(), ref.getMonth() - 1, 1, 12));
        const e = toISO(new Date(ref.getFullYear(), ref.getMonth(), 0, 12));
        setLocalStart(s); setLocalEnd(e); applyAndClose(s, e);
      }
    },
    {
      label: "Eelmised 60 päeva",
      fn: () => {
        const s = daysBack(60); const e = refStr;
        setLocalStart(s); setLocalEnd(e); applyAndClose(s, e);
      }
    },
    {
      label: "Eelmised 90 päeva",
      fn: () => {
        const s = daysBack(90); const e = refStr;
        setLocalStart(s); setLocalEnd(e); applyAndClose(s, e);
      }
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger button row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => setShowDatePicker(p => !p)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px", borderRadius: "8px", fontSize: "11px", cursor: "pointer",
            border: "1px solid " + (isActive ? "#7c3aed" : "#27272a"),
            background: isActive ? "#1e1028" : "#0f0f0f",
            color: isActive ? "#a78bfa" : "#71717a",
            fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
          }}
        >
          <span>📅</span>
          <span>
            {isActive
              ? (fmtDate(dateRange.start) || "…") + " → " + (fmtDate(dateRange.end) || "…")
              : "Filtreeri kuupäeva järgi"}
          </span>
          {isActive && (
            <span
              onClick={e => { e.stopPropagation(); setDateRange({ start: null, end: null }); setLocalStart(""); setLocalEnd(""); }}
              style={{ marginLeft: "2px", color: "#71717a", fontWeight: 700, fontSize: "14px", lineHeight: 1, cursor: "pointer" }}
            >×</span>
          )}
        </button>

        {/* Quick preset pills always visible */}
        {presets.map(p => (
          <button key={p.label} onClick={p.fn} style={{
            fontSize: "10px", padding: "5px 10px", borderRadius: "20px", cursor: "pointer",
            border: "1px solid #27272a", background: "#0f0f0f", color: "#52525b",
            fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { e.target.style.color = "#a1a1aa"; e.target.style.borderColor = "#3f3f46"; }}
          onMouseLeave={e => { e.target.style.color = "#52525b"; e.target.style.borderColor = "#27272a"; }}
          >{p.label}</button>
        ))}
      </div>

      {/* Custom calendar dropdown */}
      {showDatePicker && (
        <CalendarPicker
          localStart={localStart} localEnd={localEnd}
          setLocalStart={setLocalStart} setLocalEnd={setLocalEnd}
          minDate={minDate} maxDate={maxDate}
          setDateRange={setDateRange}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

// ── MonthScroller Component ───────────────────────────────────────────────────

const MonthScroller = ({ monthly, activeMonth, setActiveMonth }) => {
  const scrollRef = React.useRef(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector("[data-active='true']");
    if (activeBtn) {
      const elLeft = el.getBoundingClientRect().left;
      const btnLeft = activeBtn.getBoundingClientRect().left;
      const btnCenter = btnLeft - elLeft + activeBtn.offsetWidth / 2;
      const targetScroll = el.scrollLeft + btnCenter - el.offsetWidth / 2;
      el.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [activeMonth]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onDown = e => {
      isDragging.current = true;
      startX.current = (e.touches ? e.touches[0].pageX : e.pageX) - el.getBoundingClientRect().left;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onUp = () => { isDragging.current = false; el.style.cursor = "grab"; };
    const onMove = e => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - el.getBoundingClientRect().left;
      el.scrollLeft = scrollLeft.current - (x - startX.current);
    };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  const MONTH_ET = ["jaan", "veebr", "märts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets"];
  const maxTotal = Math.max(...monthly.map(m => m.total));
  const activeIdx = monthly.findIndex(m => m.month === activeMonth);
  const canPrev = activeIdx > 0;
  const canNext = activeIdx < monthly.length - 1;

  const arrowBtn = (dir) => {
    const can = dir === "prev" ? canPrev : canNext;
    return (
      <button
        onClick={() => can && setActiveMonth(monthly[activeIdx + (dir === "prev" ? -1 : 1)].month)}
        style={{
          flexShrink: 0, width: "32px", height: "32px", borderRadius: "8px",
          border: "1px solid #27272a", background: can ? "#18181b" : "#0a0a0a",
          color: can ? "#a1a1aa" : "#2d2d2d", cursor: can ? "pointer" : "default",
          fontSize: "18px", lineHeight: 1, display: "flex", alignItems: "center",
          justifyContent: "center", fontFamily: "inherit", transition: "all 0.15s",
        }}
      >{dir === "prev" ? "‹" : "›"}</button>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
      {arrowBtn("prev")}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowX: "auto", cursor: "grab",
          scrollbarWidth: "none", msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ display: "flex", gap: "8px", paddingBottom: "2px" }}>
          {monthly.map((m, i) => {
            const prev = monthly[i - 1];
            const delta = prev ? ((m.total - prev.total) / prev.total) * 100 : null;
            const isActive = activeMonth === m.month;
            const [year, mon] = m.month.split("-");
            const label = `${MONTH_ET[parseInt(mon, 10) - 1]} ${year}`;
            const barH = Math.max(4, Math.round((m.total / maxTotal) * 36));
            return (
              <button
                key={m.month}
                data-active={isActive ? "true" : "false"}
                onClick={() => setActiveMonth(m.month)}
                style={{
                  flexShrink: 0, cursor: "pointer", border: "none", borderRadius: "10px",
                  fontFamily: "inherit", padding: "10px 14px", width: "90px",
                  background: isActive ? "#1e1028" : "#0f0f0f",
                  outline: isActive ? "1px solid #7c3aed" : "1px solid #1f1f1f",
                  transition: "all 0.15s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-end", height: "40px" }}>
                  <div style={{
                    width: "28px", borderRadius: "3px 3px 0 0", height: `${barH}px`,
                    background: isActive
                      ? "linear-gradient(to top, #7c3aed, #a78bfa)"
                      : "linear-gradient(to top, #27272a, #3f3f46)",
                    transition: "height 0.3s",
                  }} />
                </div>
                <span style={{ fontSize: "10px", color: isActive ? "#a78bfa" : "#71717a", fontWeight: 600, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {label}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: isActive ? "#e4e4e7" : "#a1a1aa" }}>
                  {m.total.toFixed(0)}€
                </span>
                {delta !== null
                  ? <span style={{ fontSize: "10px", color: delta > 5 ? "#f87171" : delta < -5 ? "#34d399" : "#52525b" }}>
                      {delta > 0 ? `▲ +${delta.toFixed(0)}%` : `▼ ${delta.toFixed(0)}%`}
                    </span>
                  : <span style={{ fontSize: "10px", color: "#3f3f46" }}>—</span>
                }
              </button>
            );
          })}
        </div>
      </div>
      {arrowBtn("next")}
    </div>
  );
};

// ── Main App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("upload");
  const [csvText, setCsvText] = useState("");
  const [mapping, setMapping] = useState({ date: "Date", amount: "Amount", description: "Description", currency: "Currency" });
  const [transactions, setTransactions] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [aliasInput, setAliasInput] = useState({ raw: "", norm: "" });
  const [userAliases, setUserAliases] = useState({});
  const [activeMonth, setActiveMonth] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setCsvText(text);
      const firstLine = text.split("\n")[0];
      const headers = firstLine.split(/[,;]/).map(h => h.trim().replace(/"/g, ""));
      setCsvHeaders(headers);
      const autoMap = { ...mapping };
      headers.forEach(h => {
        const l = h.toLowerCase();
        if (l.includes("date") || l.includes("kuupäev")) autoMap.date = h;
        if (l.includes("amount") || l.includes("summa") || l.includes("debit")) autoMap.amount = h;
        if (l.includes("desc") || l.includes("kirjeldus") || l.includes("detail")) autoMap.description = h;
        if (l.includes("currency") || l.includes("valuuta")) autoMap.currency = h;
      });
      setMapping(autoMap);
    };
    reader.readAsText(file);
  }, [mapping]);

  const loadDemo = () => {
    setCsvText(DEMO_CSV);
    setCsvHeaders(["Date", "Amount", "Currency", "Description"]);
    setMapping({ date: "Date", amount: "Amount", description: "Description", currency: "Currency" });
  };

  const processData = () => {
    if (!csvText) return;
    const txns = parseCSV(csvText, mapping);
    // apply user aliases
    txns.forEach(t => {
      for (const [raw, norm] of Object.entries(userAliases)) {
        if (t.description_raw.toUpperCase().includes(raw.toUpperCase())) {
          t.merchant_norm = norm;
          t.category = categorize(norm);
        }
      }
    });
    setTransactions(txns);
    const months = getMonthlySummary(txns);
    if (months.length) setActiveMonth(months[months.length - 1].month);
    setTab("summary");
  };

  const filteredTransactions = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return transactions;
    return transactions.filter(t => {
      const d = t.date;
      if (dateRange.start && d < dateRange.start) return false;
      if (dateRange.end && d > dateRange.end) return false;
      return true;
    });
  }, [transactions, dateRange]);

  const recurring = useMemo(() => detectRecurring(filteredTransactions), [filteredTransactions]);
  const duplicates = useMemo(() => detectDuplicates(filteredTransactions, recurring), [filteredTransactions, recurring]);
  const anomalies = useMemo(() => detectAnomalies(filteredTransactions), [filteredTransactions]);
  const newMerchants = useMemo(() => getNewMerchants(filteredTransactions), [filteredTransactions]);
  const monthly = useMemo(() => getMonthlySummary(filteredTransactions), [filteredTransactions]);

  // When dateRange changes, jump activeMonth to the last month in the filtered range
  React.useEffect(() => {
    if (monthly.length === 0) return;
    // Pick the month that contains dateRange.end, or fall back to last available month
    const targetMonth = dateRange.end
      ? dateRange.end.slice(0, 7)
      : dateRange.start
      ? dateRange.start.slice(0, 7)
      : null;
    if (targetMonth) {
      // Find exact match or nearest month that exists in filtered data
      const exact = monthly.find(m => m.month === targetMonth);
      if (exact) { setActiveMonth(exact.month); return; }
      // No exact match — pick closest month
      const closest = monthly.reduce((prev, curr) =>
        Math.abs(curr.month.localeCompare(targetMonth)) < Math.abs(prev.month.localeCompare(targetMonth)) ? curr : prev
      );
      setActiveMonth(closest.month);
    } else {
      // No filter — go to last month
      const exists = monthly.find(m => m.month === activeMonth);
      if (!exists) setActiveMonth(monthly[monthly.length - 1].month);
    }
  }, [monthly, dateRange]);

  const currentMonth = monthly.find(m => m.month === activeMonth) || monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.indexOf(currentMonth) - 1];

  // viewData = full period aggregate when date filter is active, else single month
  const viewData = React.useMemo(() => {
    const isFiltered = dateRange.start || dateRange.end;
    if (!isFiltered) return currentMonth;
    if (!filteredTransactions.length) return currentMonth;
    const byCategory = {};
    filteredTransactions.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + Math.abs(t.amount);
    });
    const topMerchants = Object.entries(
      filteredTransactions.reduce((acc, t) => {
        acc[t.merchant_norm] = (acc[t.merchant_norm] || 0) + Math.abs(t.amount);
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return {
      month: null,
      total: filteredTransactions.reduce((s, t) => s + Math.abs(t.amount), 0),
      count: filteredTransactions.length,
      byCategory,
      topMerchants,
    };
  }, [filteredTransactions, dateRange, currentMonth]);

  const periodLabel = dateRange.start || dateRange.end
    ? (fmtDate(dateRange.start) || "…") + " → " + (fmtDate(dateRange.end) || "…")
    : currentMonth?.month || "";

  const exportHTML = () => {
    const dateLabel = dateRange.start || dateRange.end
      ? `${dateRange.start || "algusest"} → ${dateRange.end || "lõpuni"}`
      : "Kõik tehingud";
    const totalAll = filteredTransactions.reduce((s, t) => s + Math.abs(t.amount), 0);
    const byCat = {};
    filteredTransactions.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount); });
    const catRows = Object.entries(byCat).sort((a,b) => b[1]-a[1])
      .map(([c,v]) => `<tr><td>${c}</td><td style="text-align:right;font-weight:600">${v.toFixed(2)}€</td></tr>`).join("");
    const recurRows = recurring.map(r =>
      `<tr><td><strong>${r.merchant}</strong></td><td>${r.period}</td><td style="text-align:right">${r.avgAmount.toFixed(2)}€</td><td style="text-align:right;color:${r.trend>5?"#f87171":r.trend<-5?"#34d399":"#aaa"}">${r.trend>0?"▲ +"+r.trend.toFixed(1)+"%":r.trend<0?"▼ "+r.trend.toFixed(1)+"%":"≈"}</td></tr>`).join("");
    const anomalyRows = anomalies.map(a =>
      `<tr><td>${fmtDate(a.transaction.date)}</td><td><strong>${a.transaction.merchant_norm}</strong></td><td style="text-align:right;color:#f87171">${Math.abs(a.transaction.amount).toFixed(2)}€</td><td style="text-align:right">~${a.mean.toFixed(2)}€</td><td style="text-align:right">${a.zScore.toFixed(1)}σ</td></tr>`).join("");
    const dupeRows = duplicates.map(d =>
      `<tr><td><strong>${d.a.merchant_norm}</strong></td><td style="text-align:right;color:#f87171">${Math.abs(d.a.amount).toFixed(2)}€</td><td>${[d.a.date.slice(5,7),d.a.date.slice(8,10),d.a.date.slice(0,4)].join("/")}</td><td>${[d.b.date.slice(5,7),d.b.date.slice(8,10),d.b.date.slice(0,4)].join("/")}</td><td style="text-align:right">${d.dayDiff} päeva</td></tr>`).join("");
    const txRows = filteredTransactions.slice(0,500).map(t =>
      `<tr><td>${[t.date.slice(5,7),t.date.slice(8,10),t.date.slice(0,4)].join("/")}</td><td>${t.merchant_norm}</td><td style="color:#888;font-size:11px">${t.description_raw.slice(0,40)}</td><td style="text-align:right">${Math.abs(t.amount).toFixed(2)}€</td><td>${t.category}</td></tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="et">
<head>
<meta charset="UTF-8">
<title>Kulude Raport</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', monospace; background: #080808; color: #e4e4e7; padding: 2rem; max-width: 960px; margin: 0 auto; }
  h1 { font-size: 1.4rem; color: #a78bfa; letter-spacing: .08em; margin-bottom: .25rem; }
  .meta { color: #52525b; font-size: 12px; margin-bottom: 2rem; }
  h2 { font-size: 11px; color: #7c3aed; letter-spacing: .1em; margin: 2rem 0 .75rem; padding-bottom: .4rem; border-bottom: 1px solid #1f1f1f; }
  .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 2rem; }
  .stat { background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 10px; padding: 14px; }
  .stat-val { font-size: 1.5rem; font-weight: 700; color: #a78bfa; }
  .stat-lbl { font-size: 10px; color: #52525b; margin-top: 4px; letter-spacing: .08em; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 1.5rem; }
  th { text-align: left; padding: 6px 8px; color: #52525b; font-weight: 400; font-size: 10px; letter-spacing: .08em; border-bottom: 1px solid #1f1f1f; }
  td { padding: 8px; border-bottom: 1px solid #111; color: #a1a1aa; }
  tr:hover td { background: #0f0f0f; }
  .badge { display:inline-block; background:#1e1b4b; color:#a78bfa; padding:2px 8px; border-radius:12px; font-size:10px; }
  @media print { body { background: white; color: black; } .stat { border-color: #ddd; } td,th { border-color: #ddd; color: #333; } h2 { color: #6d28d9; } }
</style>
</head>
<body>
<h1>◈ EXPENSE PATTERN FINDER</h1>
<div class="meta">Raport genereeritud: ${new Date().toLocaleDateString("et-EE")} · Periood: ${dateLabel} · ${filteredTransactions.length} tehingut</div>

<div class="stats">
  <div class="stat"><div class="stat-val">${totalAll.toFixed(2)}€</div><div class="stat-lbl">KOGUKULU</div></div>
  <div class="stat"><div class="stat-val">${filteredTransactions.length}</div><div class="stat-lbl">TEHINGUID</div></div>
  <div class="stat"><div class="stat-val">${recurring.length}</div><div class="stat-lbl">KORDUVAD</div></div>
  <div class="stat"><div class="stat-val">${anomalies.length + duplicates.length}</div><div class="stat-lbl">ANOMAALIAD</div></div>
</div>

<h2>◈ KATEGOORIAD</h2>
<table><thead><tr><th>KATEGOORIA</th><th style="text-align:right">KOKKU</th></tr></thead><tbody>${catRows}</tbody></table>

<h2>◈ KORDUVAD MAKSED (${recurring.length})</h2>
<table><thead><tr><th>KAUPMEES</th><th>PERIOOD</th><th style="text-align:right">KESK. SUMMA</th><th style="text-align:right">TREND</th></tr></thead><tbody>${recurRows}</tbody></table>

<h2>◈ ANOMAALIAD (${anomalies.length})</h2>
<table><thead><tr><th>KUUPÄEV</th><th>KAUPMEES</th><th style="text-align:right">SUMMA</th><th style="text-align:right">TAVAPÄRANE</th><th style="text-align:right">Z-SKOOR</th></tr></thead><tbody>${anomalyRows || '<tr><td colspan="5" style="color:#3f3f46;text-align:center;padding:1rem">Anomaaliaid ei leitud</td></tr>'}</tbody></table>

<h2>◈ KAHTLASED KORDUVMAKSED (${duplicates.length})</h2>
<table><thead><tr><th>KAUPMEES</th><th style="text-align:right">SUMMA</th><th>1. MAKSE</th><th>2. MAKSE</th><th style="text-align:right">VAHE</th></tr></thead><tbody>${dupeRows || '<tr><td colspan="5" style="color:#3f3f46;text-align:center;padding:1rem">Kahtlaseid makseid ei leitud</td></tr>'}</tbody></table>

<h2>◈ TEHINGUD (${filteredTransactions.length > 500 ? "esimesed 500 / " + filteredTransactions.length : filteredTransactions.length})</h2>
<table><thead><tr><th>KUUPÄEV</th><th>KAUPMEES</th><th>KIRJELDUS</th><th style="text-align:right">SUMMA</th><th>KATEGOORIA</th></tr></thead><tbody>${txRows}</tbody></table>
</body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `kulude-raport-${new Date().toISOString().slice(0,10)}.html`; a.click();
  };

  const exportCSV = () => {
    const escapeCSV = v => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    // Sheet 1: transactions
    const txRows = [["Kuupäev","Kaupmees","Kirjeldus","Summa","Valuuta","Kategooria"]];
    filteredTransactions.forEach(t => txRows.push([t.date, t.merchant_norm, t.description_raw, Math.abs(t.amount).toFixed(2), t.currency, t.category]));

    // Sheet 2: recurring
    const recRows = [["","Korduvad maksed"],["Kaupmees","Periood","Kesk. summa","Trend %","Kategooria"]];
    recurring.forEach(r => recRows.push([r.merchant, r.period, r.avgAmount.toFixed(2), r.trend.toFixed(1), r.category]));

    // Sheet 3: anomalies
    const anRows = [["","Anomaaliad"],["Kuupäev","Kaupmees","Summa","Tavapärane","Z-skoor"]];
    anomalies.forEach(a => anRows.push([a.transaction.date, a.transaction.merchant_norm, Math.abs(a.transaction.amount).toFixed(2), a.mean.toFixed(2), a.zScore.toFixed(2)]));

    // Sheet 4: duplicates
    const dupRows = [["","Kahtlased korduvmaksed"],["Kaupmees","Summa","1. kuupäev","2. kuupäev","Päevade vahe"]];
    duplicates.forEach(d => dupRows.push([d.a.merchant_norm, Math.abs(d.a.amount).toFixed(2), d.a.date, d.b.date, d.dayDiff]));

    // Combine all sections with blank line separators
    const allRows = [
      ["Kulude Raport", new Date().toLocaleDateString("et-EE")],
      ["Periood", dateRange.start || "algusest", "→", dateRange.end || "lõpuni"],
      ["Tehinguid", filteredTransactions.length],
      [],
      ...txRows,
      [],
      ...recRows,
      [],
      ...anRows,
      [],
      ...dupRows,
    ];

    const csv = "\uFEFF" + allRows.map(r => r.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `kulude-raport-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const tabs = [
    { id: "upload", label: "📁 Import" },
    { id: "summary", label: "📊 Kokkuvõte" },
    { id: "recurring", label: `🔄 Korduvad (${recurring.length})` },
    { id: "anomalies", label: `⚠️ Anomaaliad (${anomalies.length + duplicates.length})` },
    { id: "transactions", label: `💳 Tehingud (${filteredTransactions.length})` },
    { id: "settings", label: "⚙️ Reeglid" },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", background: "#080808", height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden", color: "#e4e4e7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        input[type=file] { display: none; }
        .tab-active { background: #18181b; border-bottom: 2px solid #7c3aed; color: #a78bfa; }
        .tab-inactive { color: #52525b; border-bottom: 2px solid transparent; }
        .tab-inactive:hover { color: #a1a1aa; }
        .row-hover:hover { background: #111; }
        .card { background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 12px; padding: 1rem; }
        select, input { background: #111; border: 1px solid #27272a; color: #e4e4e7; border-radius: 6px; padding: 6px 10px; font-family: inherit; font-size: 12px; }
        select:focus, input:focus { outline: 1px solid #7c3aed; }
        .btn { cursor: pointer; border: none; border-radius: 8px; font-family: inherit; font-weight: 600; font-size: 12px; padding: 8px 16px; transition: opacity 0.15s; }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: #7c3aed; color: white; }
        .btn-ghost { background: #18181b; border: 1px solid #27272a; color: #a1a1aa; }
        .btn-danger { background: #dc2626; color: white; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.05em" }}>
            ◈ EXPENSE PATTERN FINDER
          </h1>
          <p style={{ margin: 0, fontSize: "10px", color: "#52525b", letterSpacing: "0.1em" }}>KULUDE MUSTRITE AVASTAJA</p>
        </div>
        {transactions.length > 0 && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-ghost" onClick={exportCSV}>⬇ CSV</button>
            <button className="btn btn-ghost" onClick={exportHTML}>⬇ HTML Raport</button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", padding: "0 1.5rem", overflowX: "auto" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`btn ${tab === t.id ? "tab-active" : "tab-inactive"}`}
            style={{ background: "none", borderRadius: 0, padding: "10px 16px", fontSize: "11px", whiteSpace: "nowrap", letterSpacing: "0.02em" }}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto", flex: 1, overflowY: "auto", width: "100%" }}>

        {/* ── UPLOAD TAB ── */}
        {tab === "upload" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📁</div>
              <p style={{ color: "#71717a", fontSize: "13px", marginBottom: "1.5rem" }}>
                Lae üles oma panga CSV fail (Swedbank, LHV, SEB, Revolut jne)
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <label className="btn btn-primary" style={{ cursor: "pointer" }}>
                  <input type="file" accept=".csv,.txt" onChange={handleFile} />
                  ⬆ Vali CSV fail
                </label>
                <button className="btn btn-ghost" onClick={loadDemo}>▶ Laadi demo andmed</button>
              </div>
            </div>

            {csvHeaders.length > 0 && (
              <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontSize: "12px", color: "#7c3aed", letterSpacing: "0.1em" }}>◈ VEERGUDE KAARDISTUS</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {["date", "amount", "description", "currency"].map(field => (
                    <div key={field}>
                      <label style={{ fontSize: "11px", color: "#52525b", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {field === "date" ? "Kuupäev" : field === "amount" ? "Summa" : field === "description" ? "Kirjeldus" : "Valuuta"}
                      </label>
                      <select value={mapping[field]} onChange={e => setMapping({ ...mapping, [field]: e.target.value })} style={{ width: "100%" }}>
                        {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#0a0a0a", borderRadius: "8px", fontSize: "11px", color: "#52525b" }}>
                  <strong style={{ color: "#71717a" }}>Eelvaade:</strong>
                  <pre style={{ margin: "8px 0 0", overflowX: "auto", color: "#a1a1aa" }}>{csvText.split("\n").slice(0, 3).join("\n")}</pre>
                </div>
                <button className="btn btn-primary" style={{ marginTop: "1rem", width: "100%", padding: "12px" }} onClick={processData}>
                  ◈ ANALÜÜSI TEHINGUID →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SUMMARY TAB ── */}
        {tab === "summary" && transactions.length > 0 && (
          <div style={{ display: "grid", gap: "1rem" }}>

            {/* ── Date range picker panel ── */}
            <SummaryDateFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              transactions={transactions}
            />

            {/* ── Month scroller ── */}
            <MonthScroller
              monthly={monthly}
              activeMonth={activeMonth}
              setActiveMonth={setActiveMonth}
            />

            {/* ── Stats row ── */}
            {viewData && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                <Stat label="Kogukulu" value={viewData.total.toFixed(2) + "€"}
                  sub={(!dateRange.start && !dateRange.end) && prevMonth ? "vs eelmine " + prevMonth.total.toFixed(2) + "€" : periodLabel}
                  accent={prevMonth && viewData.total > prevMonth.total * 1.1 ? "text-red-400" : "text-white"}
                />
                <Stat label="Tehinguid" value={viewData.count} />
                <Stat label="Korduvad" value={recurring.length} sub="tuvastatud mustrit" accent="text-violet-400" />
                <Stat label="Anomaaliad" value={anomalies.length + duplicates.length} sub="vajavad ülevaatust"
                  accent={anomalies.length + duplicates.length > 0 ? "text-amber-400" : "text-white"} />
              </div>
            )}

            {/* ── Category breakdown ── */}
            {viewData && (
              <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#7c3aed", letterSpacing: "0.1em" }}>◈ KATEGOORIAD</h3>
                {Object.entries(viewData.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, total]) => {
                    const prev = prevMonth?.byCategory[cat] || 0;
                    const trend = prev ? ((total - prev) / prev) * 100 : 0;
                    const max = Math.max(...Object.values(viewData.byCategory));
                    return (
                      <div key={cat} style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#a1a1aa" }}>{cat}</span>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <TrendArrow pct={trend} />
                            <span style={{ fontSize: "12px", fontWeight: 600 }}>{total.toFixed(2)}€</span>
                          </div>
                        </div>
                        <MiniBar value={total} max={max} color={total === max ? "bg-violet-500" : "bg-zinc-600"} />
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ── Top merchants ── */}
            {viewData && (
              <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#7c3aed", letterSpacing: "0.1em" }}>◈ TOP KAUPMEHED</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                      <th style={{ textAlign: "left", padding: "6px 0", color: "#52525b", fontWeight: 400, fontSize: "10px", letterSpacing: "0.1em" }}>#</th>
                      <th style={{ textAlign: "left", padding: "6px 0", color: "#52525b", fontWeight: 400, fontSize: "10px" }}>KAUPMEES</th>
                      <th style={{ textAlign: "right", padding: "6px 0", color: "#52525b", fontWeight: 400, fontSize: "10px" }}>SUMMA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewData.topMerchants.map(([merchant, total], i) => (
                      <tr key={merchant} className="row-hover" style={{ borderBottom: "1px solid #111" }}>
                        <td style={{ padding: "8px 4px", color: "#3f3f46", fontWeight: 700 }}>{i + 1}</td>
                        <td style={{ padding: "8px 4px", color: "#d4d4d8" }}>{merchant}</td>
                        <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600 }}>{total.toFixed(2)}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── RECURRING TAB ── */}
        {tab === "recurring" && (
          <div style={{ display: "grid", gap: "10px" }}>
            {recurring.length === 0 && (
              <div className="card" style={{ textAlign: "center", color: "#52525b", padding: "3rem" }}>
                Korduvaid makseid ei tuvastatud. Lae üles rohkem andmeid.
              </div>
            )}
            {recurring.map((r, i) => (
              <div key={i} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "#d4d4d8" }}>{r.merchant}</span>
                      <Badge color="purple">{r.period}</Badge>
                      {r.isNew && <Badge color="green">✦ UUS</Badge>}
                      {r.trend > 10 && <Badge color="red">▲ HINNATÕUS</Badge>}
                      {r.trend < -10 && <Badge color="green">▼ HINDADE LANGUS</Badge>}
                    </div>
                    <span style={{ fontSize: "11px", color: "#52525b" }}>{r.category}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "18px", fontWeight: 700 }}>{r.avgAmount.toFixed(2)}€</div>
                    <div style={{ fontSize: "11px" }}><TrendArrow pct={r.trend} /></div>
                  </div>
                </div>
                <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {r.last6.map((t, j) => (
                    <div key={j} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "6px", padding: "4px 8px", fontSize: "11px" }}>
                      <div style={{ color: "#52525b" }}>{fmtDate(t.date)}</div>
                      <div style={{ fontWeight: 600 }}>{Math.abs(t.amount).toFixed(2)}€</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {newMerchants.filter(m => !recurring.find(r => r.merchant === m.merchant)).length > 0 && (
              <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#34d399", letterSpacing: "0.1em" }}>✦ UUED KAUPMEHED (viimane 60 päeva)</h3>
                {newMerchants.filter(m => !recurring.find(r => r.merchant === m.merchant)).map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #111", fontSize: "12px" }}>
                    <span style={{ color: "#a1a1aa" }}>{m.merchant}</span>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ color: "#52525b" }}>alates {fmtDate(m.firstSeen)}</span>
                      <Badge color="blue">{m.count}× makse</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ANOMALIES TAB ── */}
        {tab === "anomalies" && (
          <div style={{ display: "grid", gap: "10px" }}>
            {anomalies.length > 0 && (
              <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#f59e0b", letterSpacing: "0.1em" }}>⚠ EBATAVALISED SUMMAD (Z-skoor {">"} 2)</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                      {["KUUPÄEV", "KAUPMEES", "KIRJELDUS", "SUMMA", "TAVAPÄRANE", "Z-SKOOR"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#52525b", fontWeight: 400, fontSize: "10px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {anomalies.map((a, i) => (
                      <tr key={i} className="row-hover" style={{ borderBottom: "1px solid #111" }}>
                        <td style={{ padding: "10px 8px", color: "#71717a" }}>{fmtDate(a.transaction.date)}</td>
                        <td style={{ padding: "10px 8px", fontWeight: 600 }}>{a.transaction.merchant_norm}</td>
                        <td style={{ padding: "10px 8px", color: "#71717a", fontSize: "11px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.transaction.description_raw}</td>
                        <td style={{ padding: "10px 8px", color: "#f87171", fontWeight: 700 }}>{Math.abs(a.transaction.amount).toFixed(2)}€</td>
                        <td style={{ padding: "10px 8px", color: "#52525b" }}>~{a.mean.toFixed(2)}€</td>
                        <td style={{ padding: "10px 8px" }}><Badge color="yellow">{a.zScore.toFixed(1)}σ</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {duplicates.length > 0 && (
              <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#f87171", letterSpacing: "0.1em" }}>⊗ KAHTLASED KORDUVMAKSED (30 päeva jooksul)</h3>
                {duplicates.map((d, i) => {
                  // Find all transactions for this merchant+amount combo
                  const key_amount = Math.abs(d.a.amount).toFixed(2);
                  const allOccurrences = filteredTransactions
                    .filter(t => t.merchant_norm === d.a.merchant_norm && Math.abs(t.amount).toFixed(2) === key_amount)
                    .sort((a, b) => a.date.localeCompare(b.date));
                  return (
                    <div key={i} style={{ padding: "12px", background: "#0a0a0a", borderRadius: "8px", marginBottom: "8px", border: "1px solid #2d1b1b" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                          <span style={{ fontWeight: 700, color: "#f87171", fontSize: "13px" }}>{d.a.merchant_norm}</span>
                          <span style={{ color: "#52525b", fontSize: "11px", marginLeft: "8px" }}>
                            {allOccurrences.length}× makse {key_amount}€ — {d.dayDiff} päeva vahega
                          </span>
                        </div>
                        <Badge color="red">KAHTLANE</Badge>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {allOccurrences.map((t, j) => (
                          <div key={j} style={{ background: "#111", border: "1px solid #2d1b1b", borderRadius: "6px", padding: "5px 10px", fontSize: "11px" }}>
                            <div style={{ color: "#52525b" }}>{fmtDate(t.date)}</div>
                            <div style={{ fontWeight: 600, color: "#f87171" }}>{Math.abs(t.amount).toFixed(2)}€</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {anomalies.length === 0 && duplicates.length === 0 && (
              <div className="card" style={{ textAlign: "center", color: "#52525b", padding: "3rem" }}>
                ✓ Anomaaliaid ega duplikaate ei leitud
              </div>
            )}
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "transactions" && (
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", background: "#0a0a0a" }}>
                    {["KUUPÄEV", "KAUPMEES", "KIRJELDUS", "SUMMA", "KATEGOORIA"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px", color: "#52525b", fontWeight: 400, fontSize: "10px", letterSpacing: "0.1em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.slice(0, 200).map((t, i) => (
                    <tr key={i} className="row-hover" style={{ borderBottom: "1px solid #111" }}>
                      <td style={{ padding: "10px 12px", color: "#71717a", whiteSpace: "nowrap" }}>{fmtDate(t.date)}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#d4d4d8" }}>{t.merchant_norm}</td>
                      <td style={{ padding: "10px 12px", color: "#52525b", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description_raw}</td>
                      <td style={{ padding: "10px 12px", color: t.amount < 0 ? "#f87171" : "#34d399", fontWeight: 600, whiteSpace: "nowrap" }}>{t.amount.toFixed(2)}€</td>
                      <td style={{ padding: "10px 12px" }}><Badge color="gray">{t.category}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length > 200 && (
                <div style={{ padding: "12px", textAlign: "center", color: "#52525b", fontSize: "11px" }}>
                  Näidatakse 200 / {filteredTransactions.length} tehingut
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div className="card">
              <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#7c3aed", letterSpacing: "0.1em" }}>◈ KAUPMEHE ALIAS REEGLID</h3>
              <p style={{ fontSize: "12px", color: "#52525b", marginBottom: "1rem" }}>
                Lisa reegel: kui kirjeldus sisaldab X, kasuta kaupmeehena Y
              </p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
                <input
                  placeholder="Kirjelduses sisaldub (nt BOLT)"
                  value={aliasInput.raw}
                  onChange={e => setAliasInput({ ...aliasInput, raw: e.target.value })}
                  style={{ flex: 1, minWidth: "160px" }}
                />
                <span style={{ color: "#52525b", lineHeight: "32px" }}>→</span>
                <input
                  placeholder="Kaupmees (nt BOLT)"
                  value={aliasInput.norm}
                  onChange={e => setAliasInput({ ...aliasInput, norm: e.target.value })}
                  style={{ flex: 1, minWidth: "160px" }}
                />
                <button className="btn btn-primary" onClick={() => {
                  if (aliasInput.raw && aliasInput.norm) {
                    setUserAliases({ ...userAliases, [aliasInput.raw]: aliasInput.norm });
                    setAliasInput({ raw: "", norm: "" });
                  }
                }}>Lisa</button>
              </div>
              {Object.entries(userAliases).map(([raw, norm]) => (
                <div key={raw} style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#0a0a0a", borderRadius: "6px", marginBottom: "4px", fontSize: "12px" }}>
                  <span><span style={{ color: "#71717a" }}>"{raw}"</span> → <span style={{ color: "#a78bfa", fontWeight: 600 }}>{norm}</span></span>
                  <button className="btn btn-danger" style={{ padding: "2px 8px", fontSize: "10px" }}
                    onClick={() => { const a = { ...userAliases }; delete a[raw]; setUserAliases(a); }}>×</button>
                </div>
              ))}
              {Object.keys(userAliases).length === 0 && (
                <p style={{ fontSize: "11px", color: "#3f3f46" }}>Kasutaja reeglid puuduvad. Vaikimisi reeglid on aktiivsed.</p>
              )}
            </div>

            <div className="card">
              <h3 style={{ margin: "0 0 1rem", fontSize: "11px", color: "#7c3aed", letterSpacing: "0.1em" }}>◈ VAIKIMISI REEGLID</h3>
              {Object.entries(MERCHANT_ALIASES).map(([norm, aliases]) => (
                <div key={norm} style={{ padding: "6px 0", borderBottom: "1px solid #111", fontSize: "11px" }}>
                  <span style={{ color: "#a78bfa", fontWeight: 600, marginRight: "8px" }}>{norm}</span>
                  <span style={{ color: "#3f3f46" }}>{aliases.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {transactions.length === 0 && tab !== "upload" && (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#52525b" }}>
            Andmed puuduvad. <button className="btn btn-primary" style={{ marginLeft: "8px" }} onClick={() => setTab("upload")}>Mine importi</button>
          </div>
        )}
      </div>
    </div>
  );
}
