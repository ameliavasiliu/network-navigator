import * as React from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ============================================================
// DATA MODELS
// ============================================================

export interface TaskResource {
  title: string;
  url: string;
}

export type TaskStatus = "locked" | "unlocked" | "completed";

export interface CompletionGate {
  type: "text" | "number" | "confirm";
  prompt: string;
  placeholder?: string;
}

export interface Task {
  id: string;
  title: string;
  objective: string;
  whyItMatters: string;
  steps: string[];
  culturalTip?: string;
  resources: TaskResource[];
  completionGate: CompletionGate;
  completionEvidence?: string;
  status: TaskStatus;
}

export interface ProgressUpdate {
  id: string;
  content: string;
  createdAt: string;
  adaptiveAction?: string;
}

export interface Roadmap {
  id: string;
  goal: string;
  goalCategory: string;
  yearInSchool: string;
  major: string;
  school: string;
  isInternational: boolean;
  degree: string;
  currentExperience: string;
  additionalContext: string;
  tasks: Task[];
  updates: ProgressUpdate[];
  createdAt: string;
}

export interface WizardFormData {
  yearInSchool: string;
  major: string;
  school: string;
  isInternational: string;
  degree: string;
  currentExperience: string;
  goal: string;
  additionalContext: string;
}

// ============================================================
// TASK TEMPLATES
// Future: AI generates personalized tasks based on user profile, resume, and goal.
// Current: Deterministic templates keyed by detected role category.
// ============================================================

type TaskTemplate = Omit<Task, "id" | "status" | "completionEvidence">;

const IB_TASKS: TaskTemplate[] = [
  {
    title: "Build Your IB Target List",
    objective: "Create a prioritized list of 10 banks with confirmed H-1B sponsorship history, organized by tier (bulge bracket, elite boutique, middle market).",
    whyItMatters: "IB recruiting is hyper-structured with rigid timelines. A focused target list prevents wasted applications and lets you go deep on firms that actually hire international students.",
    steps: [
      "List all bulge bracket banks (Goldman Sachs, JPMorgan, Morgan Stanley, Bank of America, Citi, Barclays, UBS, Deutsche Bank)",
      "Add elite boutiques (Evercore, Lazard, Centerview, PJT, Moelis)",
      "Check each firm's H-1B sponsorship count on myvisajobs.com",
      "Rank by: (1) sponsorship likelihood, (2) culture fit, (3) your competitive advantage",
      "Mark application deadlines — many open August for the following summer",
    ],
    culturalTip: "In the US, it's normal and expected to be strategic about where you apply. Asking 'Does your firm sponsor H-1B visas?' is a standard question at info sessions — not rude or presumptuous.",
    resources: [
      { title: "Wall Street Oasis Bank Rankings", url: "https://www.wallstreetoasis.com/rankings/banking" },
      { title: "H-1B Sponsorship Lookup", url: "https://www.myvisajobs.com/Reports/Top-H1B-Visa-Sponsors.aspx" },
      { title: "M&I Bank List by Tier", url: "https://www.mergersandinquisitions.com/investment-banking-target-schools/" },
    ],
    completionGate: { type: "text", prompt: "Paste your top 5 target banks with their tier (BB/EB/MM):", placeholder: "e.g., Goldman Sachs (BB), Evercore (EB), Houlihan Lokey (MM)..." },
  },
  {
    title: "Rewrite Your Resume for IB",
    objective: "Produce a 1-page, IB-formatted resume with 100% quantified bullet points using 'Accomplished X by doing Y resulting in Z' structure.",
    whyItMatters: "IB recruiters scan resumes in under 10 seconds. Formatting signals you understand the industry. Unquantified bullets are an instant reject at top banks.",
    steps: [
      "Download an IB resume template (single column, Times New Roman or Garamond, 10-11pt)",
      "Move Education to the top — include GPA if above 3.5, SAT/GMAT if strong",
      "Rewrite every bullet: lead with a strong verb, include a number, show the result",
      "Remove all personal pronouns (I, my, we)",
      "Have 2 people in finance review it — use your school's career center",
    ],
    culturalTip: "American resumes never include photos, date of birth, nationality, or marital status. This is different from many countries. Also, it's 'resume' — never 'CV' in US IB recruiting.",
    resources: [
      { title: "M&I Free Resume Template", url: "https://www.mergersandinquisitions.com/investment-banking-resume-template/" },
      { title: "WSO Resume Review Forum", url: "https://www.wallstreetoasis.com/forums/investment-banking-resume-template-and-guide" },
    ],
    completionGate: { type: "confirm", prompt: "Confirm: My resume is 1 page, uses the X-by-Y-resulting-in-Z format, and has been reviewed by at least 1 person in finance." },
  },
  {
    title: "Send 5 Cold Outreach Messages to IB Professionals",
    objective: "Send 5 personalized LinkedIn messages to analysts/associates at your target banks and get at least 2 responses.",
    whyItMatters: "Over 70% of IB offers involve a referral. Cold outreach is uncomfortable but it's the single highest-ROI activity for breaking into banking as an international student.",
    steps: [
      "Search LinkedIn for analysts/associates at your top 5 banks who share your school, nationality, or background",
      "Write a message under 100 words: introduce yourself, mention the shared connection, ask for 15 minutes",
      "Send between Tuesday-Thursday, 9-11am their time zone",
      "If no response after 5 business days, send one polite follow-up",
      "Log every outreach: name, firm, date sent, response status",
    ],
    culturalTip: "In the US, asking someone senior for 'a quick coffee chat' or '15 minutes of your time' is completely normal and expected. You're not being a burden — networking is how the system works. Always end with a specific ask, not an open-ended 'let me know if you're free.'",
    resources: [
      { title: "Cold Email Template for IB", url: "https://www.wallstreetoasis.com/forums/networking-email-template-for-investment-banking" },
    ],
    completionGate: { type: "text", prompt: "Paste one of the outreach messages you sent (anonymize the name if you prefer):", placeholder: "Hi [Name], I'm a [year] at [school] studying [major]..." },
  },
  {
    title: "Complete 2 Informational Interviews",
    objective: "Conduct 2 phone/video calls with professionals at target banks and document key insights from each.",
    whyItMatters: "Info interviews give you insider knowledge about firm culture, recent deals, and recruiting timelines that you can't get from websites. They also build relationships that lead to referrals.",
    steps: [
      "Prepare 5-7 questions: focus on their path, recent deals, team culture, and advice for international candidates",
      "Start with easy questions, save the meaty ones for mid-conversation",
      "Take notes during the call (mute yourself to type if needed)",
      "Send a thank-you email within 24 hours referencing something specific they said",
      "Add them to your networking tracker with follow-up date (6-8 weeks later)",
    ],
    culturalTip: "Americans expect prompt thank-you notes. Within 24 hours is the standard. Reference a specific thing they said — 'Your point about the M&A market in healthcare was really helpful.' This shows you were listening, not just collecting contacts.",
    resources: [
      { title: "Informational Interview Question Bank", url: "https://www.mergersandinquisitions.com/investment-banking-informational-interview/" },
    ],
    completionGate: { type: "text", prompt: "Enter the names and firms of the 2 people you spoke with:", placeholder: "e.g., Sarah K. at Goldman Sachs, David L. at Evercore" },
  },
  {
    title: "Master the IB Technical Interview",
    objective: "Be able to answer the top 20 IB technical questions (accounting, valuation, DCF, merger model) without hesitation.",
    whyItMatters: "Technical questions are binary pass/fail. If you can't walk through a DCF or explain the 3 financial statements, the interview ends regardless of your networking.",
    steps: [
      "Memorize the 3-statement model flow and how changes cascade",
      "Practice walking through a DCF out loud (UFCF → discount → terminal value → enterprise value → equity value)",
      "Learn the top 3 valuation methodologies and when to use each",
      "Study 5 recent deals at your target banks — know the deal size, rationale, and outcome",
      "Do at least 3 mock technicals with a partner timing you",
    ],
    culturalTip: "In US interviews, saying 'I don't know' is far better than guessing or rambling. Interviewers respect intellectual honesty. You can say: 'I'm not sure about that specific point, but here's how I'd think about it...'",
    resources: [
      { title: "400 IB Interview Questions (WSP)", url: "https://www.wallstreetprep.com/knowledge/investment-banking-interview-questions/" },
      { title: "M&I Technical Question Guide", url: "https://www.mergersandinquisitions.com/investment-banking-interview-questions-and-answers/" },
    ],
    completionGate: { type: "number", prompt: "How many mock technical interviews have you completed?", placeholder: "e.g., 3" },
  },
  {
    title: "Submit 5 Applications",
    objective: "Apply to summer analyst programs at 5+ target banks before their early deadlines.",
    whyItMatters: "IB recruiting follows a strict calendar. Many banks review on a rolling basis — applying in the first 2 weeks dramatically increases your odds vs. applying at the deadline.",
    steps: [
      "Create accounts on each bank's career portal well before deadlines",
      "Tailor your cover letter for each bank: mention specific deals, people you spoke with, and why that bank",
      "Ask your info interview contacts if they'd be willing to submit a referral (do this BEFORE you apply)",
      "Submit applications in the first week the portal opens",
      "Track every application: bank, date applied, referral status, follow-up dates",
    ],
    culturalTip: "Asking someone to refer you is normal in the US — it actually helps them too (many banks pay referral bonuses). Frame it as: 'Would you be comfortable submitting a referral for me? I completely understand if the timing doesn't work.' Always make it easy for them to say no gracefully.",
    resources: [],
    completionGate: { type: "text", prompt: "List the banks you applied to and the dates:", placeholder: "e.g., Goldman Sachs (Aug 15), Morgan Stanley (Aug 20)..." },
  },
];

const CONSULTING_TASKS: TaskTemplate[] = [
  {
    title: "Build Your Consulting Target List",
    objective: "Create a tiered list of 10 consulting firms organized by: MBB, Big 4, specialty/boutique, with H-1B sponsorship status for each.",
    whyItMatters: "Consulting recruiting is relationship-driven with firm-specific timelines. A tiered list lets you allocate energy strategically — MBB requires different prep than Big 4.",
    steps: [
      "List MBB firms: McKinsey, BCG, Bain",
      "Add Big 4 consulting arms: Deloitte S&O, EY-Parthenon, KPMG Strategy, PwC Strategy&",
      "Include 3-4 boutiques aligned to your interests (LEK, Oliver Wyman, A.T. Kearney, Roland Berger)",
      "Verify H-1B sponsorship for each on myvisajobs.com",
      "Note application timelines — many open September for the following year",
    ],
    culturalTip: "Consulting firms in the US value 'fit' heavily. This means they want people who are genuinely curious, collaborative, and enjoyable to work with on long projects. In networking calls, show authentic enthusiasm — Americans can sense scripted responses.",
    resources: [
      { title: "Vault Consulting Rankings", url: "https://www.vault.com/best-companies-to-work-for/consulting" },
      { title: "H-1B Sponsorship Data", url: "https://www.myvisajobs.com" },
      { title: "Management Consulted Firm Guide", url: "https://managementconsulted.com/consulting-firms/" },
    ],
    completionGate: { type: "text", prompt: "List your top 5 target firms with their tier (MBB/Big4/Boutique):", placeholder: "e.g., McKinsey (MBB), Deloitte S&O (Big4), LEK (Boutique)..." },
  },
  {
    title: "Craft Your Consulting Resume",
    objective: "Produce a consulting-formatted resume where every bullet follows the 'impact-first' structure and demonstrates structured thinking.",
    whyItMatters: "Consulting resumes signal how you think. Structured bullets = structured thinker. Vague bullets = immediate reject.",
    steps: [
      "Use a clean, single-column format — no graphics, no color",
      "Lead every bullet with a quantified result: 'Increased X by Y% through Z'",
      "Include leadership and teamwork examples — consulting is team-based",
      "Add a 'Personal' or 'Additional' section with 2-3 distinctive interests (this matters at MBB)",
      "Get 2 reviews: one from career services, one from someone in consulting",
    ],
    culturalTip: "In the US, including distinctive personal interests on your resume (e.g., 'Competitive chess player' or 'Trained sushi chef') is expected at MBB firms. It's a conversation starter, not filler. Choose interests that are genuinely unique — not 'reading' or 'travel.'",
    resources: [
      { title: "Management Consulted Resume Guide", url: "https://managementconsulted.com/consulting-resume/" },
    ],
    completionGate: { type: "confirm", prompt: "Confirm: Every bullet on my resume leads with a quantified result and has been reviewed by at least 1 person." },
  },
  {
    title: "Conduct 3 Informational Interviews with Consultants",
    objective: "Have 3 conversations with people at target firms and document the firm-specific insights from each.",
    whyItMatters: "Consulting firms ask 'Why our firm?' in every interview. The only way to answer credibly is by talking to people who work there. These conversations also build referral relationships.",
    steps: [
      "Find 5-8 potential contacts: alumni, LinkedIn connections, people who attended your school or share your background",
      "Send short, specific outreach messages (under 75 words) asking for 20 minutes",
      "Prepare firm-specific questions: 'What makes BCG's approach to healthcare different from McKinsey's?'",
      "Take notes and send a thank-you email within 24 hours",
      "Ask at the end: 'Is there anyone else you'd recommend I speak with?'",
    ],
    culturalTip: "The 'double opt-in' introduction is standard US business etiquette. When someone offers to connect you with a colleague, they'll typically ask permission first. Don't push for an immediate introduction — say 'That would be wonderful whenever the timing works for them.'",
    resources: [
      { title: "Cold Outreach Template for Consulting", url: "https://managementconsulted.com/networking-in-consulting/" },
    ],
    completionGate: { type: "text", prompt: "Enter the names and firms of the 3 people you spoke with:", placeholder: "e.g., Maria T. at McKinsey, James W. at BCG, Priya S. at Deloitte" },
  },
  {
    title: "Master Case Interview Fundamentals",
    objective: "Be able to structure and solve 3 different case types (profitability, market entry, M&A) in under 30 minutes each.",
    whyItMatters: "The case interview is THE gate to consulting. No amount of networking can compensate for poor case skills. Top firms reject 80%+ of candidates at this stage.",
    steps: [
      "Study the 4 core frameworks: profitability, market sizing, market entry, M&A",
      "Learn to build custom structures instead of forcing frameworks — interviewers hate template answers",
      "Practice 2 cases per week with a partner, alternating interviewer/interviewee",
      "Record yourself and review — focus on structure, not just the right answer",
      "Do at least 1 practice case with someone currently in consulting",
    ],
    culturalTip: "In US case interviews, thinking out loud is essential. Silence makes interviewers uncomfortable. Say 'Let me take 30 seconds to structure my thoughts' — then walk them through your logic step by step. This is very different from cultures where quiet reflection is valued.",
    resources: [
      { title: "PrepLounge Case Library", url: "https://www.preplounge.com/en/management-consulting-cases" },
      { title: "Case in Point (Book)", url: "https://www.amazon.com/Case-Point-Complete-Interview-Preparation/dp/0986370711" },
      { title: "Victor Cheng's LOMS", url: "https://www.caseinterview.com/loms" },
    ],
    completionGate: { type: "number", prompt: "How many practice cases have you completed with a partner?", placeholder: "e.g., 6" },
  },
  {
    title: "Attend 2 Firm-Hosted Events",
    objective: "Attend 2 consulting firm events (info sessions, coffee chats, case workshops) and make at least 1 meaningful connection at each.",
    whyItMatters: "Firms track attendance. Being seen at events signals genuine interest and gives you names to reference in applications and interviews.",
    steps: [
      "Check your school's career center for upcoming consulting events",
      "Monitor firm websites and LinkedIn for virtual events open to all schools",
      "Prepare 2-3 thoughtful questions for each event (not questions answered on the website)",
      "Introduce yourself to at least 1 person after the event and exchange contact info",
      "Send a follow-up email within 48 hours to anyone you spoke with",
    ],
    culturalTip: "At US networking events, the standard greeting is a firm handshake, eye contact, and 'Hi, I'm [first name].' Have your elevator pitch ready: 15 seconds covering who you are, what you study, and why you're interested in consulting. End with a question to them, not a monologue about yourself.",
    resources: [],
    completionGate: { type: "text", prompt: "Which events did you attend and who did you connect with?", placeholder: "e.g., BCG coffee chat at campus — spoke with Associate Director Lisa M." },
  },
];

const MARKETING_TASKS: TaskTemplate[] = [
  {
    title: "Define Your Marketing Specialization",
    objective: "Choose a marketing focus area (brand, digital/growth, product marketing, analytics) and identify 8 target companies that hire international students in that area.",
    whyItMatters: "Marketing is broad — companies hire for specific functions. Clarity on your specialization lets you build relevant skills and tell a coherent story in interviews.",
    steps: [
      "Research the major marketing functions: brand management (CPG), growth marketing (tech), product marketing (SaaS), marketing analytics",
      "Identify which aligns with your strengths: creative storytelling → brand, data + experimentation → growth, tech + strategy → PMM",
      "List 8 companies known for that function: e.g., P&G/Unilever for brand, Google/Meta for growth, Salesforce/HubSpot for PMM",
      "Verify H-1B sponsorship for each company",
      "Note recruiting timelines — CPG often recruits Sept-Nov, tech is more rolling",
    ],
    culturalTip: "In the US, marketing professionals are expected to have strong opinions backed by data. In interviews, saying 'I noticed your brand's Instagram engagement dropped 15% after the campaign pivot — here's what I'd test' shows initiative, not arrogance.",
    resources: [
      { title: "AMA Career Paths in Marketing", url: "https://www.ama.org/marketing-career-paths/" },
      { title: "Marketing Career Guide", url: "https://www.hubspot.com/marketing-careers" },
    ],
    completionGate: { type: "text", prompt: "What's your chosen specialization and your top 3 target companies?", placeholder: "e.g., Growth Marketing — Google, Airbnb, Spotify" },
  },
  {
    title: "Build a Marketing Portfolio Piece",
    objective: "Create 1 tangible marketing artifact — a campaign analysis, growth audit, or brand teardown — that demonstrates your skills to employers.",
    whyItMatters: "Marketing hiring managers care about what you can DO, not just what you've studied. A concrete portfolio piece gives you something to discuss in interviews that 90% of candidates don't have.",
    steps: [
      "Choose a format: brand audit of a company you admire, growth channel analysis, social media campaign proposal, or competitive positioning study",
      "Use real data: SimilarWeb for traffic, social analytics tools for engagement, earnings calls for strategy",
      "Structure it professionally: executive summary, analysis, recommendations, expected impact",
      "Keep it to 5-8 slides or a 2-page document",
      "Get feedback from a marketing professor or professional before sharing",
    ],
    culturalTip: "American employers value initiative and 'showing, not telling.' Creating a portfolio piece on your own — without being asked — signals exactly the kind of proactive mindset US companies want. Don't wait for permission to demonstrate value.",
    resources: [
      { title: "SimilarWeb (Free Tier)", url: "https://www.similarweb.com" },
      { title: "How to Build a Marketing Portfolio", url: "https://www.hubspot.com/marketing-portfolio-examples" },
    ],
    completionGate: { type: "text", prompt: "Describe the portfolio piece you created (topic, format, key finding):", placeholder: "e.g., Growth channel audit for Duolingo — analyzed their TikTok strategy vs. competitors, found they over-index on organic social..." },
  },
  {
    title: "Network with 3 Marketing Professionals",
    objective: "Have 3 informational interviews with marketing professionals at target companies and document firm-specific insights.",
    whyItMatters: "Marketing roles vary enormously by company. What a 'Brand Manager' does at P&G is completely different from at Google. Only insiders can explain these nuances.",
    steps: [
      "Search LinkedIn for alumni or professionals with titles matching your target role",
      "Send concise messages mentioning something specific about their work or company",
      "Ask questions about: day-to-day work, skills they use most, how they got their role, advice for international candidates",
      "Bring your portfolio piece up naturally — ask for their feedback on it",
      "Follow up with a thank-you note and stay in touch quarterly",
    ],
    culturalTip: "In US marketing culture, personal branding matters. Your LinkedIn should be polished: professional photo, headline that says what you want to do (not just your school), and 2-3 posts showing marketing thinking. This is what people check before agreeing to chat with you.",
    resources: [],
    completionGate: { type: "text", prompt: "Who did you speak with and what's the most useful thing you learned?", placeholder: "e.g., Spoke with Ana R. (Brand Manager at P&G) — learned that they value MBA leadership summer projects over marketing internships..." },
  },
  {
    title: "Learn the Core Marketing Tools",
    objective: "Get hands-on experience with 3 industry-standard tools relevant to your specialization (Google Analytics, HubSpot, Figma, SQL, etc.).",
    whyItMatters: "Marketing is increasingly technical. Being able to say 'I can run a Google Analytics funnel analysis' or 'I've built campaigns in HubSpot' puts you ahead of candidates who only talk strategy.",
    steps: [
      "Identify 3 tools used in your target roles (check job descriptions for common requirements)",
      "Complete a free certification or tutorial for each: Google Analytics cert, HubSpot Academy, Meta Blueprint",
      "Apply each tool to a real project: analyze your portfolio piece's hypothetical data, build a sample campaign",
      "Add certifications to your LinkedIn and resume",
    ],
    culturalTip: "Free certifications carry real weight in US marketing hiring. Google Analytics, HubSpot, and Meta certifications are specifically looked for on resumes. Completing them shows initiative and baseline competence.",
    resources: [
      { title: "Google Analytics Academy", url: "https://analytics.google.com/analytics/academy/" },
      { title: "HubSpot Academy (Free)", url: "https://academy.hubspot.com" },
      { title: "Meta Blueprint", url: "https://www.facebookblueprint.com" },
    ],
    completionGate: { type: "text", prompt: "Which 3 tools/certifications did you complete?", placeholder: "e.g., Google Analytics Certification, HubSpot Inbound Marketing, SQL basics on Mode Analytics" },
  },
  {
    title: "Apply to 5 Marketing Roles",
    objective: "Submit tailored applications to 5 marketing internship or full-time positions at target companies.",
    whyItMatters: "Marketing applications require customization. A generic cover letter gets filtered out — you need to show you understand the company's specific marketing challenges.",
    steps: [
      "Tailor each application: reference the company's recent campaigns, product launches, or marketing challenges",
      "Attach or link your portfolio piece where possible",
      "Ask networking contacts if they can submit referrals before you apply",
      "Apply through the company career portal AND reach out to the hiring manager on LinkedIn",
      "Track all applications with dates, contacts, and follow-up status",
    ],
    culturalTip: "In the US, following up on job applications is expected and professional. One week after applying, send a brief LinkedIn message to the recruiter or hiring manager: 'Hi [Name], I recently applied for [role] and wanted to reiterate my interest. I'd welcome the chance to discuss how my [specific experience] aligns with the team's goals.'",
    resources: [],
    completionGate: { type: "text", prompt: "List the companies and roles you applied to:", placeholder: "e.g., Google (APM Intern), P&G (Brand Manager Intern), Spotify (Growth Marketing Analyst)..." },
  },
];

const PRODUCT_TECH_TASKS: TaskTemplate[] = [
  {
    title: "Define Your PM/Tech Target List",
    objective: "Create a list of 10 companies hiring for product or tech roles, verified for H-1B sponsorship, organized by tier and role type.",
    whyItMatters: "Product and tech recruiting varies wildly by company size. FAANG has structured programs; startups hire ad-hoc. Your preparation strategy depends on knowing where you're aiming.",
    steps: [
      "Categorize: Big Tech (Google, Meta, Amazon, Apple, Microsoft), Growth-stage (Stripe, Notion, Figma, Databricks), Enterprise (Salesforce, Adobe, ServiceNow)",
      "Determine role type: Product Manager, Product Marketing, Software Engineer, Data/Analytics",
      "Verify H-1B sponsorship on each company's career page and myvisajobs.com",
      "Check Levels.fyi for compensation benchmarks and interview difficulty",
      "Note application windows — many big tech PM programs open July-September",
    ],
    culturalTip: "In US tech culture, titles matter less than impact. Nobody cares if you were a 'Vice President' at a university club — they care what you built, shipped, and measured. Frame everything in terms of user impact and business outcomes.",
    resources: [
      { title: "Levels.fyi Compensation Data", url: "https://www.levels.fyi" },
      { title: "H-1B Sponsorship Lookup", url: "https://www.myvisajobs.com" },
    ],
    completionGate: { type: "text", prompt: "List your top 5 target companies and the specific role you're targeting at each:", placeholder: "e.g., Google (APM), Stripe (PM Intern), Notion (Product Analyst)..." },
  },
  {
    title: "Build or Ship a Product Artifact",
    objective: "Create 1 concrete artifact that demonstrates product thinking: a product spec, feature teardown, or functional prototype.",
    whyItMatters: "PM and tech interviews test your ability to think through products. Having a real artifact to reference — something you built, designed, or analyzed — is the strongest possible signal.",
    steps: [
      "Choose your format: product spec (PRD) for a feature, competitive analysis, user research study, or a simple prototype",
      "If building: use no-code tools (Figma, Replit, Notion) to create something functional",
      "If analyzing: pick a product you use daily, identify a problem, propose a solution with user flows and success metrics",
      "Include metrics: how would you measure success? What's the target KPI?",
      "Get feedback from 1 PM or engineer before presenting it",
    ],
    culturalTip: "US tech companies deeply value 'builder mentality.' Launching something imperfect is valued more than planning something perfect. If you built a small tool that 10 people use, that's a stronger story than a polished deck that was never implemented.",
    resources: [
      { title: "How to Write a Product Spec", url: "https://www.lennysnewsletter.com/p/how-to-write-a-product-spec" },
      { title: "Figma for Prototyping", url: "https://www.figma.com" },
    ],
    completionGate: { type: "text", prompt: "Describe what you built/analyzed and the key insight:", placeholder: "e.g., Wrote a PRD for a Notion templates marketplace — identified that 40% of new users churn because they can't find relevant templates..." },
  },
  {
    title: "Network with 3 PMs or Engineers",
    objective: "Have 3 informational interviews with product managers or engineers at target companies.",
    whyItMatters: "Product and engineering interviews heavily test 'culture fit' and 'product sense.' Talking to insiders teaches you the vocabulary, frameworks, and values each company prizes.",
    steps: [
      "Search for PMs/engineers on LinkedIn who share your school, nationality, or interests",
      "Send short messages: reference a product decision their company made and ask about it",
      "Ask about: their PM process, how they prioritize, what makes a great candidate, and how internationals succeed there",
      "Share your product artifact and ask for candid feedback",
      "Follow up within 24 hours with a specific thank-you",
    ],
    culturalTip: "In US tech, networking is less formal than in finance or consulting. It's common to connect over shared interests in products, side projects, or open source. Your outreach can be more casual: 'Hey [Name], I saw you worked on [feature] — I'd love to hear how your team approached [specific challenge].'",
    resources: [],
    completionGate: { type: "text", prompt: "Who did you speak with and what's the most useful thing you learned?", placeholder: "e.g., Spoke with Kevin L. (PM at Stripe) — learned that they value data fluency over MBA credentials..." },
  },
  {
    title: "Prepare for Product/Tech Interviews",
    objective: "Be able to answer product design, estimation, and behavioral questions confidently with structured frameworks.",
    whyItMatters: "PM interviews test structured thinking across multiple dimensions: product sense, analytical ability, technical understanding, and leadership. You need reps in each area.",
    steps: [
      "Study product design frameworks: user → problem → solution → prioritize → metrics",
      "Practice 3 estimation questions (market sizing, Fermi problems)",
      "Prepare 5 behavioral stories using STAR format (Situation, Task, Action, Result)",
      "For tech roles: review system design basics and coding fundamentals",
      "Do 2+ mock interviews with a PM or through platforms like Exponent",
    ],
    culturalTip: "US tech interviews expect you to ask clarifying questions before diving in. Starting a product design question with 'Just to make sure I'm aligned — are we designing for mobile or web? What's the primary user segment?' shows mature product thinking, not uncertainty.",
    resources: [
      { title: "Exponent PM Interview Prep", url: "https://www.tryexponent.com" },
      { title: "Cracking the PM Interview (Book)", url: "https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818" },
    ],
    completionGate: { type: "number", prompt: "How many mock product interviews have you completed?", placeholder: "e.g., 3" },
  },
  {
    title: "Apply to 5 Product/Tech Roles",
    objective: "Submit tailored applications to 5 PM or tech roles with referrals where possible.",
    whyItMatters: "Referrals increase your interview rate by 5-10x at tech companies. Applying without leveraging your network is leaving opportunity on the table.",
    steps: [
      "Ask your networking contacts to submit referrals before you apply",
      "Customize each application: reference the company's product, a recent launch, or a specific challenge",
      "Include a link to your product artifact or portfolio",
      "Apply on the company career page — avoid third-party job boards",
      "Track applications with dates, referral status, and follow-up actions",
    ],
    culturalTip: "In US tech, it's totally normal to apply to multiple companies simultaneously and openly discuss where else you're interviewing. Companies expect this and often accelerate their process if you have competing timelines. Be transparent: 'I'm currently interviewing at [X] and [Y] with a timeline of [date].'",
    resources: [],
    completionGate: { type: "text", prompt: "List the companies and roles you applied to:", placeholder: "e.g., Google (APM), Stripe (PM Intern), Notion (Product Analyst)..." },
  },
];

const GENERAL_TASKS: TaskTemplate[] = [
  {
    title: "Clarify Your Career Direction",
    objective: "Write a clear, specific career goal statement that names the role, industry, and type of company you're targeting.",
    whyItMatters: "People can only help you if they understand what you're looking for. A vague goal like 'something in business' makes networking nearly impossible.",
    steps: [
      "Complete this sentence: 'I want to work as a [specific role] at a [type of company] in [industry] because [genuine reason]'",
      "Research 3-5 job descriptions for your target role — note required skills and qualifications",
      "Identify 2-3 industries where your background gives you an advantage",
      "Validate your goal with 1-2 professionals: 'Does this path make sense given my background?'",
    ],
    culturalTip: "In the US, specificity is valued over humility when discussing career goals. Saying 'I want to be a product marketing manager at a B2B SaaS company' is much more effective than 'I'm open to anything in marketing.' Being specific helps people help you.",
    resources: [
      { title: "O*NET Career Explorer", url: "https://www.onetonline.org" },
    ],
    completionGate: { type: "text", prompt: "Write your career goal statement:", placeholder: "I want to work as a [role] at a [company type] in [industry] because..." },
  },
  {
    title: "Audit and Upgrade Your Resume",
    objective: "Produce a US-formatted resume where every bullet point leads with a quantified result.",
    whyItMatters: "Your resume is often your only first impression. In the US job market, a well-formatted resume with clear impact statements is table stakes.",
    steps: [
      "Remove all photos, personal info, and references to age/nationality/marital status",
      "Keep to 1 page (2 pages only if you have 5+ years of experience)",
      "Rewrite every bullet: lead with a verb, include a number, show the result",
      "Have 2 people review it — at least one should be familiar with US resume conventions",
    ],
    culturalTip: "US resumes are significantly different from CVs used in Europe, Asia, and other regions. No photo. No personal details. No 'Objective' statement. Lead with Education (if recent grad) or Experience (if working). Every bullet must answer: 'So what?'",
    resources: [
      { title: "Harvard Business School Resume Guide", url: "https://www.hbs.edu/recruiting/resources/Pages/resume-guidelines.aspx" },
    ],
    completionGate: { type: "confirm", prompt: "Confirm: My resume is 1 page, US-formatted, and has been reviewed by at least 1 person familiar with US conventions." },
  },
  {
    title: "Identify and Research 5 Target Companies",
    objective: "Create a researched list of 5 companies that match your goals, with confirmed visa sponsorship and key contacts identified.",
    whyItMatters: "Targeted applications are 5x more effective than spray-and-pray. Deep knowledge of a few companies lets you network and interview with confidence.",
    steps: [
      "List 5 companies based on: role fit, industry interest, growth trajectory, and visa sponsorship",
      "Research each: recent news, quarterly earnings/funding, culture (Glassdoor reviews), key leaders",
      "Identify 2-3 potential contacts at each company (alumni, LinkedIn connections)",
      "Note application deadlines and recruiting events",
    ],
    resources: [
      { title: "Glassdoor Company Reviews", url: "https://www.glassdoor.com" },
      { title: "H-1B Sponsorship Data", url: "https://www.myvisajobs.com" },
    ],
    completionGate: { type: "text", prompt: "List your 5 target companies with one reason each:", placeholder: "e.g., Deloitte — strong strategy practice + confirmed H-1B sponsorship..." },
  },
  {
    title: "Conduct 3 Informational Interviews",
    objective: "Have 3 conversations with professionals in your target field and document key insights.",
    whyItMatters: "Networking is the #1 way jobs are filled in the US. Most roles are filled through connections before they're even posted publicly.",
    steps: [
      "Find contacts through: alumni network, LinkedIn, career center events, professor introductions",
      "Send personalized outreach (under 100 words) with a specific ask for 15-20 minutes",
      "Prepare 5-7 questions focused on their career path, day-to-day, and advice for internationals",
      "Send a thank-you email within 24 hours",
      "Follow up every 6-8 weeks with relevant updates about your progress",
    ],
    culturalTip: "American professionals expect you to drive the conversation during informational interviews. They won't ask 'how can I help you?' — you need to come with specific questions and a clear ask. At the end, it's okay to ask: 'Would you be open to staying in touch as I progress in my job search?'",
    resources: [],
    completionGate: { type: "text", prompt: "Who did you speak with (name and company)?", placeholder: "e.g., Sarah L. at Deloitte, Mike T. at Amazon, Prof. Williams (referred me to her contact at Google)" },
  },
  {
    title: "Prepare Your Interview Toolkit",
    objective: "Have 5 polished behavioral stories (STAR format), a 30-second elevator pitch, and answers to the top 5 common questions ready.",
    whyItMatters: "US interviews are behavioral-heavy. Without prepared stories, even strong candidates fumble under pressure. Preparation is respect for the interviewer's time.",
    steps: [
      "Write 5 STAR stories covering: leadership, teamwork, failure/learning, initiative, and analytical thinking",
      "Craft a 30-second elevator pitch: Present → Past → Future",
      "Prepare answers for: 'Tell me about yourself', 'Why this company?', 'Why should we hire you?', 'What's your biggest weakness?', 'Where do you see yourself in 5 years?'",
      "Practice out loud — record yourself and watch back",
      "Do 2 mock interviews with peers or your career center",
    ],
    culturalTip: "In US interviews, the 'weakness' question is a test of self-awareness, not a trap. Choose a real weakness you've actively worked on. 'I used to struggle with delegating because I wanted everything to be perfect, so I started using a framework to prioritize what truly needs my attention' — this shows growth.",
    resources: [],
    completionGate: { type: "number", prompt: "How many mock interviews have you completed?", placeholder: "e.g., 2" },
  },
];

const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  finance: IB_TASKS,
  consulting: CONSULTING_TASKS,
  marketing: MARKETING_TASKS,
  tech: PRODUCT_TECH_TASKS,
  general: GENERAL_TASKS,
};

// ============================================================
// ADAPTIVE FOLLOW-UP TASKS
// Future: AI would generate dynamic tasks based on NLP analysis of user updates.
// Current: Keyword-matching to append relevant follow-up tasks.
// ============================================================

const ADAPTIVE_TASKS: Record<string, TaskTemplate> = {
  no_response: {
    title: "Follow-Up Strategy: No Responses",
    objective: "Revise and resend outreach to 3 contacts who haven't responded, using an improved message.",
    whyItMatters: "Most people don't respond to the first message — it's not personal. A thoughtful follow-up doubles your response rate. Persistence is a professional skill.",
    steps: [
      "Wait 5 business days after your initial message",
      "Send a brief follow-up: 'Hi [Name], I know you're busy — just wanted to resurface my note. I'd love to hear about [specific topic]. Happy to work around your schedule.'",
      "If still no response after 2 attempts, move on — there are plenty of other contacts",
      "Review your original message: was it too long? Too generic? Did it have a clear ask?",
    ],
    culturalTip: "In the US, one follow-up is expected and professional. Two is the maximum. Never send three. If someone doesn't respond after 2 attempts, they're politely declining. Don't take it personally — move on gracefully.",
    resources: [],
    completionGate: { type: "text", prompt: "Paste your revised follow-up message:", placeholder: "Hi [Name], I wanted to follow up on my previous message..." },
  },
  interview: {
    title: "Interview Preparation Sprint",
    objective: "Complete targeted preparation for your upcoming interview: research the company, prepare stories, and do 1 mock.",
    whyItMatters: "Getting an interview is a major milestone — now your only job is to not waste it. Focused preparation in the 48 hours before an interview dramatically improves performance.",
    steps: [
      "Research the company: latest news, recent product launches, quarterly results, key leaders",
      "Prepare 3 'Why this company?' points using information from your info interviews",
      "Review and rehearse your 5 STAR stories — adapt them to the specific role",
      "Do 1 mock interview focused on this company with a friend or career center",
      "Prepare 2-3 thoughtful questions to ask the interviewer",
    ],
    culturalTip: "In US interviews, asking questions at the end is mandatory, not optional. 'Do you have any questions for me?' is your chance to show genuine interest. Never say 'No, I think you covered everything.' Ask about team culture, current challenges, or what success looks like in the first 90 days.",
    resources: [],
    completionGate: { type: "text", prompt: "What company is the interview with, and what are your 3 'Why this company?' points?", placeholder: "e.g., McKinsey — (1) healthcare practice aligns with my background, (2) global staffing model, (3) strong international track record" },
  },
  visa: {
    title: "Visa Strategy Checkpoint",
    objective: "Verify your visa timeline, understand OPT/CPT rules, and confirm your target companies sponsor H-1B.",
    whyItMatters: "Visa status is the #1 differentiator for international student job searches. Understanding your timeline prevents you from targeting companies or roles that won't work.",
    steps: [
      "Confirm your OPT eligibility and application timeline with your school's international student office",
      "If in STEM, understand STEM OPT extension rules (24 additional months)",
      "Re-verify H-1B sponsorship for your top 5 target companies",
      "Understand CPT rules if you need to do an internship before graduation",
      "Consider: is there a Plan B role or company if your top choice doesn't sponsor?",
    ],
    culturalTip: "It's completely acceptable to ask about visa sponsorship during networking calls and even early interviews. Frame it professionally: 'I want to be upfront — I'll need H-1B sponsorship. Does your firm typically sponsor for this role?' Most professionals appreciate the transparency.",
    resources: [
      { title: "USCIS OPT Information", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" },
    ],
    completionGate: { type: "text", prompt: "What's your visa status and OPT/CPT timeline?", placeholder: "e.g., F-1 student, graduating May 2027, eligible for 12-month OPT + 24-month STEM extension" },
  },
  rejection: {
    title: "Process the Rejection and Pivot",
    objective: "Turn a rejection into actionable next steps: request feedback, identify alternatives, and maintain momentum.",
    whyItMatters: "Rejection is universal in job searching — even the strongest candidates face it. How you respond determines whether it's a setback or a redirect.",
    steps: [
      "Allow yourself 24 hours to be disappointed — then move forward",
      "If possible, reply thanking them and asking: 'Is there any feedback you could share to help me improve?'",
      "Review: was it a fit issue, a skills gap, or a timing issue?",
      "Identify 2 alternative companies or roles you haven't yet pursued",
      "Reach out to your network with an update — people often have leads when they know you're actively looking",
    ],
    culturalTip: "In the US, asking for feedback after a rejection is professional and respected. Most people don't do it, so you'll stand out. Keep it brief: 'Thank you for letting me know. I really enjoyed learning about [specific thing]. If you have any feedback on how I could improve, I'd genuinely appreciate it.'",
    resources: [],
    completionGate: { type: "text", prompt: "What did you learn from this rejection and what's your next step?", placeholder: "e.g., Rejected from Goldman SA program — feedback was to get more deal experience. Pivoting to apply to middle-market banks..." },
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function detectGoalCategory(goal: string): string {
  // Future: AI would classify goals using NLP or embeddings for nuanced matching.
  // Current: Keyword-based detection covering common role variations.
  const g = goal.toLowerCase();
  if (g.includes("invest") || g.includes("banking") || g.includes("ib ") || g.includes("goldman") || g.includes("jpmorgan") || g.includes("morgan stanley") || g.includes("finance") || g.includes("trading") || g.includes("equity") || g.includes("m&a")) {
    return "finance";
  }
  if (g.includes("consult") || g.includes("mckinsey") || g.includes("bcg") || g.includes("bain") || g.includes("deloitte") || g.includes("strategy")) {
    return "consulting";
  }
  if (g.includes("market") || g.includes("brand") || g.includes("advertising") || g.includes("growth") || g.includes("cpg") || g.includes("p&g") || g.includes("unilever")) {
    return "marketing";
  }
  if (g.includes("product") || g.includes("tech") || g.includes("software") || g.includes("engineer") || g.includes("pm ") || g.includes("google") || g.includes("meta") || g.includes("amazon") || g.includes("startup")) {
    return "tech";
  }
  return "general";
}

function generateTasks(goalCategory: string): Task[] {
  const templates = TASK_TEMPLATES[goalCategory] || TASK_TEMPLATES.general;
  return templates.map((template, index) => ({
    ...template,
    id: `task-${index + 1}`,
    status: (index === 0 ? "unlocked" : "locked") as TaskStatus,
    completionEvidence: undefined,
  }));
}

function generateId(): string {
  return `roadmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function detectAdaptiveKeywords(content: string): string[] {
  const lower = content.toLowerCase();
  const triggers: string[] = [];
  if (lower.includes("no response") || lower.includes("didn't respond") || lower.includes("haven't heard") || lower.includes("ghosted") || lower.includes("no reply")) {
    triggers.push("no_response");
  }
  if (lower.includes("interview") || lower.includes("got invited") || lower.includes("phone screen") || lower.includes("superday")) {
    triggers.push("interview");
  }
  if (lower.includes("visa") || lower.includes("h-1b") || lower.includes("h1b") || lower.includes("opt") || lower.includes("cpt") || lower.includes("sponsorship") || lower.includes("work authorization")) {
    triggers.push("visa");
  }
  if (lower.includes("reject") || lower.includes("didn't get") || lower.includes("turned down") || lower.includes("dinged") || lower.includes("not moving forward")) {
    triggers.push("rejection");
  }
  return triggers;
}

// ============================================================
// CONTEXT
// ============================================================

interface RoadmapContextType {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  wizardFormData: WizardFormData;
  updateWizardFormData: (data: Partial<WizardFormData>) => void;
  createRoadmap: () => string;
  setCurrentRoadmap: (id: string) => void;
  completeTask: (taskId: string, evidence: string) => void;
  addProgressUpdate: (content: string) => void;
  prefillWizardFromLastRoadmap: () => void;
}

const defaultWizardFormData: WizardFormData = {
  yearInSchool: "",
  major: "",
  school: "",
  isInternational: "",
  degree: "",
  currentExperience: "",
  goal: "",
  additionalContext: "",
};

const RoadmapContext = createContext<RoadmapContextType | null>(null);

const STORAGE_KEY = "network-navigator-roadmaps";
const CURRENT_ROADMAP_KEY = "network-navigator-current";

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
  const [wizardFormData, setWizardFormData] = useState<WizardFormData>(defaultWizardFormData);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRoadmaps(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored roadmaps", e);
      }
    }
    const storedCurrent = localStorage.getItem(CURRENT_ROADMAP_KEY);
    if (storedCurrent) {
      setCurrentRoadmapId(storedCurrent);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    if (currentRoadmapId) {
      localStorage.setItem(CURRENT_ROADMAP_KEY, currentRoadmapId);
    }
  }, [currentRoadmapId]);

  const currentRoadmap = roadmaps.find((r) => r.id === currentRoadmapId) || null;

  const updateWizardFormData = (data: Partial<WizardFormData>) => {
    setWizardFormData((prev) => ({ ...prev, ...data }));
  };

  const createRoadmap = (): string => {
    const goalCategory = detectGoalCategory(wizardFormData.goal);
    const tasks = generateTasks(goalCategory);

    const newRoadmap: Roadmap = {
      id: generateId(),
      goal: wizardFormData.goal,
      goalCategory,
      yearInSchool: wizardFormData.yearInSchool,
      major: wizardFormData.major,
      school: wizardFormData.school,
      isInternational: wizardFormData.isInternational.toLowerCase() === "yes",
      degree: wizardFormData.degree,
      currentExperience: wizardFormData.currentExperience,
      additionalContext: wizardFormData.additionalContext,
      tasks,
      updates: [],
      createdAt: new Date().toISOString(),
    };

    setRoadmaps((prev) => [newRoadmap, ...prev]);
    setCurrentRoadmapId(newRoadmap.id);
    setWizardFormData(defaultWizardFormData);

    return newRoadmap.id;
  };

  // Future: Wizard autopopulate would pull from DB/auth user profile.
  // Current: Pre-fill from the most recent roadmap when starting a new wizard.
  const prefillWizardFromLastRoadmap = () => {
    if (roadmaps.length > 0) {
      const last = roadmaps[0];
      setWizardFormData({
        yearInSchool: last.yearInSchool,
        major: last.major,
        school: last.school,
        isInternational: last.isInternational ? "Yes" : "No",
        degree: last.degree,
        currentExperience: last.currentExperience,
        goal: "",
        additionalContext: "",
      });
    }
  };

  const setCurrentRoadmap = (id: string) => {
    setCurrentRoadmapId(id);
  };

  const completeTask = (taskId: string, evidence: string) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;

        const taskIndex = roadmap.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return roadmap;

        const updatedTasks = roadmap.tasks.map((task, index) => {
          if (task.id === taskId) {
            return { ...task, status: "completed" as TaskStatus, completionEvidence: evidence };
          }
          if (index === taskIndex + 1 && task.status === "locked") {
            return { ...task, status: "unlocked" as TaskStatus };
          }
          return task;
        });

        return { ...roadmap, tasks: updatedTasks };
      })
    );
  };

  const addProgressUpdate = (content: string) => {
    if (!content.trim()) return;

    const triggers = detectAdaptiveKeywords(content);

    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;

        let adaptiveAction: string | undefined;
        let updatedTasks = [...roadmap.tasks];

        // Future: AI would analyze the full update context and generate personalized follow-up tasks.
        // Current: Keyword matching adds relevant pre-built follow-up tasks.
        const existingIds = new Set(updatedTasks.map((t) => t.id));
        for (const trigger of triggers) {
          const adaptiveTemplate = ADAPTIVE_TASKS[trigger];
          if (adaptiveTemplate) {
            const adaptiveId = `adaptive-${trigger}-${Date.now()}`;
            if (!existingIds.has(adaptiveId)) {
              const lastCompletedIdx = updatedTasks.reduce((max, t, i) => (t.status === "completed" ? i : max), -1);
              const insertIdx = lastCompletedIdx + 2;

              const newTask: Task = {
                ...adaptiveTemplate,
                id: adaptiveId,
                status: "unlocked" as TaskStatus,
                completionEvidence: undefined,
              };

              updatedTasks.splice(Math.min(insertIdx, updatedTasks.length), 0, newTask);
              adaptiveAction = (adaptiveAction ? adaptiveAction + "; " : "") + `Added task: "${adaptiveTemplate.title}"`;
            }
          }
        }

        const update: ProgressUpdate = {
          id: `update-${Date.now()}`,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          adaptiveAction,
        };

        return {
          ...roadmap,
          tasks: updatedTasks,
          updates: [update, ...roadmap.updates],
        };
      })
    );
  };

  return (
    <RoadmapContext.Provider
      value={{
        roadmaps,
        currentRoadmap,
        wizardFormData,
        updateWizardFormData,
        createRoadmap,
        setCurrentRoadmap,
        completeTask,
        addProgressUpdate,
        prefillWizardFromLastRoadmap,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
}
