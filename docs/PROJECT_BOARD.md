# Nebula H.Y.L.ING — Project Board

## Project Info
- **Client:** Nebula (H.Y.L.ING — Health, Youth, Longevity)
- **DBA:** Zero Labs (B2B wholesale supplier)
- **Setup Budget:** $5,500 (agreed 2026-07-22; $1,000 deposit received)
- **Type:** Custom e-commerce website + AI customer service agent
- **Reference:** OWLchemi.com (WordPress + WooCommerce)
- **Started:** 2026-07-22

---

## FULL PRODUCT CATALOG (16 SKUs)

### Recovery Stacks
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 1 | **GLOW Stack** (BPC-157 + TB-500 + GHK-CU) | 70MG | $129.99 | Recovery Stack |
| 2 | **KLOW Stack** (BPC-157 + TB-500 + GHK-CU + KPV) | 80MG | $149.99 | Recovery + Gut Stack |

### Metabolic / GLP-1
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 3 | **Retatrutide** | 20MG | $139.99 | GLP-1/GIP/Glucagon Triple Agonist |
| 4 | **Tirzepatide** | 20MG | $139.99 | GLP-1/GIP Dual Agonist |

### Tissue Repair / Recovery
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 5 | **BPC-157** | 10MG | $64.99 | Tissue Repair & Gut Health |
| 6 | **TB-500** | 10MG | $84.99 | Recovery & Flexibility |

### Growth Hormone
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 7 | **Ipamorelin** | 10MG | $59.99 | GH Secretagogue |
| 8 | **CJC-1295 No DAC + Ipamorelin** | 5MG+5MG | $54.99 | GH Stack (Most Popular) |
| 9 | **Sermorelin** | 10MG | $89.99 | GHRH |
| 10 | **Tesamorelin** | 10MG | $139.99 | GHRH / Body Composition |

### Longevity
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 11 | **Epitalon** | 50MG | $119.99 | Telomere / Longevity |
| 12 | **MOTS-C** | 40MG | $129.99 | Mitochondrial Longevity |

### Wellness
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 13 | **Glutathione** | 1500MG | $54.99 | Master Antioxidant |
| 14 | **NAD+** | 1000MG | $99.99 | Cellular Energy & Longevity |
| 15 | **Vitamin B12** | 10ML | $49.99 | Energy & Neurological |

### Essentials
| # | Product | Spec | Retail | Category |
|---|---------|------|--------|----------|
| 16 | **Bacteriostatic Water** | 10ML (x4) | $14.99 | Reconstitution Solvent |

**Total catalog value at retail:** $1,724.84

---

## PRICING TIERS (from brand guide)
- **Annual Membership:** $1,000/yr → 25% off all orders + free shipping
- **3 peptides/mo annual:** $3,200/yr → 30% off extras + BAC + free shipping
- **5 peptides/mo annual:** $5,200/yr → 30% off extras + BAC + free shipping

---

## COMPLIANCE NOTES
- ALL products are "for research use only — not for human consumption"
- No medical claims on any product page
- COAs available at janoshik.com/public (batch number verification)
- Janoshik Lab: purity, heavy metals, endotoxins, sterility verified every batch

---

## PRODUCT PAGE CATEGORIES (for site)
1. Recovery Stacks (GLOW, KLOW)
2. Metabolic Research (Retatrutide, Tirzepatide)
3. Tissue Repair (BPC-157, TB-500)
4. Growth Hormone (Ipamorelin, CJC-1295+Ipa, Sermorelin, Tesamorelin)
5. Longevity (Epitalon, MOTS-C)
6. Wellness (Glutathione, NAD+, Vitamin B12)

---

## SCOPE OF WORK

### Phase 1: Client Preview (NOW)
- [x] Brand guidelines parsed, product catalog extracted
- [x] Full 16-SKU product catalog with real pricing
- [x] Next.js 14 App Router + Tailwind dark theme
- [x] Age verification gate (21+)
- [x] Product catalog with categories (Stacks, Individual Peptides, Accessories)
- [x] Responsive navigation with live cart count
- [ ] Share live preview link with client

### Phase 2: Full Build
- [x] Custom theme matching OWLchemi premium aesthetic
- [x] Age verification gate (21+)
- [x] Cart system (localStorage, add/remove/update)
- [x] Checkout flow (customer info → order creation)
- [ ] Stripe payment integration (needs API key from client)
- [ ] Subscription tiers (Annual, 3/mo, 5/mo membership pricing)
- [x] Customer accounts (register, login, order history)
- [x] COA verification page (batch number lookup)
- [x] Admin dashboard (orders, inventory management)
- [x] Responsive design
- [ ] SEO optimization
- [ ] Analytics (PostHog or Plausible)

### Phase 3: AI Customer Service Agent
- [ ] Agent architecture decision (VPS-hosted vs. paid subscription)
- [ ] Product knowledge base (all 16 SKUs + reconstitution guides)
- [ ] Hard stops / guardrails (see AI Agent section below)
- [ ] Chatbot widget on site
- [ ] Subscription model for API/LLM costs

### Phase 4: Handoff & Maintenance
- [ ] Monthly maintenance plan
- [ ] Bot uptime monitoring
- [ ] Product catalog updates
- [ ] Ongoing support retainer

---

## AI AGENT — ARCHITECTURE NOTES

### Purpose
Customer-facing chatbot that helps site visitors:
- Understand which peptide suits their research goals
- Reconstitution guidance (safety, proper technique)
- Product recommendations based on research needs
- Order support / FAQ
- COA verification help

### Hard Stops / Guardrails (CRITICAL — protects Vance's role)
- Agent NEVER provides medical advice or dosing recommendations
- Agent CANNOT process orders, access payment systems, or modify pricing
- Agent CANNOT access backend systems, databases, or admin panels
- Agent CANNOT generate code, build features, or modify the website
- Agent responses are read-only and informational
- Agent always disclaims: "For research purposes only — not for human consumption"
- Agent cannot be exported, cloned, or replicated by the client
- All agent logic lives on a server Vance controls — client gets the chatbot widget, not the source
- Agent logs all conversations (Vance reviews for quality/escalation)

### Hosting Options
| Option | Cost | Pros | Cons |
|--------|------|------|------|
| **DO VPS (existing)** | ~$12-24/mo | Already have account, full control | Uses existing DO infrastructure |
| **Azure Free Tier** | $0 (GitHub Student) | Free credits, enterprise features | Setup complexity |
| **OpenAI API + widget** | $20-50/mo API | Easy deploy, good quality | Vendor lock-in, ongoing API cost |
| **Local Ollama + VPS** | $12-24/mo | No API cost, full control | Needs decent VPS specs |

### Subscription Model for Client
- Agent uptime + API costs baked into monthly retainer
- Vance takes a cut for management and oversight
- Client pays one flat monthly fee — no surprise API bills

---

## MONTHLY MAINTENANCE + BOT PRICING

### Proposed Monthly Retainer Tiers

**Option A: Basic ($250/mo)**
- WordPress hosting + SSL
- WooCommerce maintenance + updates
- Uptime monitoring
- Product catalog updates (up to 5/mo)
- Monthly security scan
- No AI bot

**Option B: Standard ($400/mo)**
- Everything in Basic
- AI customer service bot (powered by LLM API)
- Bot monitoring + quality review
- Conversation analytics dashboard
- Bot knowledge base updates (up to 10/mo)
- Email support (48hr response)

**Option C: Premium ($600/mo)**
- Everything in Standard
- Priority support (24hr response)
- A/B testing on product pages
- Monthly performance report
- Unlimited catalog updates
- Bot fine-tuning + expansion

### Cost Breakdown (Vance's perspective)
| Item | Est. Cost | Notes |
|------|-----------|-------|
| WordPress hosting | $15-30/mo | DigitalOcean or managed WP |
| Domain + email | $15/mo | Annual domain + workspace |
| LLM API (GPT-4 class) | $30-80/mo | Based on conversation volume |
| VPS for bot | $12-24/mo | DO droplet |
| SSL | $0 | Let's Encrypt |
| Monitoring | $0-10/mo | UptimeRobot free tier |
| **Total overhead** | **$72-159/mo** | |
| **Margin at Standard** | **$241-328/mo** | Client pays $400, Vance keeps difference |

---

## NOTES
- Zero Labs is the wholesale supplier (B2B), Nebula is the consumer brand (B2C)
- Reference site OWLchemi uses: WordPress, WooCommerce, custom theme, Affiliate WP, Authorize.net, PostHog
- Nebula brand is more premium/polished than OWLchemi — clean clinical aesthetic
- Awaiting client product labels for final imagery
- Client agreed to $5.5k setup (increased from initial $5k)
- 16 SKUs total (not 13 as initially stated — brand guide shows full catalog)
- Vance has DigitalOcean account + GitHub Student (Azure credits available)
- Fonts: NCL Gasdrifo (primary), available for web use
