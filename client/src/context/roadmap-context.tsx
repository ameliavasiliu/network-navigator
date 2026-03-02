import * as React from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Subtask {
  id: string;
  label: string;
  completed: boolean;
}

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

export interface AITemplate {
  label: string;
  templateId: string;
  confirmationLabel: string;
}

export interface StudentProfile {
  name: string;
  school: string;
  degree: string;
  major: string;
  yearInSchool: string;
  goal: string;
  isInternational: boolean;
  currentExperience: string;
}

const templateGenerators: Record<string, (p: StudentProfile) => string> = {
  "ib-outreach": (p) => `Hi [Contact Name],\n\nI'm ${p.yearInSchool ? "a " + p.yearInSchool : "a student"} at ${p.school || "[Your School]"} studying ${p.major || "[Your Major]"}. I came across your profile and was really impressed by your path in investment banking${p.isInternational ? " — especially as a fellow international professional" : ""}.\n\nI'm very interested in pursuing a career in IB and would love to learn from your experience. Would you have 15 minutes for a brief call?\n\nThank you for your time,\n[Your Name]`,
  "ib-thankyou": (p) => `Subject: Thank you for your time\n\nHi [Contact Name],\n\nThank you so much for taking the time to speak with me today. I really appreciated hearing about your experience at [Firm], especially your insights on [specific topic discussed].\n\nAs a ${p.degree || ""} student at ${p.school || "[School]"} interested in ${p.goal || "investment banking"}, your perspective on [specific advice] was particularly valuable.\n\nI'll definitely follow your suggestion to [specific action item]. I'd love to stay in touch as I continue my preparation.\n\nBest regards,\n[Your Name]`,
  "consulting-outreach": (p) => `Hi [Contact Name],\n\nI'm ${p.yearInSchool ? "a " + p.yearInSchool : "a student"} at ${p.school || "[Your School]"} studying ${p.major || "[Your Major]"}. I noticed your path from ${p.school || "[School]"} to [Firm] and would love to learn more about your experience in consulting${p.isInternational ? ", especially as an international professional" : ""}.\n\nWould you have 20 minutes for a brief call? I'd really appreciate your perspective on [specific aspect of their work].\n\nThank you,\n[Your Name]`,
  "consulting-thankyou": (p) => `Subject: Thank you for your time\n\nHi [Contact Name],\n\nThank you for taking the time to speak with me about your experience at [Firm]. Your insights on [specific topic] were really valuable.\n\nAs a ${p.degree || ""} student at ${p.school || "[School]"} pursuing ${p.goal || "consulting"}, I found your advice about [specific point] particularly helpful. I plan to [specific action based on their advice].\n\nI'd love to stay in touch. Thank you again.\n\nBest,\n[Your Name]`,
  "marketing-outreach": (p) => `Hi [Contact Name],\n\nI'm ${p.yearInSchool ? "a " + p.yearInSchool : "a student"} at ${p.school || "[School]"} studying ${p.major || "[Major]"}, focused on ${p.goal || "marketing"}. I noticed your work at [Company] and was really interested in [specific campaign/product].\n\nWould you have 15 minutes to chat about your experience in marketing${p.isInternational ? " and any advice for international candidates" : ""}?\n\nThanks,\n[Your Name]`,
  "marketing-thankyou": (p) => `Subject: Great speaking with you today\n\nHi [Contact Name],\n\nThank you for taking the time to chat about your work at [Company]. Your perspective on [specific topic] was really insightful.\n\nI especially appreciated your advice about [specific point]. As a ${p.degree || ""} student at ${p.school || "[School]"} focused on ${p.goal || "marketing"}, that's exactly the kind of guidance I was looking for.\n\nI'll keep you posted on my progress. Thanks again!\n\nBest,\n[Your Name]`,
  "tech-outreach": (p) => `Hey [Contact Name],\n\nI'm ${p.yearInSchool ? "a " + p.yearInSchool : "a student"} at ${p.school || "[School]"} interested in product/tech roles. I saw you worked on [feature/product] at [Company] — I'd love to hear how your team approached [specific challenge].\n\nWould you have 15 minutes for a quick chat${p.isInternational ? "? I'm also curious about the experience as an international professional" : ""}?\n\nThanks!\n[Your Name]`,
  "tech-thankyou": (p) => `Hey [Contact Name],\n\nThanks so much for the chat! Your insights on [topic] were really helpful. I especially liked your point about [specific advice].\n\nAs I continue preparing for PM roles${p.isInternational ? " as an international student" : ""}, I'll definitely take your advice about [action item]. Would love to stay in touch!\n\nBest,\n[Your Name]`,
  "general-outreach": (p) => `Hi [Contact Name],\n\nI'm ${p.yearInSchool ? "a " + p.yearInSchool : "a student"} at ${p.school || "[School]"} studying ${p.major || "[Major]"}. I noticed your career path and would love to learn about your experience in [their field]${p.isInternational ? ", especially any advice for international professionals" : ""}.\n\nWould you have 15 minutes for a brief call?\n\nThank you,\n[Your Name]`,
  "general-thankyou": (p) => `Subject: Thank you for your time\n\nHi [Contact Name],\n\nThank you for speaking with me about your experience at [Company]. Your insights on [topic] were really valuable.\n\nAs a ${p.degree || ""} student at ${p.school || "[School]"} pursuing ${p.goal || "my career goals"}, your advice about [specific point] gives me a clear next step.\n\nI'd love to stay in touch as I continue my search.\n\nBest,\n[Your Name]`,
  "general-followup": (p) => `Hi [Contact Name],\n\nI hope you're doing well. I wanted to follow up on my previous message — I'm a ${p.yearInSchool || "student"} at ${p.school || "[School]"} and I'm really interested in learning about your experience in [their field].\n\nI know you're busy and I completely understand if the timing doesn't work. If you do have 15 minutes, I'd really appreciate it.\n\nThank you,\n[Your Name]`,
};

export function getTemplateText(templateId: string, profile: StudentProfile): string {
  const generator = templateGenerators[templateId];
  if (!generator) return "";
  return generator(profile);
}

export interface Task {
  id: string;
  title: string;
  objective: string;
  whyItMatters: string;
  subtasks: Subtask[];
  internationalConsiderations?: string;
  internationalConcern?: string;
  resources: TaskResource[];
  completionGate: CompletionGate;
  completionEvidence?: string;
  aiTemplate?: AITemplate;
  status: TaskStatus;
}

export type ContactAffiliation = "alumni" | "recruiter" | "referral" | "friend" | "other";

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  affiliation: ContactAffiliation;
  school: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  status: "identified" | "messaged" | "responded" | "call_completed" | "referral_requested";
  notes: string;
  lastInteractionDate: string;
}

export type SavedCompanyStatus = "considering" | "applied" | "interviewing" | "rejected" | "offer";

export interface SavedCompany {
  id: string;
  name: string;
  overview: string;
  careersUrl: string;
  status: SavedCompanyStatus;
  savedAt: string;
}

export interface CoachCheckIn {
  id: string;
  content: string;
  coachResponse: string;
  createdAt: string;
  adaptiveAction?: string;
}

export interface CompanyInfo {
  name: string;
  roleDescription: string;
  commonSkills: string[];
  jobPageUrl: string;
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
  contacts: Contact[];
  checkIns: CoachCheckIn[];
  companies: CompanyInfo[];
  savedCompanies: SavedCompany[];
  circumstanceUpdate: string;
  lastDailyRefresh: string;
  lastWeeklyRefresh: string;
  lastCompanyRefresh: string;
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

type TaskTemplate = Omit<Task, "id" | "status" | "completionEvidence" | "internationalConcern">;

function generateCoachMessage(eventType: string, context?: Record<string, string>): string {
  const messages: Record<string, string[]> = {
    task_completed: [
      "Great work completing that step. Every task you finish builds real momentum.",
      "That's one more thing done. You're making solid progress — keep going.",
      "Nice job. Completing tasks like this is exactly how careers get built.",
    ],
    checkin_received: [
      "Thanks for checking in. Let me look at what you shared and suggest next steps.",
      "Appreciate the update. Staying consistent like this makes a real difference.",
      "Good to hear from you. Let's figure out the best path forward.",
    ],
    rejection: [
      "Rejection is part of the process — every successful professional has been through it. What matters is what you do next.",
      "This doesn't define your trajectory. Many people who are thriving now got turned down multiple times early on. Keep moving forward.",
    ],
    no_response: [
      "Not hearing back is completely normal. Most people need a follow-up. Don't read too much into silence.",
      "Silence doesn't mean 'no.' Professionals are busy. A thoughtful follow-up often gets the response.",
    ],
    interview: [
      "An interview is a real achievement — it means your profile stood out. Now it's about preparation.",
      "That's exciting. Getting to the interview stage means you're doing something right. Let's make sure you're fully ready.",
    ],
    contact_added: [
      "Building your network one contact at a time. Every connection is a potential door.",
    ],
    general: [
      "You're doing the work. That alone puts you ahead of most people.",
    ],
  };
  const pool = messages[eventType] || messages.general;
  return pool[Math.floor(Math.random() * pool.length)];
}

const IB_TASKS: TaskTemplate[] = [
  {
    title: "Build Your IB Target List",
    objective: "Create a prioritized list of 10 banks with confirmed H-1B sponsorship history, organized by tier.",
    whyItMatters: "IB recruiting is hyper-structured with rigid timelines. A focused target list prevents wasted applications and lets you go deep on firms that actually hire international students.",
    subtasks: [
      { id: "ib1-1", label: "List all bulge bracket banks (Goldman Sachs, JPMorgan, Morgan Stanley, Bank of America, Citi, Barclays, UBS, Deutsche Bank)", completed: false },
      { id: "ib1-2", label: "Add elite boutiques (Evercore, Lazard, Centerview, PJT, Moelis)", completed: false },
      { id: "ib1-3", label: "Check each firm's H-1B sponsorship count on myvisajobs.com", completed: false },
      { id: "ib1-4", label: "Rank by: (1) sponsorship likelihood, (2) culture fit, (3) your competitive advantage", completed: false },
      { id: "ib1-5", label: "Mark application deadlines — many open August for the following summer", completed: false },
    ],
    internationalConsiderations: "In the US, it's normal and expected to be strategic about where you apply. Asking 'Does your firm sponsor H-1B visas?' is a standard question at info sessions — not rude or presumptuous. Sponsorship varies year to year — confirm during networking conversations.",
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
    subtasks: [
      { id: "ib2-1", label: "Download an IB resume template (single column, Times New Roman or Garamond, 10-11pt)", completed: false },
      { id: "ib2-2", label: "Move Education to the top — include GPA if above 3.5, SAT/GMAT if strong", completed: false },
      { id: "ib2-3", label: "Rewrite every bullet: lead with a strong verb, include a number, show the result", completed: false },
      { id: "ib2-4", label: "Remove all personal pronouns (I, my, we)", completed: false },
      { id: "ib2-5", label: "Have 2 people in finance review it — use your school's career center", completed: false },
    ],
    internationalConsiderations: "American resumes never include photos, date of birth, nationality, or marital status. This is different from many countries. Also, it's 'resume' — never 'CV' in US IB recruiting.",
    resources: [
      { title: "M&I Free Resume Template", url: "https://www.mergersandinquisitions.com/investment-banking-resume-template/" },
      { title: "WSO Resume Review Forum", url: "https://www.wallstreetoasis.com/forums/investment-banking-resume-template-and-guide" },
    ],
    completionGate: { type: "confirm", prompt: "Confirm: My resume is 1 page, uses the X-by-Y-resulting-in-Z format, and has been reviewed by at least 1 person in finance." },
  },
  {
    title: "Alumni Research & Outreach Planning",
    objective: "Research your school's alumni network on LinkedIn to identify 5 IB professionals to contact, recording common skills and career patterns.",
    whyItMatters: "Over 70% of IB offers involve a referral. Structured alumni research gives you warm leads and insider knowledge about which firms to target.",
    subtasks: [
      { id: "ib3-1", label: "Go to LinkedIn → your school page → Alumni tab", completed: false },
      { id: "ib3-2", label: "Filter by Financial Services + your target geography", completed: false },
      { id: "ib3-3", label: "Identify 3 common skills listed on alumni profiles", completed: false },
      { id: "ib3-4", label: "Note 3 career path patterns (e.g., Analyst → Associate → VP)", completed: false },
      { id: "ib3-5", label: "Select 5 alumni to contact — prioritize those who share your background", completed: false },
    ],
    internationalConsiderations: "When reaching out to alumni from your country who now work in US IB, it's perfectly fine to mention your shared background. However, keep the message professional — don't lead with nationality, lead with genuine interest in their career path.",
    resources: [
      { title: "LinkedIn Alumni Search Guide", url: "https://www.linkedin.com/help/linkedin/answer/a507508" },
    ],
    completionGate: { type: "text", prompt: "List your 5 alumni contacts with their firm and role:", placeholder: "e.g., Sarah K. (Analyst, Goldman Sachs), David L. (Associate, Evercore)..." },
  },
  {
    title: "Send 5 Cold Outreach Messages",
    objective: "Send 5 personalized LinkedIn messages to analysts/associates at your target banks and get at least 2 responses.",
    whyItMatters: "Cold outreach is uncomfortable but it's the single highest-ROI activity for breaking into banking as an international student.",
    subtasks: [
      { id: "ib4-1", label: "Write a message under 100 words: introduce yourself, mention shared connection, ask for 15 minutes", completed: false },
      { id: "ib4-2", label: "Send between Tuesday-Thursday, 9-11am their time zone", completed: false },
      { id: "ib4-3", label: "Send to all 5 contacts from your alumni research", completed: false },
      { id: "ib4-4", label: "If no response after 5 business days, send one polite follow-up", completed: false },
      { id: "ib4-5", label: "Log every outreach in your contact tracker", completed: false },
    ],
    internationalConsiderations: "In the US, asking someone senior for 'a quick coffee chat' or '15 minutes of your time' is completely normal and expected. You're not being a burden — networking is how the system works. Always end with a specific ask, not an open-ended 'let me know if you're free.'",
    resources: [
      { title: "Cold Email Template for IB", url: "https://www.wallstreetoasis.com/forums/networking-email-template-for-investment-banking" },
    ],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "ib-outreach",
      confirmationLabel: "I have sent this message.",
    },
    completionGate: { type: "text", prompt: "Paste one of the outreach messages you sent (anonymize if you prefer):", placeholder: "Hi [Name], I'm a [year] at [school] studying [major]..." },
  },
  {
    title: "Complete 2 Informational Interviews",
    objective: "Conduct 2 phone/video calls with IB professionals and document key insights from each.",
    whyItMatters: "Info interviews give you insider knowledge about firm culture, recent deals, and recruiting timelines that you can't get from websites. They also build relationships that lead to referrals.",
    subtasks: [
      { id: "ib5-1", label: "Prepare 5 questions for each call", completed: false },
      { id: "ib5-2", label: "Start with small talk — be respectful of their time", completed: false },
      { id: "ib5-3", label: "Listen more than speak during the call", completed: false },
      { id: "ib5-4", label: "Do NOT directly ask for a job during the call", completed: false },
      { id: "ib5-5", label: "Take notes during the call", completed: false },
      { id: "ib5-6", label: "Send a thank-you email within 24 hours referencing something specific they said", completed: false },
      { id: "ib5-7", label: "Log 3 insights from each call", completed: false },
      { id: "ib5-8", label: "Add contacts to your tracker with follow-up date (6-8 weeks later)", completed: false },
    ],
    internationalConsiderations: "Americans expect prompt thank-you notes. Within 24 hours is the standard. Reference a specific thing they said — 'Your point about the M&A market in healthcare was really helpful.' This shows you were listening, not just collecting contacts.",
    resources: [
      { title: "Informational Interview Question Bank", url: "https://www.mergersandinquisitions.com/investment-banking-informational-interview/" },
    ],
    aiTemplate: {
      label: "Post-Call Thank You Email",
      templateId: "ib-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    completionGate: { type: "text", prompt: "Enter the names and firms of the 2 people you spoke with:", placeholder: "e.g., Sarah K. at Goldman Sachs, David L. at Evercore" },
  },
  {
    title: "Master the IB Technical Interview",
    objective: "Be able to answer the top 20 IB technical questions (accounting, valuation, DCF, merger model) without hesitation.",
    whyItMatters: "Technical questions are binary pass/fail. If you can't walk through a DCF or explain the 3 financial statements, the interview ends regardless of your networking.",
    subtasks: [
      { id: "ib6-1", label: "Memorize the 3-statement model flow and how changes cascade", completed: false },
      { id: "ib6-2", label: "Practice walking through a DCF out loud (UFCF → discount → terminal value → enterprise value → equity value)", completed: false },
      { id: "ib6-3", label: "Learn the top 3 valuation methodologies and when to use each", completed: false },
      { id: "ib6-4", label: "Study 5 recent deals at your target banks — know the deal size, rationale, and outcome", completed: false },
      { id: "ib6-5", label: "Do at least 3 mock technicals with a partner timing you", completed: false },
    ],
    internationalConsiderations: "In US interviews, saying 'I don't know' is far better than guessing or rambling. Interviewers respect intellectual honesty. You can say: 'I'm not sure about that specific point, but here's how I'd think about it...'",
    resources: [
      { title: "400 IB Interview Questions (WSP)", url: "https://www.wallstreetprep.com/knowledge/investment-banking-interview-questions/" },
      { title: "M&I Technical Question Guide", url: "https://www.mergersandinquisitions.com/investment-banking-interview-questions-and-answers/" },
    ],
    completionGate: { type: "number", prompt: "How many mock technical interviews have you completed?", placeholder: "e.g., 3" },
  },
  {
    title: "Submit 5 Applications with Referrals",
    objective: "Apply to summer analyst programs at 5+ target banks before their early deadlines.",
    whyItMatters: "IB recruiting follows a strict calendar. Many banks review on a rolling basis — applying in the first 2 weeks dramatically increases your odds.",
    subtasks: [
      { id: "ib7-1", label: "Create accounts on each bank's career portal before deadlines", completed: false },
      { id: "ib7-2", label: "Ask your info interview contacts if they'd submit a referral (do this BEFORE you apply)", completed: false },
      { id: "ib7-3", label: "Tailor your cover letter for each bank: mention specific deals, people you spoke with", completed: false },
      { id: "ib7-4", label: "Submit applications in the first week the portal opens", completed: false },
      { id: "ib7-5", label: "Track every application in your contact tracker", completed: false },
    ],
    internationalConsiderations: "Asking someone to refer you is normal in the US — it actually helps them too (many banks pay referral bonuses). Frame it as: 'Would you be comfortable submitting a referral for me? I completely understand if the timing doesn't work.'",
    resources: [],
    completionGate: { type: "text", prompt: "List the banks you applied to and the dates:", placeholder: "e.g., Goldman Sachs (Aug 15), Morgan Stanley (Aug 20)..." },
  },
];

const CONSULTING_TASKS: TaskTemplate[] = [
  {
    title: "Build Your Consulting Target List",
    objective: "Create a tiered list of 10 consulting firms organized by: MBB, Big 4, specialty/boutique, with H-1B sponsorship status.",
    whyItMatters: "Consulting recruiting is relationship-driven with firm-specific timelines. A tiered list lets you allocate energy strategically.",
    subtasks: [
      { id: "c1-1", label: "List MBB firms: McKinsey, BCG, Bain", completed: false },
      { id: "c1-2", label: "Add Big 4 consulting arms: Deloitte S&O, EY-Parthenon, KPMG Strategy, PwC Strategy&", completed: false },
      { id: "c1-3", label: "Include 3-4 boutiques aligned to your interests (LEK, Oliver Wyman, A.T. Kearney, Roland Berger)", completed: false },
      { id: "c1-4", label: "Verify H-1B sponsorship for each on myvisajobs.com", completed: false },
      { id: "c1-5", label: "Note application timelines — many open September for the following year", completed: false },
    ],
    internationalConsiderations: "Consulting firms in the US value 'fit' heavily. This means they want people who are genuinely curious, collaborative, and enjoyable to work with. In networking calls, show authentic enthusiasm — Americans can sense scripted responses. Sponsorship varies year to year — confirm during networking conversations.",
    resources: [
      { title: "Vault Consulting Rankings", url: "https://www.vault.com/best-companies-to-work-for/consulting" },
      { title: "H-1B Sponsorship Data", url: "https://www.myvisajobs.com" },
      { title: "Management Consulted Firm Guide", url: "https://managementconsulted.com/consulting-firms/" },
    ],
    completionGate: { type: "text", prompt: "List your top 5 target firms with their tier (MBB/Big4/Boutique):", placeholder: "e.g., McKinsey (MBB), Deloitte S&O (Big4), LEK (Boutique)..." },
  },
  {
    title: "Craft Your Consulting Resume",
    objective: "Produce a consulting-formatted resume where every bullet follows the 'impact-first' structure.",
    whyItMatters: "Consulting resumes signal how you think. Structured bullets = structured thinker. Vague bullets = immediate reject.",
    subtasks: [
      { id: "c2-1", label: "Use a clean, single-column format — no graphics, no color", completed: false },
      { id: "c2-2", label: "Lead every bullet with a quantified result: 'Increased X by Y% through Z'", completed: false },
      { id: "c2-3", label: "Include leadership and teamwork examples — consulting is team-based", completed: false },
      { id: "c2-4", label: "Add a 'Personal' section with 2-3 distinctive interests", completed: false },
      { id: "c2-5", label: "Get 2 reviews: career services + someone in consulting", completed: false },
    ],
    internationalConsiderations: "Including distinctive personal interests on your resume (e.g., 'Competitive chess player' or 'Trained sushi chef') is expected at MBB firms. Choose interests that are genuinely unique — not 'reading' or 'travel.'",
    resources: [
      { title: "Management Consulted Resume Guide", url: "https://managementconsulted.com/consulting-resume/" },
    ],
    completionGate: { type: "confirm", prompt: "Confirm: Every bullet on my resume leads with a quantified result and has been reviewed by at least 1 person." },
  },
  {
    title: "Alumni Research & Connection Strategy",
    objective: "Research your school's consulting alumni on LinkedIn and identify 5 professionals to contact.",
    whyItMatters: "Consulting firms ask 'Why our firm?' in every interview. The only way to answer credibly is by talking to people who work there.",
    subtasks: [
      { id: "c3-1", label: "Go to LinkedIn → your school page → Alumni tab", completed: false },
      { id: "c3-2", label: "Filter by Management Consulting + your target geography", completed: false },
      { id: "c3-3", label: "Identify 3 common skills on alumni profiles", completed: false },
      { id: "c3-4", label: "Note 3 career path patterns (e.g., Analyst → Consultant → Engagement Manager)", completed: false },
      { id: "c3-5", label: "Select 5 alumni to contact", completed: false },
    ],
    internationalConsiderations: "The 'double opt-in' introduction is standard US business etiquette. When someone offers to connect you with a colleague, they'll ask permission first. Don't push for an immediate introduction.",
    resources: [
      { title: "Cold Outreach Template for Consulting", url: "https://managementconsulted.com/networking-in-consulting/" },
    ],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "consulting-outreach",
      confirmationLabel: "I have sent this message.",
    },
    completionGate: { type: "text", prompt: "List your 5 alumni contacts with firm and role:", placeholder: "e.g., Maria T. at McKinsey, James W. at BCG..." },
  },
  {
    title: "Conduct 3 Informational Interviews",
    objective: "Have 3 conversations with consultants and document firm-specific insights from each.",
    whyItMatters: "These conversations build referral relationships and give you 'Why our firm?' ammunition no website can provide.",
    subtasks: [
      { id: "c4-1", label: "Prepare 5 questions for each call, including firm-specific ones", completed: false },
      { id: "c4-2", label: "Start with small talk — be respectful of time", completed: false },
      { id: "c4-3", label: "Listen more than speak", completed: false },
      { id: "c4-4", label: "Do NOT ask for a job directly", completed: false },
      { id: "c4-5", label: "Take detailed notes during each call", completed: false },
      { id: "c4-6", label: "Send thank-you emails within 24 hours", completed: false },
      { id: "c4-7", label: "Log 3 insights learned from each call", completed: false },
      { id: "c4-8", label: "Ask: 'Is there anyone else you'd recommend I speak with?'", completed: false },
    ],
    internationalConsiderations: "Americans expect you to drive the conversation. Come with specific questions and a clear ask. At the end, ask: 'Would you be open to staying in touch as I progress in my search?'",
    resources: [],
    aiTemplate: {
      label: "Post-Call Thank You Email",
      templateId: "consulting-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    completionGate: { type: "text", prompt: "Enter the names and firms of the 3 people you spoke with:", placeholder: "e.g., Maria T. at McKinsey, James W. at BCG, Priya S. at Deloitte" },
  },
  {
    title: "Master Case Interview Fundamentals",
    objective: "Be able to structure and solve 3 different case types (profitability, market entry, M&A) in under 30 minutes each.",
    whyItMatters: "The case interview is THE gate to consulting. Top firms reject 80%+ of candidates at this stage.",
    subtasks: [
      { id: "c5-1", label: "Study the 4 core frameworks: profitability, market sizing, market entry, M&A", completed: false },
      { id: "c5-2", label: "Learn to build custom structures instead of forcing frameworks", completed: false },
      { id: "c5-3", label: "Practice 2 cases per week with a partner, alternating roles", completed: false },
      { id: "c5-4", label: "Record yourself and review — focus on structure, not just the right answer", completed: false },
      { id: "c5-5", label: "Do at least 1 practice case with someone currently in consulting", completed: false },
    ],
    internationalConsiderations: "In US case interviews, thinking out loud is essential. Silence makes interviewers uncomfortable. Say 'Let me take 30 seconds to structure my thoughts' — then walk through your logic step by step.",
    resources: [
      { title: "PrepLounge Case Library", url: "https://www.preplounge.com/en/management-consulting-cases" },
      { title: "Case in Point (Book)", url: "https://www.amazon.com/Case-Point-Complete-Interview-Preparation/dp/0986370711" },
      { title: "Victor Cheng's LOMS", url: "https://www.caseinterview.com/loms" },
    ],
    completionGate: { type: "number", prompt: "How many practice cases have you completed with a partner?", placeholder: "e.g., 6" },
  },
  {
    title: "Attend 2 Firm Events & Apply",
    objective: "Attend 2 firm-hosted events and submit applications to 5 consulting firms.",
    whyItMatters: "Firms track attendance. Being seen at events signals genuine interest. Applying with referrals from those events dramatically increases your chances.",
    subtasks: [
      { id: "c6-1", label: "Check your school's career center for upcoming consulting events", completed: false },
      { id: "c6-2", label: "Prepare 2-3 thoughtful questions for each event", completed: false },
      { id: "c6-3", label: "Introduce yourself to at least 1 person and exchange contact info", completed: false },
      { id: "c6-4", label: "Send follow-up emails within 48 hours", completed: false },
      { id: "c6-5", label: "Ask your contacts to submit referrals before applying", completed: false },
      { id: "c6-6", label: "Submit tailored applications to 5 firms", completed: false },
    ],
    internationalConsiderations: "At US networking events, the standard greeting is a firm handshake, eye contact, and 'Hi, I'm [first name].' Have your 15-second elevator pitch ready. End with a question to them, not a monologue.",
    resources: [],
    completionGate: { type: "text", prompt: "Which events did you attend and which firms did you apply to?", placeholder: "e.g., BCG coffee chat — spoke with Associate Director Lisa M. Applied to McKinsey, BCG, Bain, Deloitte, LEK." },
  },
];

const MARKETING_TASKS: TaskTemplate[] = [
  {
    title: "Define Your Marketing Specialization",
    objective: "Choose a marketing focus area (brand, digital/growth, product marketing, analytics) and identify 8 target companies.",
    whyItMatters: "Marketing is broad — companies hire for specific functions. Clarity on your specialization lets you build relevant skills and tell a coherent story.",
    subtasks: [
      { id: "m1-1", label: "Research the major marketing functions: brand management, growth marketing, product marketing, analytics", completed: false },
      { id: "m1-2", label: "Identify which aligns with your strengths: creative → brand, data → growth, tech → PMM", completed: false },
      { id: "m1-3", label: "List 8 companies known for your chosen function", completed: false },
      { id: "m1-4", label: "Verify H-1B sponsorship for each company", completed: false },
      { id: "m1-5", label: "Note recruiting timelines — CPG recruits Sept-Nov, tech is more rolling", completed: false },
    ],
    internationalConsiderations: "Marketing professionals in the US are expected to have strong opinions backed by data. Saying 'I noticed your brand's Instagram engagement dropped 15% after the campaign pivot — here's what I'd test' shows initiative, not arrogance. Sponsorship varies year to year — confirm during networking conversations.",
    resources: [
      { title: "AMA Career Paths in Marketing", url: "https://www.ama.org/marketing-career-paths/" },
      { title: "Marketing Career Guide", url: "https://www.hubspot.com/marketing-careers" },
    ],
    completionGate: { type: "text", prompt: "What's your chosen specialization and your top 3 target companies?", placeholder: "e.g., Growth Marketing — Google, Airbnb, Spotify" },
  },
  {
    title: "Build a Marketing Portfolio Piece",
    objective: "Create 1 tangible marketing artifact — a campaign analysis, growth audit, or brand teardown — that demonstrates your skills.",
    whyItMatters: "Marketing hiring managers care about what you can DO. A concrete portfolio piece gives you something to discuss that 90% of candidates don't have.",
    subtasks: [
      { id: "m2-1", label: "Choose a format: brand audit, growth channel analysis, social media proposal, or competitive study", completed: false },
      { id: "m2-2", label: "Use real data: SimilarWeb, social analytics, earnings calls", completed: false },
      { id: "m2-3", label: "Structure professionally: executive summary, analysis, recommendations, expected impact", completed: false },
      { id: "m2-4", label: "Keep to 5-8 slides or a 2-page document", completed: false },
      { id: "m2-5", label: "Get feedback from a marketing professor or professional", completed: false },
    ],
    internationalConsiderations: "American employers value initiative and 'showing, not telling.' Creating a portfolio piece on your own — without being asked — signals exactly the kind of proactive mindset US companies want.",
    resources: [
      { title: "SimilarWeb (Free Tier)", url: "https://www.similarweb.com" },
      { title: "How to Build a Marketing Portfolio", url: "https://www.hubspot.com/marketing-portfolio-examples" },
    ],
    completionGate: { type: "text", prompt: "Describe the portfolio piece you created (topic, format, key finding):", placeholder: "e.g., Growth channel audit for Duolingo..." },
  },
  {
    title: "Alumni Research & Networking Outreach",
    objective: "Identify 5 marketing alumni and send personalized outreach to schedule informational interviews.",
    whyItMatters: "What a 'Brand Manager' does at P&G is completely different from at Google. Only insiders can explain these nuances.",
    subtasks: [
      { id: "m3-1", label: "Go to LinkedIn → your school page → Alumni tab → filter by Marketing", completed: false },
      { id: "m3-2", label: "Identify 3 common skills and 3 career path patterns", completed: false },
      { id: "m3-3", label: "Select 5 alumni to contact", completed: false },
      { id: "m3-4", label: "Send concise messages mentioning something specific about their work", completed: false },
      { id: "m3-5", label: "Log all outreach in your contact tracker", completed: false },
    ],
    internationalConsiderations: "In US marketing culture, personal branding matters. Your LinkedIn should be polished: professional photo, headline that says what you want to do, and 2-3 posts showing marketing thinking.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "marketing-outreach",
      confirmationLabel: "I have sent this message.",
    },
    completionGate: { type: "text", prompt: "Who did you reach out to and what's the most useful thing you learned?", placeholder: "e.g., Spoke with Ana R. (Brand Manager at P&G)..." },
  },
  {
    title: "Conduct 3 Informational Interviews",
    objective: "Have 3 conversations with marketing professionals and document firm-specific insights.",
    whyItMatters: "Marketing roles vary enormously by company. These conversations give you insider knowledge and referral relationships.",
    subtasks: [
      { id: "m4-1", label: "Prepare 5 questions for each call including questions about day-to-day work", completed: false },
      { id: "m4-2", label: "Start with small talk — be respectful of time", completed: false },
      { id: "m4-3", label: "Listen more than speak", completed: false },
      { id: "m4-4", label: "Bring up your portfolio piece naturally and ask for feedback", completed: false },
      { id: "m4-5", label: "Send thank-you within 24 hours", completed: false },
      { id: "m4-6", label: "Log 3 insights from each call", completed: false },
      { id: "m4-7", label: "Stay in touch quarterly", completed: false },
    ],
    internationalConsiderations: "Americans value directness in professional settings. If you have a specific question about how international candidates are perceived or about visa sponsorship, it's fine to ask directly rather than hinting.",
    resources: [],
    aiTemplate: {
      label: "Post-Call Follow-Up Email",
      templateId: "marketing-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    completionGate: { type: "text", prompt: "Who did you speak with and what are the top insights?", placeholder: "e.g., Spoke with Ana R. (Brand Manager at P&G) — learned that MBA leadership projects matter more than marketing internships..." },
  },
  {
    title: "Learn Core Marketing Tools",
    objective: "Get hands-on experience with 3 industry-standard tools relevant to your specialization.",
    whyItMatters: "Marketing is increasingly technical. Saying 'I can run a Google Analytics funnel analysis' puts you ahead of candidates who only talk strategy.",
    subtasks: [
      { id: "m5-1", label: "Identify 3 tools used in your target roles (check job descriptions)", completed: false },
      { id: "m5-2", label: "Complete a free certification for each (Google Analytics, HubSpot Academy, Meta Blueprint)", completed: false },
      { id: "m5-3", label: "Apply each tool to a real project or your portfolio piece", completed: false },
      { id: "m5-4", label: "Add certifications to your LinkedIn and resume", completed: false },
    ],
    internationalConsiderations: "Free certifications carry real weight in US marketing hiring. Google Analytics, HubSpot, and Meta certifications are specifically looked for on resumes.",
    resources: [
      { title: "Google Analytics Academy", url: "https://analytics.google.com/analytics/academy/" },
      { title: "HubSpot Academy (Free)", url: "https://academy.hubspot.com" },
      { title: "Meta Blueprint", url: "https://www.facebookblueprint.com" },
    ],
    completionGate: { type: "text", prompt: "Which 3 tools/certifications did you complete?", placeholder: "e.g., Google Analytics Certification, HubSpot Inbound Marketing, SQL basics" },
  },
  {
    title: "Apply to 5 Marketing Roles",
    objective: "Submit tailored applications to 5 marketing positions with referrals where possible.",
    whyItMatters: "Marketing applications require customization. A generic cover letter gets filtered out.",
    subtasks: [
      { id: "m6-1", label: "Tailor each application: reference the company's recent campaigns or challenges", completed: false },
      { id: "m6-2", label: "Attach or link your portfolio piece where possible", completed: false },
      { id: "m6-3", label: "Ask networking contacts to submit referrals", completed: false },
      { id: "m6-4", label: "Apply through company career portal AND reach out to the hiring manager", completed: false },
      { id: "m6-5", label: "Track all applications in your contact tracker", completed: false },
    ],
    internationalConsiderations: "Following up on job applications is expected in the US. One week after applying, send a brief LinkedIn message to the recruiter expressing your continued interest.",
    resources: [],
    completionGate: { type: "text", prompt: "List the companies and roles you applied to:", placeholder: "e.g., Google (APM Intern), P&G (Brand Manager Intern), Spotify (Growth Marketing Analyst)..." },
  },
];

const PRODUCT_TECH_TASKS: TaskTemplate[] = [
  {
    title: "Define Your PM/Tech Target List",
    objective: "Create a list of 10 companies hiring for product or tech roles, verified for H-1B sponsorship.",
    whyItMatters: "Product and tech recruiting varies wildly by company size. FAANG has structured programs; startups hire ad-hoc.",
    subtasks: [
      { id: "t1-1", label: "Categorize: Big Tech (Google, Meta, Amazon), Growth-stage (Stripe, Notion, Figma), Enterprise (Salesforce, Adobe)", completed: false },
      { id: "t1-2", label: "Determine role type: PM, PMM, Software Engineer, Data/Analytics", completed: false },
      { id: "t1-3", label: "Verify H-1B sponsorship on each company's career page and myvisajobs.com", completed: false },
      { id: "t1-4", label: "Check Levels.fyi for compensation benchmarks and interview difficulty", completed: false },
      { id: "t1-5", label: "Note application windows — many big tech PM programs open July-September", completed: false },
    ],
    internationalConsiderations: "In US tech culture, titles matter less than impact. Nobody cares if you were a 'Vice President' at a university club — they care what you built, shipped, and measured. Sponsorship varies year to year — confirm during networking conversations.",
    resources: [
      { title: "Levels.fyi Compensation Data", url: "https://www.levels.fyi" },
      { title: "H-1B Sponsorship Lookup", url: "https://www.myvisajobs.com" },
    ],
    completionGate: { type: "text", prompt: "List your top 5 target companies and the specific role at each:", placeholder: "e.g., Google (APM), Stripe (PM Intern), Notion (Product Analyst)..." },
  },
  {
    title: "Build or Ship a Product Artifact",
    objective: "Create 1 concrete artifact: a product spec, feature teardown, or functional prototype.",
    whyItMatters: "PM and tech interviews test your ability to think through products. A real artifact is the strongest possible signal.",
    subtasks: [
      { id: "t2-1", label: "Choose format: PRD for a feature, competitive analysis, user research study, or prototype", completed: false },
      { id: "t2-2", label: "If building: use no-code tools (Figma, Replit, Notion) to create something functional", completed: false },
      { id: "t2-3", label: "If analyzing: pick a product, identify a problem, propose a solution with user flows", completed: false },
      { id: "t2-4", label: "Include metrics: how would you measure success? What's the target KPI?", completed: false },
      { id: "t2-5", label: "Get feedback from 1 PM or engineer before presenting", completed: false },
    ],
    internationalConsiderations: "US tech companies deeply value 'builder mentality.' Launching something imperfect is valued more than planning something perfect.",
    resources: [
      { title: "How to Write a Product Spec", url: "https://www.lennysnewsletter.com/p/how-to-write-a-product-spec" },
      { title: "Figma for Prototyping", url: "https://www.figma.com" },
    ],
    completionGate: { type: "text", prompt: "Describe what you built/analyzed and the key insight:", placeholder: "e.g., Wrote a PRD for a Notion templates marketplace..." },
  },
  {
    title: "Alumni Research & Networking",
    objective: "Research your school's tech alumni and identify 5 PMs or engineers to contact.",
    whyItMatters: "Product and engineering interviews test 'culture fit' and 'product sense.' Insiders teach you the vocabulary each company prizes.",
    subtasks: [
      { id: "t3-1", label: "Go to LinkedIn → your school → Alumni tab → filter by Technology/Product", completed: false },
      { id: "t3-2", label: "Identify 3 common skills and 3 career path patterns", completed: false },
      { id: "t3-3", label: "Select 5 alumni to contact", completed: false },
      { id: "t3-4", label: "Send short messages referencing a product decision their company made", completed: false },
      { id: "t3-5", label: "Log all outreach in contact tracker", completed: false },
    ],
    internationalConsiderations: "In US tech, networking is less formal than finance or consulting. It's common to connect over shared interests in products or side projects. Your outreach can be more casual.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "tech-outreach",
      confirmationLabel: "I have sent this message.",
    },
    completionGate: { type: "text", prompt: "List your 5 contacts with company and role:", placeholder: "e.g., Kevin L. (PM at Stripe), Lisa M. (SWE at Google)..." },
  },
  {
    title: "Conduct 3 Informational Interviews",
    objective: "Have 3 conversations with PMs or engineers at target companies.",
    whyItMatters: "These conversations teach you the vocabulary, frameworks, and values each company prizes — and build referral relationships.",
    subtasks: [
      { id: "t4-1", label: "Prepare 5 questions for each call about PM process, prioritization, what makes a great candidate", completed: false },
      { id: "t4-2", label: "Start with small talk — be respectful of time", completed: false },
      { id: "t4-3", label: "Listen more than speak", completed: false },
      { id: "t4-4", label: "Share your product artifact and ask for candid feedback", completed: false },
      { id: "t4-5", label: "Send thank-you within 24 hours", completed: false },
      { id: "t4-6", label: "Log 3 insights from each call", completed: false },
    ],
    internationalConsiderations: "US tech interviews expect you to ask clarifying questions before diving in. 'Just to make sure I'm aligned — are we designing for mobile or web? What's the primary user segment?' shows mature thinking.",
    resources: [],
    aiTemplate: {
      label: "Post-Call Follow-Up",
      templateId: "tech-thankyou",
      confirmationLabel: "I have sent the follow-up.",
    },
    completionGate: { type: "text", prompt: "Who did you speak with and what's the most useful insight?", placeholder: "e.g., Kevin L. (PM at Stripe) — data fluency valued over MBA credentials..." },
  },
  {
    title: "Prepare for Product/Tech Interviews",
    objective: "Be able to answer product design, estimation, and behavioral questions with structured frameworks.",
    whyItMatters: "PM interviews test structured thinking across multiple dimensions. You need reps in each area.",
    subtasks: [
      { id: "t5-1", label: "Study product design frameworks: user → problem → solution → prioritize → metrics", completed: false },
      { id: "t5-2", label: "Practice 3 estimation questions (market sizing, Fermi problems)", completed: false },
      { id: "t5-3", label: "Prepare 5 behavioral stories using STAR format", completed: false },
      { id: "t5-4", label: "For tech roles: review system design basics and coding fundamentals", completed: false },
      { id: "t5-5", label: "Do 2+ mock interviews with a PM or through Exponent", completed: false },
    ],
    internationalConsiderations: "Starting a product design question with clarifying questions shows mature product thinking, not uncertainty. Ask about user segment, platform, and constraints before diving in.",
    resources: [
      { title: "Exponent PM Interview Prep", url: "https://www.tryexponent.com" },
      { title: "Cracking the PM Interview (Book)", url: "https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818" },
    ],
    completionGate: { type: "number", prompt: "How many mock product interviews have you completed?", placeholder: "e.g., 3" },
  },
  {
    title: "Apply to 5 Product/Tech Roles",
    objective: "Submit tailored applications to 5 PM or tech roles with referrals where possible.",
    whyItMatters: "Referrals increase your interview rate by 5-10x at tech companies.",
    subtasks: [
      { id: "t6-1", label: "Ask networking contacts to submit referrals before applying", completed: false },
      { id: "t6-2", label: "Customize each application: reference the company's product, a recent launch", completed: false },
      { id: "t6-3", label: "Include a link to your product artifact or portfolio", completed: false },
      { id: "t6-4", label: "Apply on the company career page — avoid third-party job boards", completed: false },
      { id: "t6-5", label: "Track applications in your contact tracker", completed: false },
    ],
    internationalConsiderations: "In US tech, it's normal to apply to multiple companies simultaneously and openly discuss competing timelines. Be transparent: 'I'm currently interviewing at [X] and [Y] with a timeline of [date].'",
    resources: [],
    completionGate: { type: "text", prompt: "List the companies and roles you applied to:", placeholder: "e.g., Google (APM), Stripe (PM Intern), Notion (Product Analyst)..." },
  },
];

const GENERAL_TASKS: TaskTemplate[] = [
  {
    title: "Sharpen Your Career Goal Statement",
    objective: "Write a clear, specific career goal statement that names the role, industry, and type of company you're targeting.",
    whyItMatters: "People can only help you if they understand what you're looking for. A vague goal makes networking nearly impossible.",
    subtasks: [
      { id: "g1-1", label: "Complete: 'I want to work as a [role] at a [type of company] in [industry] because [reason]'", completed: false },
      { id: "g1-2", label: "Research 3-5 job descriptions for your target role — note required skills", completed: false },
      { id: "g1-3", label: "Identify 2-3 industries where your background gives you an advantage", completed: false },
      { id: "g1-4", label: "Validate your goal with 1-2 professionals", completed: false },
    ],
    internationalConsiderations: "In the US, specificity is valued over humility when discussing career goals. 'I want to be a product marketing manager at a B2B SaaS company' is much more effective than 'I'm open to anything.'",
    resources: [
      { title: "O*NET Career Explorer", url: "https://www.onetonline.org" },
    ],
    completionGate: { type: "text", prompt: "Write your career goal statement:", placeholder: "I want to work as a [role] at a [company type] in [industry] because..." },
  },
  {
    title: "Audit and Upgrade Your Resume",
    objective: "Produce a US-formatted resume where every bullet point leads with a quantified result.",
    whyItMatters: "Your resume is often your only first impression. In the US, a well-formatted resume with clear impact statements is table stakes.",
    subtasks: [
      { id: "g2-1", label: "Remove all photos, personal info, and references to age/nationality/marital status", completed: false },
      { id: "g2-2", label: "Keep to 1 page (2 pages only if 5+ years experience)", completed: false },
      { id: "g2-3", label: "Rewrite every bullet: lead with a verb, include a number, show the result", completed: false },
      { id: "g2-4", label: "Have 2 people review — at least one familiar with US resume conventions", completed: false },
    ],
    internationalConsiderations: "US resumes are significantly different from CVs used in Europe, Asia, and other regions. No photo. No personal details. No 'Objective' statement. Every bullet must answer: 'So what?'",
    resources: [
      { title: "Harvard Business School Resume Guide", url: "https://www.hbs.edu/recruiting/resources/Pages/resume-guidelines.aspx" },
    ],
    completionGate: { type: "confirm", prompt: "Confirm: My resume is 1 page, US-formatted, and has been reviewed by at least 1 person." },
  },
  {
    title: "Research 5 Target Companies",
    objective: "Create a researched list of 5 companies that match your goals, with visa sponsorship data and key contacts identified.",
    whyItMatters: "Targeted applications are 5x more effective than spray-and-pray.",
    subtasks: [
      { id: "g3-1", label: "List 5 companies based on role fit, industry interest, growth, and visa sponsorship", completed: false },
      { id: "g3-2", label: "Research each: recent news, funding, culture (Glassdoor), key leaders", completed: false },
      { id: "g3-3", label: "Identify 2-3 potential contacts at each company", completed: false },
      { id: "g3-4", label: "Note application deadlines and recruiting events", completed: false },
    ],
    internationalConsiderations: "When researching companies for visa sponsorship, use myvisajobs.com for H-1B data but remember that sponsorship varies year to year — always confirm during networking conversations.",
    resources: [
      { title: "Glassdoor Company Reviews", url: "https://www.glassdoor.com" },
      { title: "H-1B Sponsorship Data", url: "https://www.myvisajobs.com" },
    ],
    completionGate: { type: "text", prompt: "List your 5 target companies with one reason each:", placeholder: "e.g., Deloitte — strong strategy practice + confirmed H-1B sponsorship..." },
  },
  {
    title: "Alumni Research & Networking",
    objective: "Research your school's alumni on LinkedIn and identify 5 professionals in your target field to contact.",
    whyItMatters: "Networking is the #1 way jobs are filled in the US. Most roles are filled through connections before they're posted publicly.",
    subtasks: [
      { id: "g4-1", label: "Go to LinkedIn → your school → Alumni tab → filter by your target industry", completed: false },
      { id: "g4-2", label: "Identify 3 common skills and 3 career path patterns", completed: false },
      { id: "g4-3", label: "Select 5 alumni to contact", completed: false },
      { id: "g4-4", label: "Send personalized outreach (under 100 words) with a specific ask for 15-20 minutes", completed: false },
      { id: "g4-5", label: "Log all outreach in your contact tracker", completed: false },
    ],
    internationalConsiderations: "American professionals expect you to drive the conversation during informational interviews. Come with specific questions and a clear ask.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "general-outreach",
      confirmationLabel: "I have sent this message.",
    },
    completionGate: { type: "text", prompt: "Who did you reach out to (name and company)?", placeholder: "e.g., Sarah L. at Deloitte, Mike T. at Amazon..." },
  },
  {
    title: "Conduct 3 Informational Interviews",
    objective: "Have 3 conversations with professionals in your target field and document key insights.",
    whyItMatters: "These conversations give you insider knowledge, referral relationships, and the confidence to interview well.",
    subtasks: [
      { id: "g5-1", label: "Prepare 5 questions for each call focused on their career path and advice", completed: false },
      { id: "g5-2", label: "Start with small talk — be respectful of time", completed: false },
      { id: "g5-3", label: "Listen more than speak", completed: false },
      { id: "g5-4", label: "Do NOT directly ask for a job", completed: false },
      { id: "g5-5", label: "Send thank-you within 24 hours", completed: false },
      { id: "g5-6", label: "Log 3 insights from each call", completed: false },
      { id: "g5-7", label: "Follow up every 6-8 weeks with relevant updates", completed: false },
    ],
    internationalConsiderations: "It's completely acceptable to ask about visa sponsorship during networking calls. Frame it professionally: 'I want to be upfront — I'll need H-1B sponsorship. Does your firm typically sponsor for this role?'",
    resources: [],
    aiTemplate: {
      label: "Post-Call Thank You Email",
      templateId: "general-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    completionGate: { type: "text", prompt: "Who did you speak with and what did you learn?", placeholder: "e.g., Sarah L. at Deloitte — learned that..." },
  },
  {
    title: "Prepare Your Interview Toolkit",
    objective: "Have 5 polished behavioral stories (STAR), a 30-second elevator pitch, and answers to the top 5 common questions.",
    whyItMatters: "US interviews are behavioral-heavy. Without prepared stories, even strong candidates fumble under pressure.",
    subtasks: [
      { id: "g6-1", label: "Write 5 STAR stories: leadership, teamwork, failure/learning, initiative, analytical thinking", completed: false },
      { id: "g6-2", label: "Craft a 30-second elevator pitch: Present → Past → Future", completed: false },
      { id: "g6-3", label: "Prepare answers for top 5 common questions", completed: false },
      { id: "g6-4", label: "Practice out loud — record yourself and watch back", completed: false },
      { id: "g6-5", label: "Do 2 mock interviews with peers or career center", completed: false },
    ],
    internationalConsiderations: "The 'weakness' question is a test of self-awareness, not a trap. Choose a real weakness you've actively worked on and show growth.",
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

const ADAPTIVE_TASKS: Record<string, TaskTemplate> = {
  no_response: {
    title: "Follow-Up Strategy: No Responses",
    objective: "Revise and resend outreach to 3 contacts who haven't responded.",
    whyItMatters: "Most people don't respond to the first message. A thoughtful follow-up doubles your response rate.",
    subtasks: [
      { id: "a-nr-1", label: "Wait 5 business days after your initial message", completed: false },
      { id: "a-nr-2", label: "Send a brief, polite follow-up message", completed: false },
      { id: "a-nr-3", label: "If still no response after 2 attempts, move on", completed: false },
      { id: "a-nr-4", label: "Review your original message for improvements (too long? too generic?)", completed: false },
    ],
    internationalConsiderations: "One follow-up is expected and professional. Two is the maximum. Never send three. If someone doesn't respond after 2 attempts, they're politely declining.",
    resources: [],
    completionGate: { type: "text", prompt: "Paste your revised follow-up message:", placeholder: "Hi [Name], I wanted to follow up..." },
    aiTemplate: {
      label: "Follow-Up Message",
      templateId: "general-followup",
      confirmationLabel: "I have sent this follow-up.",
    },
  },
  interview: {
    title: "Interview Preparation Sprint",
    objective: "Complete targeted preparation for your upcoming interview.",
    whyItMatters: "Getting an interview is a major milestone. Focused preparation in the 48 hours before dramatically improves performance.",
    subtasks: [
      { id: "a-iv-1", label: "Research the company: latest news, product launches, key leaders", completed: false },
      { id: "a-iv-2", label: "Prepare 3 'Why this company?' points using info from networking calls", completed: false },
      { id: "a-iv-3", label: "Rehearse your 5 STAR stories adapted to the specific role", completed: false },
      { id: "a-iv-4", label: "Do 1 mock interview focused on this company", completed: false },
      { id: "a-iv-5", label: "Prepare 2-3 thoughtful questions to ask the interviewer", completed: false },
    ],
    internationalConsiderations: "In US interviews, asking questions at the end is mandatory. Never say 'No, I think you covered everything.' Ask about team culture, current challenges, or what success looks like in the first 90 days.",
    resources: [],
    completionGate: { type: "text", prompt: "What company is the interview with and what are your 3 'Why this company?' points?", placeholder: "e.g., McKinsey — (1) healthcare practice, (2) global model, (3) international track record" },
  },
  visa: {
    title: "Visa Strategy Checkpoint",
    objective: "Verify your visa timeline and confirm target companies sponsor H-1B.",
    whyItMatters: "Visa status is the #1 differentiator for international student job searches.",
    subtasks: [
      { id: "a-vs-1", label: "Confirm OPT eligibility and application timeline with international student office", completed: false },
      { id: "a-vs-2", label: "If in STEM, understand STEM OPT extension rules (24 additional months)", completed: false },
      { id: "a-vs-3", label: "Re-verify H-1B sponsorship for top 5 target companies", completed: false },
      { id: "a-vs-4", label: "Understand CPT rules if doing an internship before graduation", completed: false },
      { id: "a-vs-5", label: "Consider Plan B roles/companies if top choice doesn't sponsor", completed: false },
    ],
    internationalConsiderations: "It's completely acceptable to ask about visa sponsorship during networking calls and even early interviews. Frame it professionally: 'I want to be upfront — I'll need H-1B sponsorship. Does your firm typically sponsor for this role?'",
    resources: [
      { title: "USCIS OPT Information", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" },
    ],
    completionGate: { type: "text", prompt: "What's your visa status and timeline?", placeholder: "e.g., F-1 student, graduating May 2027, eligible for OPT + STEM extension" },
  },
  rejection: {
    title: "Process the Rejection and Pivot",
    objective: "Turn a rejection into actionable next steps.",
    whyItMatters: "Rejection is universal in job searching. How you respond determines whether it's a setback or a redirect.",
    subtasks: [
      { id: "a-rj-1", label: "Allow yourself 24 hours to be disappointed — then move forward", completed: false },
      { id: "a-rj-2", label: "Reply thanking them and asking for feedback", completed: false },
      { id: "a-rj-3", label: "Review: was it fit, skills gap, or timing?", completed: false },
      { id: "a-rj-4", label: "Identify 2 alternative companies or roles", completed: false },
      { id: "a-rj-5", label: "Reach out to your network with an update", completed: false },
    ],
    internationalConsiderations: "Asking for feedback after a rejection is professional and respected in the US. Most people don't do it, so you'll stand out.",
    resources: [],
    completionGate: { type: "text", prompt: "What did you learn and what's your next step?", placeholder: "e.g., Rejected from Goldman — feedback was to get more deal experience. Pivoting to mid-market banks..." },
  },
};

const COMPANY_DATABASE: Record<string, CompanyInfo[]> = {
  finance: [
    { name: "Goldman Sachs", roleDescription: "Investment Banking Analyst: Financial modeling, pitch books, due diligence for M&A and capital markets transactions.", commonSkills: ["Financial Modeling", "Valuation", "Excel/PowerPoint"], jobPageUrl: "https://www.goldmansachs.com/careers/" },
    { name: "JPMorgan Chase", roleDescription: "Investment Banking Analyst: Support deal execution across industry groups, build financial models, conduct market research.", commonSkills: ["DCF Analysis", "Accounting", "Financial Statements"], jobPageUrl: "https://careers.jpmorgan.com/" },
    { name: "Morgan Stanley", roleDescription: "Investment Banking Analyst: Advise clients on M&A, IPOs, and debt offerings. Build presentations and financial analyses.", commonSkills: ["M&A Analysis", "Capital Markets", "Industry Research"], jobPageUrl: "https://www.morganstanley.com/careers/" },
    { name: "Evercore", roleDescription: "Advisory Analyst: Independent advisory focused on M&A and restructuring. High deal exposure with lean teams.", commonSkills: ["Valuation", "Deal Execution", "LBO Modeling"], jobPageUrl: "https://www.evercore.com/careers/" },
    { name: "Lazard", roleDescription: "Financial Advisory Analyst: Cross-border M&A advisory and restructuring. Strong international exposure.", commonSkills: ["Cross-Border M&A", "Restructuring", "Financial Analysis"], jobPageUrl: "https://www.lazard.com/careers/" },
    { name: "Citi", roleDescription: "Investment Banking Analyst: Global banking operations with strong emerging markets presence.", commonSkills: ["Global Markets", "Risk Analysis", "Client Coverage"], jobPageUrl: "https://www.citigroup.com/careers/" },
  ],
  consulting: [
    { name: "McKinsey & Company", roleDescription: "Business Analyst/Associate: Solve complex business problems for Fortune 500 clients across industries.", commonSkills: ["Problem Structuring", "Data Analysis", "Stakeholder Communication"], jobPageUrl: "https://www.mckinsey.com/careers" },
    { name: "Boston Consulting Group", roleDescription: "Consultant/Associate: Strategy consulting with focus on implementation. Known for data-driven approach.", commonSkills: ["Case Problem Solving", "Quantitative Analysis", "Strategy Frameworks"], jobPageUrl: "https://careers.bcg.com/" },
    { name: "Bain & Company", roleDescription: "Associate Consultant: Results-oriented consulting focused on private equity and corporate strategy.", commonSkills: ["Private Equity Due Diligence", "Strategic Planning", "Client Management"], jobPageUrl: "https://www.bain.com/careers/" },
    { name: "Deloitte Strategy & Operations", roleDescription: "Consultant: Strategy, operations, and human capital consulting with strong global presence.", commonSkills: ["Operations Strategy", "Digital Transformation", "Change Management"], jobPageUrl: "https://www2.deloitte.com/careers" },
    { name: "EY-Parthenon", roleDescription: "Consultant: Strategy consulting arm of EY focused on corporate strategy and transaction advisory.", commonSkills: ["Transaction Advisory", "Market Assessment", "Growth Strategy"], jobPageUrl: "https://www.ey.com/en_us/careers" },
    { name: "Oliver Wyman", roleDescription: "Consultant: Specialty consulting with strong financial services and risk management practices.", commonSkills: ["Risk Management", "Financial Services", "Industry Specialization"], jobPageUrl: "https://www.oliverwyman.com/careers.html" },
  ],
  marketing: [
    { name: "Procter & Gamble", roleDescription: "Brand Manager: Own P&L for billion-dollar brands. Lead marketing strategy, innovation, and media planning.", commonSkills: ["Brand Strategy", "Consumer Insights", "P&L Management"], jobPageUrl: "https://www.pgcareers.com/" },
    { name: "Google", roleDescription: "Product Marketing Manager: Drive go-to-market strategy for Google products. Bridge engineering and business.", commonSkills: ["Go-to-Market Strategy", "Data Analysis", "Cross-Functional Leadership"], jobPageUrl: "https://careers.google.com/" },
    { name: "Unilever", roleDescription: "Brand Manager: Manage global brands across beauty, nutrition, and home care categories.", commonSkills: ["Brand Management", "Consumer Research", "Media Planning"], jobPageUrl: "https://careers.unilever.com/" },
    { name: "Meta", roleDescription: "Marketing Manager: Drive user acquisition and engagement strategies for Meta platforms.", commonSkills: ["Growth Marketing", "A/B Testing", "Performance Marketing"], jobPageUrl: "https://www.metacareers.com/" },
    { name: "HubSpot", roleDescription: "Product Marketing Manager: Position and launch SaaS products. Create content and enable sales teams.", commonSkills: ["SaaS Marketing", "Content Strategy", "Sales Enablement"], jobPageUrl: "https://www.hubspot.com/careers" },
    { name: "Spotify", roleDescription: "Growth Marketing Manager: Drive user acquisition and retention through data-driven marketing campaigns.", commonSkills: ["Growth Strategy", "User Acquisition", "Marketing Analytics"], jobPageUrl: "https://www.lifeatspotify.com/" },
  ],
  tech: [
    { name: "Google", roleDescription: "Associate Product Manager: Rotate across Google products, build product strategy, work with engineering teams.", commonSkills: ["Product Strategy", "Data Analysis", "User Research"], jobPageUrl: "https://careers.google.com/" },
    { name: "Meta", roleDescription: "Product Manager: Own product roadmap for Meta platforms. Define and drive product vision and execution.", commonSkills: ["Product Vision", "A/B Testing", "Cross-Functional Leadership"], jobPageUrl: "https://www.metacareers.com/" },
    { name: "Amazon", roleDescription: "Product Manager: Drive product decisions with 'working backwards' methodology. Focus on customer obsession.", commonSkills: ["Customer Obsession", "Data-Driven Decision Making", "Technical Communication"], jobPageUrl: "https://www.amazon.jobs/" },
    { name: "Stripe", roleDescription: "Product Manager: Build financial infrastructure products for millions of businesses worldwide.", commonSkills: ["Payments Infrastructure", "API Design", "Developer Experience"], jobPageUrl: "https://stripe.com/jobs" },
    { name: "Microsoft", roleDescription: "Product Manager: Drive product strategy across cloud, productivity, and enterprise platforms.", commonSkills: ["Enterprise Software", "Cloud Computing", "Product Roadmapping"], jobPageUrl: "https://careers.microsoft.com/" },
    { name: "Salesforce", roleDescription: "Product Manager: Build CRM and cloud platform features for enterprise customers.", commonSkills: ["CRM/SaaS", "Enterprise Workflows", "Platform Architecture"], jobPageUrl: "https://www.salesforce.com/company/careers/" },
    { name: "Notion", roleDescription: "Product Manager: Shape the future of collaborative workspace tools.", commonSkills: ["Productivity Tools", "User Experience", "Community-Led Growth"], jobPageUrl: "https://www.notion.so/careers" },
  ],
  general: [
    { name: "Deloitte", roleDescription: "Analyst/Associate: Advisory, audit, tax, or consulting across multiple practice areas.", commonSkills: ["Analytical Thinking", "Client Communication", "Problem Solving"], jobPageUrl: "https://www2.deloitte.com/careers" },
    { name: "Amazon", roleDescription: "Various roles including Operations, Finance, Marketing. Customer-obsessed culture with broad MBA hiring.", commonSkills: ["Leadership Principles", "Data Analysis", "Bias for Action"], jobPageUrl: "https://www.amazon.jobs/" },
    { name: "Google", roleDescription: "Business roles across strategy, operations, partnerships, and people operations.", commonSkills: ["Analytical Skills", "Cross-Functional Collaboration", "Strategic Thinking"], jobPageUrl: "https://careers.google.com/" },
    { name: "PwC", roleDescription: "Advisory and consulting roles across industries with strong international network.", commonSkills: ["Business Advisory", "Industry Research", "Stakeholder Management"], jobPageUrl: "https://www.pwc.com/careers" },
    { name: "Johnson & Johnson", roleDescription: "Various business roles in healthcare, consumer goods, and pharmaceuticals.", commonSkills: ["Healthcare Knowledge", "Marketing", "Operations"], jobPageUrl: "https://www.careers.jnj.com/" },
    { name: "Bank of America", roleDescription: "Various roles in consumer banking, wealth management, and corporate finance.", commonSkills: ["Financial Analysis", "Client Service", "Risk Management"], jobPageUrl: "https://campus.bankofamerica.com/" },
  ],
};

function detectGoalCategory(goal: string): string {
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

function isGoalSpecific(goal: string): boolean {
  const g = goal.toLowerCase();
  const specificKeywords = ["invest", "banking", "consult", "mckinsey", "bcg", "bain", "market", "brand", "product manager", "software engineer", "pm ", "analyst", "associate", "intern"];
  return specificKeywords.some(k => g.includes(k));
}

function generateTasks(goalCategory: string, goal: string): Task[] {
  let templates = TASK_TEMPLATES[goalCategory] || TASK_TEMPLATES.general;
  if (goalCategory === "general" && isGoalSpecific(goal)) {
    templates = templates.filter(t =>
      !t.title.toLowerCase().includes("clarify") &&
      !t.title.toLowerCase().includes("figure out") &&
      !t.title.toLowerCase().includes("explore") &&
      !t.title.toLowerCase().includes("discover")
    );
  }
  return templates.map((template, index) => ({
    ...template,
    id: `task-${index + 1}`,
    status: (index === 0 ? "unlocked" : "locked") as TaskStatus,
    completionEvidence: undefined,
    subtasks: template.subtasks.map(st => ({ ...st })),
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

function generateCoachResponse(content: string, triggers: string[]): string {
  let response = generateCoachMessage("checkin_received");
  if (triggers.length === 0) {
    response += "\n\nKeep doing what you're doing. Consistency is what separates people who break in from people who give up.";
    return response;
  }
  for (const trigger of triggers) {
    response += "\n\n" + generateCoachMessage(trigger);
  }
  return response;
}

interface RoadmapContextType {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  wizardFormData: WizardFormData;
  updateWizardFormData: (data: Partial<WizardFormData>) => void;
  createRoadmap: () => string;
  setCurrentRoadmap: (id: string) => void;
  completeTask: (taskId: string, evidence: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addCoachCheckIn: (content: string) => void;
  addContact: (contact: Omit<Contact, "id">) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  saveCompany: (company: Omit<SavedCompany, "id" | "savedAt">) => void;
  updateSavedCompany: (companyId: string, updates: Partial<SavedCompany>) => void;
  removeSavedCompany: (companyId: string) => void;
  updateCircumstances: (text: string) => void;
  getFollowUpSuggestions: () => Contact[];
  getDailyTask: () => Task | null;
  getWeeklyTask: () => Task | null;
  prefillWizardFromLastRoadmap: () => void;
  getStudentProfile: () => StudentProfile;
  isWizardComplete: () => boolean;
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
        const parsed = JSON.parse(stored);
        const migrated = parsed.map((r: any) => ({
          ...r,
          contacts: (r.contacts || []).map((c: any) => ({
            ...c,
            affiliation: c.affiliation || "other",
            school: c.school || "",
            email: c.email || "",
            phone: c.phone || "",
          })),
          checkIns: r.checkIns || [],
          companies: r.companies || [],
          savedCompanies: r.savedCompanies || [],
          circumstanceUpdate: r.circumstanceUpdate || "",
          lastDailyRefresh: r.lastDailyRefresh || new Date().toISOString(),
          lastWeeklyRefresh: r.lastWeeklyRefresh || new Date().toISOString(),
          lastCompanyRefresh: r.lastCompanyRefresh || new Date().toISOString(),
          tasks: (r.tasks || []).map((t: any) => ({
            ...t,
            subtasks: t.subtasks || (t.steps ? t.steps.map((s: string, i: number) => ({ id: `migrated-${i}`, label: s, completed: t.status === "completed" })) : []),
            internationalConsiderations: t.internationalConsiderations || t.culturalTip || undefined,
          })),
        }));
        setRoadmaps(migrated);
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

  const isWizardComplete = (): boolean => {
    return !!(
      wizardFormData.yearInSchool.trim() &&
      wizardFormData.major.trim() &&
      wizardFormData.school.trim() &&
      wizardFormData.isInternational.trim() &&
      wizardFormData.degree.trim() &&
      wizardFormData.currentExperience.trim() &&
      wizardFormData.goal.trim()
    );
  };

  const getStudentProfile = (): StudentProfile => {
    const rm = currentRoadmap;
    return {
      name: "[Your Name]",
      school: rm?.school || wizardFormData.school || "",
      degree: rm?.degree || wizardFormData.degree || "",
      major: rm?.major || wizardFormData.major || "",
      yearInSchool: rm?.yearInSchool || wizardFormData.yearInSchool || "",
      goal: rm?.goal || wizardFormData.goal || "",
      isInternational: rm?.isInternational ?? wizardFormData.isInternational.toLowerCase() === "yes",
      currentExperience: rm?.currentExperience || wizardFormData.currentExperience || "",
    };
  };

  const createRoadmap = (): string => {
    const goalCategory = detectGoalCategory(wizardFormData.goal);
    const tasks = generateTasks(goalCategory, wizardFormData.goal);
    const companies = COMPANY_DATABASE[goalCategory] || COMPANY_DATABASE.general;

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
      contacts: [],
      checkIns: [],
      companies,
      savedCompanies: [],
      circumstanceUpdate: "",
      lastDailyRefresh: new Date().toISOString(),
      lastWeeklyRefresh: new Date().toISOString(),
      lastCompanyRefresh: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setRoadmaps((prev) => [newRoadmap, ...prev]);
    setCurrentRoadmapId(newRoadmap.id);
    setWizardFormData(defaultWizardFormData);

    return newRoadmap.id;
  };

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

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        return {
          ...roadmap,
          tasks: roadmap.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            };
          }),
        };
      })
    );
  };

  const completeTask = (taskId: string, evidence: string) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;

        const taskIndex = roadmap.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return roadmap;

        const updatedTasks = roadmap.tasks.map((task, index) => {
          if (task.id === taskId) {
            return {
              ...task,
              status: "completed" as TaskStatus,
              completionEvidence: evidence,
              subtasks: task.subtasks.map((st) => ({ ...st, completed: true })),
            };
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

  const addCoachCheckIn = (content: string) => {
    if (!content.trim()) return;

    const triggers = detectAdaptiveKeywords(content);
    const coachResponse = generateCoachResponse(content, triggers);

    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;

        let adaptiveAction: string | undefined;
        let updatedTasks = [...roadmap.tasks];

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
                subtasks: adaptiveTemplate.subtasks.map(st => ({ ...st })),
              };

              updatedTasks.splice(Math.min(insertIdx, updatedTasks.length), 0, newTask);
              adaptiveAction = (adaptiveAction ? adaptiveAction + "; " : "") + `Added task: "${adaptiveTemplate.title}"`;
            }
          }
        }

        const checkIn: CoachCheckIn = {
          id: `checkin-${Date.now()}`,
          content: content.trim(),
          coachResponse,
          createdAt: new Date().toISOString(),
          adaptiveAction,
        };

        return {
          ...roadmap,
          tasks: updatedTasks,
          checkIns: [checkIn, ...roadmap.checkIns],
        };
      })
    );
  };

  const checkMilestoneUnlocks = (roadmap: Roadmap): Task[] => {
    const contactCount = roadmap.contacts.length;
    const callCount = roadmap.contacts.filter((c) =>
      c.status === "call_completed" || c.status === "referral_requested"
    ).length;
    const applicationCount = roadmap.savedCompanies.filter((c) =>
      ["applied", "interviewing", "offer"].includes(c.status)
    ).length;
    const interviewCount = roadmap.savedCompanies.filter((c) => c.status === "interviewing").length;

    let tasksChanged = false;
    const updatedTasks = roadmap.tasks.map((task, idx) => {
      if (task.status !== "locked") return task;
      const prevCompleted = idx === 0 || roadmap.tasks[idx - 1].status === "completed";
      if (prevCompleted) return task;

      const titleLower = task.title.toLowerCase();
      const objLower = task.objective.toLowerCase();
      const combined = titleLower + " " + objLower;

      let shouldUnlock = false;
      if (/outreach|cold|message|linkedin/i.test(combined) && contactCount >= 5) shouldUnlock = true;
      if (/informational|interview|call/i.test(combined) && callCount >= 2) shouldUnlock = true;
      if (/referral|refer/i.test(combined) && callCount >= 2 && contactCount >= 5) shouldUnlock = true;
      if (/apply|application/i.test(combined) && applicationCount >= 1) shouldUnlock = true;

      if (shouldUnlock) {
        tasksChanged = true;
        return { ...task, status: "unlocked" as TaskStatus };
      }
      return task;
    });

    return tasksChanged ? updatedTasks : roadmap.tasks;
  };

  const addContact = (contact: Omit<Contact, "id">) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        const newContact: Contact = {
          ...contact,
          id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        };
        const updated = { ...roadmap, contacts: [...roadmap.contacts, newContact] };
        updated.tasks = checkMilestoneUnlocks(updated);
        return updated;
      })
    );
  };

  const updateContact = (contactId: string, updates: Partial<Contact>) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        const updated = {
          ...roadmap,
          contacts: roadmap.contacts.map((c) =>
            c.id === contactId ? { ...c, ...updates } : c
          ),
        };
        updated.tasks = checkMilestoneUnlocks(updated);
        return updated;
      })
    );
  };

  const deleteContact = (contactId: string) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        return {
          ...roadmap,
          contacts: roadmap.contacts.filter((c) => c.id !== contactId),
        };
      })
    );
  };

  const saveCompany = (company: Omit<SavedCompany, "id" | "savedAt">) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        const newCompany: SavedCompany = {
          ...company,
          id: `saved-co-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          savedAt: new Date().toISOString(),
        };
        const updated = { ...roadmap, savedCompanies: [...roadmap.savedCompanies, newCompany] };
        updated.tasks = checkMilestoneUnlocks(updated);
        return updated;
      })
    );
  };

  const updateSavedCompany = (companyId: string, updates: Partial<SavedCompany>) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        const updated = {
          ...roadmap,
          savedCompanies: roadmap.savedCompanies.map((c) =>
            c.id === companyId ? { ...c, ...updates } : c
          ),
        };
        updated.tasks = checkMilestoneUnlocks(updated);
        return updated;
      })
    );
  };

  const removeSavedCompany = (companyId: string) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;
        return {
          ...roadmap,
          savedCompanies: roadmap.savedCompanies.filter((c) => c.id !== companyId),
        };
      })
    );
  };

  const updateCircumstances = (text: string) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id !== currentRoadmapId) return roadmap;

        const lower = text.toLowerCase();
        let adaptiveMessage = "";

        if (lower.includes("interview") && !lower.includes("rejected")) {
          adaptiveMessage = "Interview detected — adjusting your timeline and prioritizing preparation tasks. Focus on company research and behavioral prep.";
        } else if (lower.includes("offer")) {
          adaptiveMessage = "Congratulations on the offer! Your roadmap has been updated. Consider continuing networking to strengthen your professional foundation.";
        } else if (lower.includes("rejected") || lower.includes("rejection")) {
          adaptiveMessage = "Rejection is part of the process — every successful professional has faced it. Your roadmap has been adjusted to broaden your approach and increase outreach volume.";
        } else if (lower.includes("visa") || lower.includes("h-1b") || lower.includes("h1b") || lower.includes("opt") || lower.includes("cpt")) {
          adaptiveMessage = "Visa situation noted. Updating your targets to focus on companies with strong sponsorship track records. Check the Companies tab for updated recommendations.";
        } else if (lower.includes("behind") || lower.includes("slow") || lower.includes("delayed") || lower.includes("busy")) {
          adaptiveMessage = "No worries — consistency matters more than speed. Your timeline has been adjusted. Focus on completing one task at a time.";
        } else if (lower.includes("referral")) {
          adaptiveMessage = "A referral is a major milestone. Your roadmap has been updated to help you capitalize on this connection with proper follow-up.";
        } else if (lower.includes("no response") || lower.includes("ghosted") || lower.includes("didn't hear")) {
          adaptiveMessage = "Not hearing back is completely normal. Most professionals need a follow-up. Your tasks have been adjusted to include follow-up strategies.";
        } else {
          adaptiveMessage = "Got it — your roadmap trajectory has been updated based on your input. Keep moving forward one step at a time.";
        }

        const newCheckIn: CoachCheckIn = {
          id: Date.now().toString(),
          content: text,
          coachResponse: adaptiveMessage,
          createdAt: new Date().toISOString(),
          adaptiveAction: adaptiveMessage,
        };

        return {
          ...roadmap,
          circumstanceUpdate: text,
          checkIns: [newCheckIn, ...roadmap.checkIns],
        };
      })
    );
  };

  const getFollowUpSuggestions = (): Contact[] => {
    if (!currentRoadmap) return [];
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

    return currentRoadmap.contacts
      .filter((c) => {
        const lastDate = new Date(c.lastInteractionDate);
        return lastDate <= twoWeeksAgo && c.status !== "referral_requested";
      })
      .sort((a, b) => {
        let scoreA = 0, scoreB = 0;
        if (a.status === "responded" || a.status === "call_completed") scoreA += 3;
        if (b.status === "responded" || b.status === "call_completed") scoreB += 3;
        if (a.affiliation === "alumni" || a.affiliation === "referral") scoreA += 2;
        if (b.affiliation === "alumni" || b.affiliation === "referral") scoreB += 2;
        const dateA = new Date(a.lastInteractionDate);
        const dateB = new Date(b.lastInteractionDate);
        if (dateA <= threeWeeksAgo) scoreA += 1;
        if (dateB <= threeWeeksAgo) scoreB += 1;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  };

  const getDailyTask = (): Task | null => {
    if (!currentRoadmap) return null;
    const currentTask = currentRoadmap.tasks.find((t) => t.status === "unlocked");
    return currentTask || null;
  };

  const getWeeklyTask = (): Task | null => {
    if (!currentRoadmap) return null;
    const unlocked = currentRoadmap.tasks.filter((t) => t.status === "unlocked");
    return unlocked.length > 1 ? unlocked[1] : unlocked[0] || null;
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
        toggleSubtask,
        addCoachCheckIn,
        addContact,
        updateContact,
        deleteContact,
        saveCompany,
        updateSavedCompany,
        removeSavedCompany,
        updateCircumstances,
        getFollowUpSuggestions,
        getDailyTask,
        getWeeklyTask,
        prefillWizardFromLastRoadmap,
        getStudentProfile,
        isWizardComplete,
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
