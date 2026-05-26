// ============================================================
// knowledge-base.ts
// Curated knowledge chunks for the Network Navigator RAG system.
// Each chunk has: id, category, tags, text (the retrievable content),
// and an embedding placeholder (filled at startup by rag-engine.ts).
// ============================================================

export interface KnowledgeChunk {
  id: string;
  category: "resume" | "circumstances" | "roadmap" | "networking" | "coaching";
  tags: string[];
  text: string;
  embedding?: number[]; // filled at runtime
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ─────────────────────────────────────────────
  // RESUME — Structure & Formatting
  // ─────────────────────────────────────────────
  {
    id: "res-format-001",
    category: "resume",
    tags: ["format", "length", "layout"],
    text: `Resume length and layout: Keep your resume to one page if you have fewer than 10 years of experience. Use consistent margins (0.5–1 inch), a clean sans-serif font (10–12pt), and clear section headers. Avoid tables, columns, or text boxes that break ATS parsing. Use reverse-chronological order for every section.`,
  },
  {
    id: "res-format-002",
    category: "resume",
    tags: ["ats", "keywords", "parsing"],
    text: `ATS optimization: Most companies run resumes through an Applicant Tracking System (ATS) before a human reads them. To pass ATS screening: mirror exact keywords from the job description, avoid headers/footers, use standard section names (Experience, Education, Skills), and save as a plain PDF rather than a designed template. Columns and graphics cause ATS misreads.`,
  },
  {
    id: "res-bullets-001",
    category: "resume",
    tags: ["bullets", "impact", "verbs", "quantify"],
    text: `Writing strong bullet points: Lead every bullet with a strong action verb (Led, Built, Increased, Reduced, Designed, Managed). Follow the formula: Action + Task + Result. Quantify results wherever possible — percentages, dollar amounts, time saved, team size. Weak: "Helped with marketing." Strong: "Launched 3 social campaigns that grew Instagram followers by 40% in 2 months."`,
  },
  {
    id: "res-bullets-002",
    category: "resume",
    tags: ["bullets", "action verbs", "examples"],
    text: `Strong action verbs by category: Leadership — Spearheaded, Directed, Orchestrated, Championed. Analysis — Analyzed, Evaluated, Modeled, Synthesized. Communication — Presented, Authored, Negotiated, Facilitated. Technical — Engineered, Developed, Automated, Deployed. Growth — Grew, Increased, Expanded, Scaled. Avoid: "Helped with", "Responsible for", "Worked on" — these are weak and non-specific.`,
  },
  {
    id: "res-experience-001",
    category: "resume",
    tags: ["experience", "internship", "work history"],
    text: `Experience section best practices: Include company name, your title, location, and dates (month/year). Use 3–5 bullets per role. Focus on impact and scope rather than job duties — employers know what a marketing intern does; show what YOU accomplished. For part-time or campus jobs, still quantify: number of customers served, revenue handled, or team size.`,
  },
  {
    id: "res-education-001",
    category: "resume",
    tags: ["education", "gpa", "coursework"],
    text: `Education section: Include university name, degree, major, and expected/actual graduation date. Include GPA if it is 3.5 or above. List relevant coursework if you are a student with limited work experience — choose 4–6 courses that directly relate to the target job. Honors, Dean's List, and scholarships belong here.`,
  },
  {
    id: "res-skills-001",
    category: "resume",
    tags: ["skills", "technical", "software"],
    text: `Skills section: List hard/technical skills, not soft skills — employers assume you are a "team player." Group by type: Languages (Python, SQL, R), Tools (Excel, Tableau, Salesforce), Certifications (CFA Level 1, Google Analytics). Only list skills you can speak to in an interview. Remove "Microsoft Word" and "Google Docs" — these are not differentiating.`,
  },
  {
    id: "res-summary-001",
    category: "resume",
    tags: ["summary", "objective", "header"],
    text: `Summary / objective statement: A 2–3 line summary at the top can help when applying to a specific role. It should mention your target role, 1–2 strongest qualifications, and your timeline. Example: "Finance junior at UVA with IB internship experience and CFA Level 1 in progress, seeking full-time investment banking analyst roles for 2025." Avoid generic phrases like "hard-working, detail-oriented professional."`,
  },
  {
    id: "res-activities-001",
    category: "resume",
    tags: ["activities", "leadership", "clubs", "extracurricular"],
    text: `Activities and leadership section: For students, this section is often more impactful than a short work history. Include clubs, sports, case competitions, research, and volunteer work. Use the same action verb + result format as experience bullets. Holding leadership roles (President, VP, Treasurer) signals initiative. Competition wins (placed in top 3, won regional finals) should always be mentioned.`,
  },
  {
    id: "res-visual-001",
    category: "resume",
    tags: ["visual", "whitespace", "design", "readability"],
    text: `Visual readability: A recruiter spends 6–10 seconds scanning a resume before deciding to read deeper. Maximize scannability: use bold for company names and job titles, leave breathing room between sections, align dates to the right margin, and keep bullet text concise (one to two lines each). Walls of text, inconsistent spacing, or tiny fonts signal poor attention to detail.`,
  },
  {
    id: "res-visual-002",
    category: "resume",
    tags: ["visual", "font", "color", "template"],
    text: `Font and color guidance: Use one font family throughout (e.g., Calibri, Garamond, or Arial). Limit yourself to two font sizes (e.g., 11pt body, 14pt name). One accent color (dark blue or black) is acceptable for section headers, but avoid red, orange, or multiple colors — these read as unprofessional in finance, consulting, and most corporate tracks. Creative roles (design, marketing, media) have more latitude.`,
  },
  {
    id: "res-gaps-001",
    category: "resume",
    tags: ["gaps", "employment gap", "semester off"],
    text: `Handling experience gaps: If you have a gap (medical leave, personal circumstances, taking time off), you do not need to explain it on the resume. Use years only for date ranges if needed (e.g., 2022–2024). Gaps become an interview topic, not a resume red flag, when framed with what you learned or did during that time.`,
  },
  {
    id: "res-international-001",
    category: "resume",
    tags: ["international", "visa", "work authorization"],
    text: `International student resume notes: Do not include your visa status on your resume. Including "requires H-1B sponsorship" can disqualify you before the conversation starts — you address sponsorship needs during the offer stage. Do include language proficiency if it adds value (e.g., Native Mandarin, Business-Level Spanish). Focus your resume on your skills, experience, and impact.`,
  },
  {
    id: "res-tailoring-001",
    category: "resume",
    tags: ["tailoring", "customization", "job description"],
    text: `Tailoring your resume: Sending one generic resume to every company is a common mistake. For each application, spend 10–15 minutes: (1) pull 5–8 keywords from the job description, (2) make sure those words appear in your bullets, (3) reorder bullets so the most relevant experience appears first. A tailored resume consistently outperforms a polished generic one.`,
  },
  {
    id: "res-feedback-scoring-001",
    category: "resume",
    tags: ["scoring", "evaluation", "feedback criteria"],
    text: `Resume evaluation criteria: A strong resume scores well across: (1) Clarity — easy to scan in 10 seconds, (2) Relevance — experience matches target role, (3) Quantification — results are measured not just described, (4) Action verbs — strong verbs lead every bullet, (5) ATS compatibility — no tables, graphics, or columns, (6) Proofreading — zero spelling or grammar errors, (7) Length — one page for under 10 years experience.`,
  },

  // ─────────────────────────────────────────────
  // CIRCUMSTANCES — Change Detection & Response
  // ─────────────────────────────────────────────
  {
    id: "circ-interview-001",
    category: "circumstances",
    tags: ["interview", "interview invite", "prep", "next steps"],
    text: `When you receive an interview invite: This is a major milestone — congratulations. Immediately research the company deeply (mission, recent news, products, competitors). Prepare for behavioral questions using the STAR method (Situation, Task, Action, Result). Research your interviewers on LinkedIn. Prepare 3–5 thoughtful questions to ask. Confirm the format (phone, video, on-site, case) and practice accordingly. Update your roadmap to reflect interview prep as your top priority.`,
  },
  {
    id: "circ-rejection-001",
    category: "circumstances",
    tags: ["rejection", "rejected", "didn't get the job", "bounce back"],
    text: `Handling a rejection: Rejection is not a reflection of your worth — it reflects fit, timing, and factors outside your control. The right response is: (1) Send a gracious thank-you noting you'd welcome future opportunities, (2) Immediately add 3 new companies to your list, (3) Debrief honestly — what could you improve? (4) Use the rejection to refine your pitch. Most successful professionals received dozens of rejections before their breakthrough role.`,
  },
  {
    id: "circ-offer-001",
    category: "circumstances",
    tags: ["offer", "job offer", "negotiation", "accept"],
    text: `Receiving a job offer: First, say "thank you — I'm very excited and will review carefully." Never accept on the spot unless you are 100% certain. Request 3–5 business days to consider. Evaluate: base salary vs. market, bonus structure, benefits, location, growth opportunities, culture fit. Research salary on Levels.fyi, LinkedIn Salary, or Glassdoor. It is always appropriate to negotiate — politely ask "Is there flexibility on the base given my [specific experience]?"`,
  },
  {
    id: "circ-visa-001",
    category: "circumstances",
    tags: ["visa", "h1b", "opt", "cpt", "sponsorship", "international"],
    text: `Visa and work authorization circumstances: If your status has changed (OPT authorized, H-1B selected, CPT approved), update your job search strategy accordingly. Companies with strong sponsorship track records include major tech firms (Google, Amazon, Microsoft, Meta), large consulting firms (McKinsey, BCG, Deloitte), and investment banks (Goldman, JP Morgan). For OPT students, flag your STEM OPT extension eligibility early — it extends your work window to 3 years. Avoid applying to federal government roles that require citizenship.`,
  },
  {
    id: "circ-referral-001",
    category: "circumstances",
    tags: ["referral", "referred", "connection", "warm intro"],
    text: `Using a referral effectively: A referral dramatically increases your chances of an interview (10–15x in some studies). To maximize it: (1) Ask the referrer to submit through the official employee portal, not just forward your resume, (2) Customize your resume and cover letter for that specific role, (3) Brief your referrer on your key strengths so they can advocate accurately, (4) Send a thank-you after they refer you, and keep them updated on your progress.`,
  },
  {
    id: "circ-no-response-001",
    category: "circumstances",
    tags: ["ghosted", "no response", "follow up", "silence"],
    text: `When you are not getting responses: Radio silence is normal and not a signal to stop. Best practices: (1) Follow up on outreach after 7–10 days with a brief, gracious note, (2) Diversify your channels — cold email, LinkedIn, alumni networks, career fairs, (3) Revisit your message — is your subject line compelling? Is your ask specific and easy to say yes to? (4) Increase volume — most successful job searchers have a funnel of 30–50+ contacts. (5) Engage content before reaching out — comment on posts, share insights.`,
  },
  {
    id: "circ-delay-001",
    category: "circumstances",
    tags: ["behind", "delayed", "slow", "inconsistent", "busy"],
    text: `Falling behind on your search: Life gets in the way — classes, family, health. The most important thing is consistency, not perfection. A single outreach message per day adds up to 30 new connections per month. Reframe your expectations: slow progress is still progress. Batch your networking tasks (e.g., every Sunday evening, send 3–5 messages). Recommit to your roadmap with realistic, reduced daily targets if needed.`,
  },

  // ─────────────────────────────────────────────
  // ROADMAP — Strategy & Phase Guidance
  // ─────────────────────────────────────────────
  {
    id: "road-phases-001",
    category: "roadmap",
    tags: ["phases", "timeline", "milestones", "strategy"],
    text: `Job search phases: Phase 1 (Weeks 1–2) — Foundation: polish resume, identify 30+ target companies, set up LinkedIn. Phase 2 (Weeks 3–6) — Outreach: send 5–10 personalized messages per week, attend networking events, begin informational interviews. Phase 3 (Weeks 7–10) — Pipeline Building: follow up, request referrals from warm contacts, apply to target companies. Phase 4 (Weeks 11+) — Interview Conversion: prep for case/behavioral interviews, maintain networking relationships, evaluate offers.`,
  },
  {
    id: "road-networking-001",
    category: "roadmap",
    tags: ["networking", "outreach", "linkedin", "coffee chat"],
    text: `Effective networking: The goal of networking is not to ask for a job — it's to build relationships. Lead with curiosity and genuine interest. Best networking message structure: (1) Brief intro — who you are and why you're reaching out, (2) Specific connection — mention something specific about their work, (3) Clear ask — a 15-minute call, not "any advice." Quality > quantity: one genuine conversation beats 10 generic messages.`,
  },
  {
    id: "road-finance-001",
    category: "roadmap",
    tags: ["finance", "investment banking", "ib", "wall street"],
    text: `Finance / Investment Banking track roadmap: Recruiting is highly structured and deadline-driven. Key actions: (1) Target OCR (on-campus recruiting) timelines at your school, (2) Attend bank information sessions — presence signals interest, (3) Complete technical prep (accounting, DCF, LBO basics, pitch), (4) Network with analysts and associates at target banks NOW — decisions often hinge on internal champions, (5) Apply broadly across bulge bracket, middle market, and boutique banks.`,
  },
  {
    id: "road-consulting-001",
    category: "roadmap",
    tags: ["consulting", "mckinsey", "bcg", "bain", "mbb", "case interview"],
    text: `Consulting track roadmap: Case interview preparation is the central differentiator. Start case prep at least 8–12 weeks before interview season. Resources: Case in Point, McKinsey & Company practice cases, RocketBlocks. Network with consultants from target firms — focus on learning about their day-to-day and the firm culture, not just asking for a referral. Firms value demonstrated analytical thinking, communication clarity, and structured problem-solving.`,
  },
  {
    id: "road-tech-001",
    category: "roadmap",
    tags: ["tech", "product manager", "pm", "software", "startup"],
    text: `Tech / Product track roadmap: For PM roles: build a portfolio of 2–3 product teardowns or case studies. Practice behavioral questions (why PM, product sense, metrics). For software roles: LeetCode preparation is expected — aim for 100+ problems across easy/medium. For all tech roles: showcase projects with measurable outcomes. Target a mix of FAANG, mid-size tech, and startups — startups often have less competitive recruiting pipelines.`,
  },
  {
    id: "road-marketing-001",
    category: "roadmap",
    tags: ["marketing", "brand", "growth", "digital"],
    text: `Marketing track roadmap: Build a portfolio — even personal projects count. Show that you understand growth loops, customer segments, and campaign measurement. Network with brand managers, growth leads, and marketing VPs. Key skills to highlight: data analysis (Google Analytics, SQL basics), content creation, A/B testing experience, and cross-functional collaboration. Marketing internships at consumer brands and startups are often more accessible than IB or consulting pipelines.`,
  },

  // ─────────────────────────────────────────────
  // NETWORKING — Tactics & Execution
  // ─────────────────────────────────────────────
  {
    id: "net-linkedin-001",
    category: "networking",
    tags: ["linkedin", "profile", "optimization", "connections"],
    text: `LinkedIn profile optimization: (1) Professional headshot — this alone improves response rate by 40%, (2) Headline should state your target role, not just your current title, (3) About section — 3–5 sentences on who you are, what you're building toward, and what makes you interesting, (4) All experiences with 2–3 bullet points, (5) Skills section — add skills your target employers care about, (6) Set "Open to Work" privately (visible to recruiters only).`,
  },
  {
    id: "net-cold-outreach-001",
    category: "networking",
    tags: ["cold outreach", "message", "template", "response rate"],
    text: `Writing cold outreach messages: Keep messages under 100 words. Personalize the opening — mention something specific about their background or work. Make your ask easy and low-commitment. Best asks: "15-minute call," "a few questions via email," or "virtual coffee chat." Avoid: "I was wondering if maybe you'd have time to..." — be direct. Follow up once after 7–10 days if no response. Two touchpoints is appropriate; three or more becomes spam.`,
  },
  {
    id: "net-follow-up-001",
    category: "networking",
    tags: ["follow up", "thank you", "after call", "maintain relationship"],
    text: `After an informational interview: Send a thank-you email within 24 hours. Reference a specific point from the conversation — this proves you were listening. Mention one action you will take based on their advice. Keep it to 4–6 sentences. File a note about what you discussed — you will forget within a week. Check in every 2–3 months with a brief update on your progress to maintain the relationship long-term.`,
  },

  // ─────────────────────────────────────────────
  // COACHING — Mindset & Support
  // ─────────────────────────────────────────────
  {
    id: "coach-anxiety-001",
    category: "coaching",
    tags: ["anxiety", "stress", "networking anxiety", "imposter syndrome"],
    text: `Dealing with networking anxiety: Feeling nervous about reaching out to strangers is completely normal — even confident professionals feel it. A reframe that helps: you are not asking for a favor, you are offering someone the chance to share their story. Most people enjoy talking about their career when asked thoughtfully. Rejection from a cold message doesn't mean rejection of you as a person. Start with the least intimidating contacts (alumni, classmates) and build momentum.`,
  },
  {
    id: "coach-momentum-001",
    category: "coaching",
    tags: ["motivation", "consistency", "momentum", "habits"],
    text: `Building momentum in your job search: The job search is a long game — most successful candidates spend 3–6 months in active search. Protect your motivation by: celebrating small wins (sent 3 messages = win), tracking progress visually, taking one full day off per week from job search activities, and anchoring your effort to your long-term vision. Burnout is the #1 reason job searches stall — sustainable effort beats heroic sprints.`,
  },
  {
    id: "coach-setback-001",
    category: "coaching",
    tags: ["setback", "rejection", "resilience", "perspective"],
    text: `Resilience after setbacks: Every professional you admire has a collection of rejection stories. The difference between people who succeed and those who don't is rarely talent — it's persistence and willingness to iterate. After a setback: (1) Give yourself 24 hours to feel disappointed, (2) Debrief on what you'd do differently, (3) Make one concrete improvement, (4) Get back in motion. Progress is the best antidote to discouragement.`,
  },
];
