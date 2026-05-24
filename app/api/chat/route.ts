export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an AI sales assistant for Michael Lamidis, a premium open-box appliance store based in Cyprus (Limassol).

BUSINESS OVERVIEW:
- We sell open-box (ex-display, certified refurbished) home appliances at 20–50% below retail price
- Every item is professionally inspected, tested, and cleaned before sale
- We carry major brands: Samsung, LG, Bosch, Siemens, Miele, Whirlpool, Candy, Indesit and more
- Product categories: refrigerators, washing machines, dryers, dishwashers, TVs, air conditioners, ovens, cookers, and small appliances

TYPICAL PRICE RANGES (approximate):
- Refrigerators / Fridge-freezers: €350 – €1,600
- Washing machines: €220 – €750
- Dishwashers: €200 – €600
- Dryers: €250 – €700
- TVs (40"–75"): €180 – €1,100
- Air conditioners (split units): €300 – €900
- Ovens / Cookers: €180 – €500

SERVICES:
- Free showroom viewing — customers can inspect before buying
- Delivery available across Cyprus
- Installation service available for ACs and washing machines
- Warranty provided on all products (varies by item)
- After-sales support

PAYMENT:
- Cash
- Credit / debit card (Visa, Mastercard)
- Bank transfer
- Instalment options available on request

LOCATION & CONTACT:
- Based in Limassol, Cyprus
- Customers can contact us via the website's Contact page
- WhatsApp/phone enquiries welcomed

YOUR PERSONALITY & RULES:
- Be warm, helpful, enthusiastic and concise (max 3–4 sentences per reply unless more detail is genuinely needed)
- Detect the customer's language (Greek or English) and reply in the SAME language
- Focus on converting interest into a showroom visit, phone call, or online enquiry
- If asked about exact stock or availability, say you can check the latest inventory and encourage them to visit the Products page or contact us directly
- Never invent specific model numbers or guarantee exact stock
- Always close with a helpful next step (e.g. "Browse our products at /products" or "Contact us for a personalised quote!")
- If a customer shows buying intent, gently ask if they'd like to leave their name and number so we can follow up with the best deal`;

// Rule-based fallback for when OpenAI key is absent or fails
function fallback(msg: string): string {
  const t = msg.toLowerCase();

  if (/pric|cost|how much|τιμ|πόσο/.test(t))
    return "Our open-box appliances are priced 20–50% below retail! 🏷️ Fridges from €350, washing machines from €220, TVs from €180. Prices vary by brand and condition — browse the full range on our Products page or contact us for a personalised quote!";

  if (/deliver|ship|παράδοση|παραδοση/.test(t))
    return "Yes, we deliver across all of Cyprus! 🚚 Delivery is arranged at the time of purchase. Contact us to confirm availability to your area and get a delivery quote.";

  if (/warrant|guarantee|εγγύηση|εγγυηση/.test(t))
    return "Every appliance we sell comes with warranty coverage ✅ — all items are professionally inspected and tested before sale. Warranty length varies by product; ask us for specifics on the model you're interested in!";

  if (/install|εγκατάσταση|εγκατασταση/.test(t))
    return "Yes! We offer professional installation for air conditioners and washing machines 🔧. Our team makes sure everything is set up perfectly. Ask about installation when you make your purchase.";

  if (/pay|cash|card|transfer|πληρωμ/.test(t))
    return "We accept cash, credit/debit card (Visa & Mastercard), and bank transfers 💳. Instalment options are also available on request — just ask!";

  if (/contact|phone|call|επικοινωνία|τηλέφωνο/.test(t))
    return "You can reach us through the Contact page on our website, or leave your name and number here and we'll call you back! 📞 We're always happy to help.";

  if (/product|appliance|stock|available|προϊόν|συσκευ/.test(t))
    return "We have a wide range of open-box appliances including fridges, washing machines, dishwashers, TVs, ACs and more! 🏠 All from top brands like Samsung, LG, Bosch and Siemens. Head to our Products page to browse the latest stock!";

  if (/book|appointment|visit|ραντεβού/.test(t))
    return "We'd love to welcome you to our showroom! 📅 Visit our Contact page to get in touch and arrange a convenient time. You can see and test appliances in person before buying.";

  if (/open.?box|refurb|used|μεταχειρισ/.test(t))
    return "Open-box appliances are items that have been returned, used as display models, or have minor cosmetic imperfections — but are fully functional and tested ✅. You get near-new quality at 20–50% off the retail price!";

  return "I'm here to help you find the perfect appliance! 😊 Ask me about products, pricing, delivery, warranty, or anything else. You can also browse our catalog at /products or use the Contact page to speak with our team directly.";
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ── OpenAI path ──
    if (process.env.OPENAI_API_KEY) {
      try {
        const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...(Array.isArray(history) ? history.slice(-10) : []),
              { role: "user", content: message },
            ],
            max_tokens: 280,
            temperature: 0.72,
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (oaRes.ok) {
          const data = await oaRes.json();
          const reply: string = data.choices?.[0]?.message?.content ?? fallback(message);
          return NextResponse.json({ reply });
        }
      } catch (err) {
        console.error("[chat/route] OpenAI error:", err);
      }
    }

    // ── Fallback: rule-based ──
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    return NextResponse.json({ reply: fallback(message) });
  } catch (err) {
    console.error("[chat/route] Unexpected error:", err);
    return NextResponse.json(
      { reply: "Sorry, I'm having a technical issue right now. Please try again or contact us directly!" },
      { status: 200 }
    );
  }
}
