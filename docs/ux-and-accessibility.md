# UX research principles and accessibility quality gates

## Evidence classification

This document distinguishes **normative standards**, **strong usability recommendations**, **contextual heuristics**, and **unverified product hypotheses**. Never describe Hick's, Fitts's, Jakob's, Gestalt principles, a three-click rule or Miller's 7±2 as universally predictive laws for sales conversion. Validate decisions with actual task success, errors, accessibility testing and representative users. Cite reliable sources in `research-and-decisions.md`.

## Five experience contexts

| Audience | Primary job | UX friction to remove | Success measure |
| --- | --- | --- | --- |
| Owner / manager | Decide whether Zackisch fits, set up without staff assistance | Fear of POS replacement, hidden costs, lack of compatible hardware, lost progress | Correctly identifies obligations, completes verified setup independently |
| Service/kitchen staff | Receive and fulfill live orders rapidly | Dense cards, small controls, ambiguous status, stale connection | Correctly picks order/table and updates status with low error rate |
| Guest | Order/pay on a smartphone without an account | Unclear options/fees, scan failures, register wall, false payment confirmation | Places intended paid order once, understands amount and table |
| Self-service help reader | Solve a real blocker independently | Vague article titles, stale screenshots, cross-locale dead links | Finds relevant article and completes task |
| Internal support/operator | Resolve tickets and manage region safely | Permission ambiguity, public/internal reply confusion, loss of context | Correct customer-facing action without data leakage |

## Recognized principles applied correctly

### Recognition over recall (NN/g, Nielsen heuristic)

Show current venue, step status, selected item options, total, assigned ticket, and action labels directly. Provide context when switching between setup steps or dashboard pages. Avoid making owners remember where they previously configured Stripe, QR tables or the tablet. Use consistent terminology (`Betrieb`, `Bestellung`, `Tablet`, `QR-Code`, `Kasse`) across website, app and help.

### Progressive disclosure

Start with the decision/task, expand advanced fields when needed, but **never hide legally material price/payment information or required setup prerequisites**. Split setup into comprehensible stages; provide clear prerequisites and alternate routes. Do not remove options based on mythical fixed magic-number limits. Source: https://www.nngroup.com/articles/progressive-disclosure/ .

### Fitts's law / target size

Give primary staff and guest interactions generous touch targets and spacing. WCAG 2.2 AA SC 2.5.8 generally requires 24×24 CSS px or valid alternatives/exceptions; Zackisch aims >=44–48px for primary touch actions. Measure actual interactive hit area, not icon artwork. A large button with ambiguous text is still a bad button. Source: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html .

### Hick–Hyman / choice architecture

Order choices by merchant mental model and frequency. Use category headings and useful filters; do not truncate menu options or blindly force three-step paths. Ticket categorization should prioritize recognizable customer language, not internal team taxonomy.

### Jakob's law / familiarity

Use familiar e-commerce cart, payment review, search, sign-in, and form patterns. A restaurant owner should recognize the logic from existing POS and delivery-platform tablets without falsely suggesting a direct integration. Do not copy a competitor's proprietary appearance.

### Gestalt grouping and information hierarchy

Group labels with fields, totals with payment CTA, status with order/ticket and resolution with corresponding action. DOM order and accessibility semantics must reflect visual grouping. Use whitespace for comprehension rather than massive empty hero sections.

### Error prevention and recoverability

Do not allow checkout at stale prices, ambiguous guest charge, invalid region or wrong organization. Preserve user input on recoverable form errors. Show error near field and a route to fix it; prevent duplicate form submission, note visibility mistakes and destructive operations. Prefer reversible actions/confirmation where impact is high. Source: https://www.nngroup.com/articles/error-prevention/ .

### Aesthetic-usability and trust

Warm photography, real screenshots, consistent design and predictable language improve perceived approachability, but appearance cannot replace observed success. Avoid invented positive social proof, meaningless ratings or unverified “up 30%” claims. Source: https://www.nngroup.com/articles/aesthetic-usability-effect/ .

## WCAG 2.2 AA engineering checklist

| Dimension | Minimum measurable requirement | Zackisch additional comfort target |
| --- | --- | --- |
| Normal text | Contrast generally >=4.5:1; large text >=3:1 | Test actual marketing image overlay & tokens |
| Nontext graphics/UI | Essential boundaries/status generally >=3:1 | Visible input borders and chosen state |
| Targets | WCAG 2.5.8 generally >=24 CSS px or allowed spacing/exemptions | Primary touch targets 44–48px |
| Keyboard | Full access, visible focus, correct order, Escape, no traps | Staff shortcuts documented and nonexclusive |
| Focus | Not obscured (SC 2.4.11), perceivable | Focus ring plus scroll margin for sticky bars |
| Reflow | Responsive at equivalent narrow viewport and zoom | Check 320px, 200% and 400% use cases |
| Forms | Visible labels, required/optional text, associated errors | Autofill, paste, `inputmode`, error summary |
| Authentication | Accessible authentication (SC 3.3.8) | Password manager/OTP paste allowed |
| Status | Semantic success/warning/error not color-only | `aria-live` appropriate, no alert spam |
| Media | Alt text, captions where applicable, no text only embedded in images | Real annotated screen captures plus transcript |
| Motion | Pause/limit relevant animation, honor reduced motion | Avoid automatic complex hero animation |
| Operability | Pointer cancellation, dragging alternative, consistent help | Touch, mouse, keyboard and assistive technologies |

Run axe and deterministic component checks but also **manual** keyboard and screen-reader scenarios. An automated zero-violation report is not WCAG conformance evidence by itself. W3C reference: https://www.w3.org/WAI/WCAG22/quickref/ .

## Flow-specific acceptance tasks

**Owner setup**

1. From homepage correctly state what Zackisch replaces (nothing), when charges arise, and whether new hardware is required.
2. Prerequisite check shows suitable tablet/browser, adequate internet, existing POS responsibility, printed code and Stripe prerequisites; unknowns are not silently green.
3. Register and return after interruption; progress remains. Each blocked step displays a remedy and contextual help.
4. Pair tablet securely, verify connection and order receipt; revoke/reconnect after session expiry.
5. Print correct table and pickup QR codes, scan independently, do a safe test order, understand manual booking in existing POS.

**Guest mobile**

1. Scan and visibly identify venue and table without needing to type unknown IDs; fallback printed URL usable.
2. Navigate menu and choose modifications, see any surcharge and clear total, correct mistakes without losing state.
3. Checkout with no Zackisch account; explicit final payable action, no preselected optional cost, provider payment state trustworthy.
4. Handle canceled payment, network error and repeated taps without accidental charge/order duplication.
5. Retrieve permitted proof/receipt and order tracker without leaking internal merchant data.

**Staff tablet**

1. At working distance and in realistic lighting, identify new order, table, selected items and timestamp.
2. Move status using large controls, identify unavailable items, recover after reconnection with distinct last-updated signal.
3. Test older tablets/landscape, touch-only use, long order text and heavy queue at peak times.

**Help and Team Dashboard**

1. Find a precise article after one or two relevant searches (an internal findability target, not a scientific law).
2. Follow screenshots with keyboard and screen-reader text; article reflects actual UI version and locale.
3. Customer can create ticket for their own org and see customer-visible reply only.
4. Internal agent with limited permissions cannot view other region, cannot leak notes, can clearly tell public reply from internal note.

## Study and measurement protocol

Define tasks and severity before observing people. Recruit diverse owner profiles (café, quick-service, restaurant, bar, seasonal) and staff/guests with varied ages, languages, digital skills and accessibility needs. Two small formative rounds are a pragmatic target, **not representative research**. Use informed consent, data minimization and anonymized notes. Measure task completion without moderator help, wrong-path events, time on task, errors, help lookup, comprehension of pricing/POS model and severity of accessibility failures. Do not invent participants or findings. A11y testing must include real keyboard and assistive technology where feasible.

## Performance and device quality

Measure p75 field Core Web Vitals where traffic permits: LCP <=2.5s, INP <=200ms, CLS <=0.1. Lab measurements are not substitutes for field data. Source: https://web.dev/articles/vitals/ . Test width 320, 360, 390, 768, 1024, 1440 CSS px, tablet orientations, high zoom and increased text size; connection slow/absent; iOS Safari, Chromium Android and desktop browsers in a published support matrix. Never turn a latency target into unsupported uptime marketing.

## UX decision questions to ask during review

Does the next step reveal itself without training? Can a distracted worker recover from an error? Does the guest understand money and status? Does an owner know whether their existing POS changes? Are controls reachable on a cheap tablet? Is the staff-only note unmistakable? Could an elder customer use this with browser zoom or VoiceOver? Does support explain it in the same words as the app? If not, prioritize an observable correction, not decorative polish.
