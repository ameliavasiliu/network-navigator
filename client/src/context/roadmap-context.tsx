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

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Task {
  id: string;
  title: string;
  objective: string;
  whyItMatters: string;
  conceptCoaching: string;
  subtasks: Subtask[];
  internationalConsiderations?: string;
  internationalConcern?: string;
  resources: TaskResource[];
  completionGate: CompletionGate;
  completionEvidence?: string;
  aiTemplate?: AITemplate;
  practiceQuiz?: QuizQuestion[];
  reflectionPrompts?: string[];
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
type ConditionalTaskTemplate = TaskTemplate & { triggerCondition?: string };

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
    title: "Strategic Alumni Research for Investment Banking",
    objective: "Identify and research 10 alumni working in investment banking at your target firms. Map their career paths, note common skills, and select the 5 strongest outreach candidates.",
    whyItMatters: "Over 70% of investment banking offers involve a referral or warm introduction. Your alumni network is the single most valuable asset in your job search. Before you apply anywhere, before you touch your resume, you need to understand who can open doors for you.",
    conceptCoaching: "Here is something most students don't realize until it's too late: the investment banking job market does not work the way you think it does. You might assume the process is: write a great resume, apply online, get an interview, get an offer. That's how it works in theory. In practice, it works like this: identify people at target firms, build genuine relationships with them, have real conversations, earn their trust, get referred internally, interview with an advantage, and convert the offer.\n\nThis is not some secret trick — it's how the entire industry operates. Banks receive thousands of applications for a handful of spots. Recruiters rely on internal referrals to filter candidates because they trust their own people's judgment more than any resume screen. When a banker refers you, your application moves from the general pile to the top of the stack. In many cases, it bypasses the initial screen entirely.\n\nAs an international student, this matters even more. Sponsorship is a real cost and risk for firms. When someone inside the bank vouches for you, it significantly reduces the perceived risk. They're essentially saying: 'This person is worth the investment.' That's something no resume can do on its own.\n\nYour first step is research. Not sending messages yet — just understanding who is in your network and what their paths look like. This gives you the intelligence you need to write compelling, personalized outreach later. You're looking for patterns: what skills do IB professionals from your school have? What roles did they start in? Which firms hired from your program? This information shapes your entire strategy.\n\nThink of this like due diligence on your own career. You wouldn't invest without research, and you shouldn't job search without it either.",
    subtasks: [
      { id: "ib1-1", label: "Open LinkedIn and navigate to your school's page. Click the 'Alumni' tab at the top.", completed: false },
      { id: "ib1-2", label: "In the Alumni search, filter by 'Financial Services' industry and your target city (New York, San Francisco, Chicago, etc.)", completed: false },
      { id: "ib1-3", label: "Scroll through at least 30 alumni profiles. Note the companies that appear most frequently.", completed: false },
      { id: "ib1-4", label: "For each of 10 alumni, record: their name, current firm, current title, and how long they've been there", completed: false },
      { id: "ib1-5", label: "Identify 3 skills that appear across multiple profiles (e.g., Financial Modeling, Valuation, M&A)", completed: false },
      { id: "ib1-6", label: "Map 3 common career paths you see (e.g., Analyst 2 years → Associate → VP after 5+ years)", completed: false },
      { id: "ib1-7", label: "From your list of 10, select the 5 strongest outreach candidates — prioritize people who share your background, graduated recently, or are at your top-choice firms", completed: false },
      { id: "ib1-8", label: "Add all 5 selected alumni to your Contacts tab with status 'Identified' and their LinkedIn URL", completed: false },
    ],
    internationalConsiderations: "When reaching out to alumni from your country who now work in US IB, it's perfectly fine to mention your shared background. However, keep the message professional — don't lead with nationality, lead with genuine interest in their career path. Americans expect networking outreach — it's not pushy, it's professional.",
    resources: [
      { title: "LinkedIn Alumni Search Guide", url: "https://www.linkedin.com/help/linkedin/answer/a507508" },
      { title: "H-1B Sponsorship Lookup", url: "https://www.myvisajobs.com/Reports/Top-H1B-Visa-Sponsors.aspx" },
    ],
    practiceQuiz: [
      {
        question: "Why is alumni research the FIRST step in an IB job search, before even updating your resume?",
        options: [
          "Because resumes don't matter in banking",
          "Because understanding who can refer you shapes your entire strategy — referrals drive most IB hiring",
          "Because LinkedIn requires you to research before messaging",
          "Because recruiters check if you've viewed alumni profiles"
        ],
        correctIndex: 1,
        explanation: "Referrals are the primary driver of IB hiring. Research first so you know who to build relationships with and which firms to target."
      },
      {
        question: "When selecting alumni to contact, what should you prioritize?",
        options: [
          "The most senior person possible (Managing Directors only)",
          "Anyone who went to your school regardless of their role",
          "People who share your background, graduated recently, or work at your target firms",
          "Only people who have 'Open to Networking' on their profile"
        ],
        correctIndex: 2,
        explanation: "Recent graduates and people with shared backgrounds are more likely to respond and empathize with your situation. Senior MDs are typically too busy for cold outreach."
      }
    ],
    reflectionPrompts: [
      "What patterns did you notice in the career paths of alumni from your school?",
      "Were there any firms that appeared more frequently than you expected?",
      "What skills or experiences do you already have that match what you saw on alumni profiles?"
    ],
    completionGate: { type: "text", prompt: "List your 5 selected alumni contacts with their firm and role:", placeholder: "e.g., Sarah K. (Analyst, Goldman Sachs), David L. (Associate, Evercore)..." },
  },
  {
    title: "Send 5 Personalized Cold Outreach Messages",
    objective: "Draft and send 5 personalized LinkedIn connection requests or emails to your researched alumni. Aim for at least 2 responses.",
    whyItMatters: "Cold outreach is uncomfortable but it is the single highest-ROI activity for breaking into banking as an international student. Every conversation you have multiplies your chances.",
    conceptCoaching: "Let's talk about something that makes most international students uncomfortable: reaching out to strangers. If you grew up in a culture where approaching someone you don't know for professional help feels presumptuous or even rude, this is going to feel wrong. But here's what you need to understand about American professional culture: networking isn't just accepted — it's expected. It's how the system works.\n\nWhen you send a message to an alumnus at Goldman Sachs asking for 15 minutes of their time, you're not being a burden. You're doing exactly what every successful candidate does. In fact, many professionals enjoy helping students from their alma mater — it makes them feel valued and connected to their school community. Some firms even track employees' engagement with campus recruiting.\n\nThe key is HOW you reach out. A bad message is generic, long, and vague: 'Hi, I'm interested in finance, can you help me?' A good message is specific, brief, and asks for something small: 'Hi Sarah, I'm a first-year MBA at [School] focused on healthcare IB. I noticed you worked on the [Company] deal at Goldman — I'd love to hear about your experience. Would you have 15 minutes for a quick call this week or next?'\n\nNotice what this message does: it shows you've done your research (you know about a specific deal), it's personalized (you mention their name and firm), it asks for a small commitment (15 minutes), and it gives a timeframe (this week or next). This is professional, respectful, and effective.\n\nTiming matters too. Send messages Tuesday through Thursday, ideally between 9-11am in the recipient's time zone. Monday mornings are chaotic, and Friday afternoons people are mentally checked out. If someone doesn't respond within 5 business days, send ONE polite follow-up. After that, move on — silence is a polite 'not right now.'\n\nTrack everything. Every message you send, every response you get, every call you schedule — log it in your contact tracker. This isn't busywork; it's how you stay organized when you're managing 15-20 networking relationships simultaneously.",
    subtasks: [
      { id: "ib2-1", label: "Review each of your 5 alumni contacts' LinkedIn profiles one more time — note something specific about their career (a deal, a role transition, a shared interest)", completed: false },
      { id: "ib2-2", label: "Draft your first outreach message: keep it under 100 words, mention a specific detail about their career, introduce yourself in one sentence, and ask for exactly 15 minutes", completed: false },
      { id: "ib2-3", label: "Use the AI template generator below as a starting point, then personalize each message with the specific details you noted", completed: false },
      { id: "ib2-4", label: "Send all 5 messages between Tuesday-Thursday, 9-11am in the recipient's time zone", completed: false },
      { id: "ib2-5", label: "After sending each message, update the contact's status to 'Messaged' in your Contacts tab", completed: false },
      { id: "ib2-6", label: "Set a reminder: if no response after 5 business days, send one brief follow-up message", completed: false },
      { id: "ib2-7", label: "Log the date you sent each message in your contact notes", completed: false },
    ],
    internationalConsiderations: "In the US, asking someone senior for 'a quick coffee chat' or '15 minutes of your time' is completely normal and expected. You're not being a burden — networking is how the system works. Always end with a specific ask, not an open-ended 'let me know if you're free.' A specific ask respects their time and makes it easy to say yes.",
    resources: [
      { title: "Cold Email Template for IB (Wall Street Oasis)", url: "https://www.wallstreetoasis.com/forums/networking-email-template-for-investment-banking" },
    ],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "ib-outreach",
      confirmationLabel: "I have personalized and sent this message.",
    },
    practiceQuiz: [
      {
        question: "Why should you avoid directly asking for a job in your first networking message?",
        options: [
          "It's illegal to ask for jobs via LinkedIn",
          "It feels transactional and damages trust — people want to help those who are genuinely curious, not those who only want something",
          "Recruiters will flag your account",
          "It's better to apply online first"
        ],
        correctIndex: 1,
        explanation: "Networking is about building relationships. When you ask for a job in your first message, it signals that you only see this person as a means to an end. Instead, ask to learn from their experience."
      }
    ],
    reflectionPrompts: [
      "How did it feel to send cold messages? What was harder or easier than you expected?",
      "Looking at your 5 messages, which one do you think was strongest and why?",
      "What would you do differently in your next round of outreach?"
    ],
    completionGate: { type: "text", prompt: "Paste one of the outreach messages you sent (anonymize if you prefer):", placeholder: "Hi [Name], I'm a [year] at [school] studying [major]..." },
  },
  {
    title: "Complete 3 Informational Interviews & Deepen Relationships",
    objective: "Conduct 3 phone or video calls with IB professionals, document key insights from each, and send thank-you notes within 24 hours.",
    whyItMatters: "Informational interviews give you insider knowledge about firm culture, recent deals, and recruiting timelines that you cannot get from websites. More importantly, they build the relationships that lead to referrals.",
    conceptCoaching: "You've done the hard part — you sent messages and got responses. Now comes the part that actually changes your trajectory: real conversations with real people who work in the industry you want to break into.\n\nAn informational interview is not a job interview. It's a conversation where you're the one asking questions. Your goal is threefold: learn about the industry and firm, build a genuine relationship, and position yourself as someone worth remembering when referral opportunities come up.\n\nHere's how the best informational interviews go: You start with 2 minutes of small talk — 'How's your week going?' or 'I saw [Firm] just closed the [Deal] — must have been exciting.' Then you transition into your questions. You should have 5 prepared, but you probably won't get to all of them because good conversations flow naturally. Ask about their career path, what surprised them about the role, what they look for when referring candidates, and what advice they'd give someone in your position.\n\nCritical rules: Listen more than you speak. Take notes. Do NOT ask for a job or a referral during this call — that comes later, after you've built trust. At the end, ask two things: 'Is there anyone else you'd recommend I speak with?' (this expands your network exponentially) and 'Would you be open to staying in touch as I progress in my search?'\n\nWithin 24 hours — not 48, not 'sometime this week' — send a thank-you email. Reference something specific they said. This shows you were listening and separates you from the 90% of people who send generic thanks or no thanks at all.\n\nFinally, log everything. What you discussed, what you learned, when to follow up. Your contact tracker should become a living database of your professional relationships. Follow up 6-8 weeks later with a brief update on your progress. This keeps the relationship warm without being needy.",
    subtasks: [
      { id: "ib3-1", label: "For each scheduled call, research the person's firm: latest deals, industry focus, recent news", completed: false },
      { id: "ib3-2", label: "Prepare 5 questions for each call — include at least 1 firm-specific question (e.g., 'I saw [Firm] advised on the [Company] acquisition — what was that process like?')", completed: false },
      { id: "ib3-3", label: "During each call: start with small talk (2 min), then transition to your questions. Listen 70%, talk 30%.", completed: false },
      { id: "ib3-4", label: "Do NOT ask for a job or referral during the call. Instead ask: 'Is there anyone else you'd recommend I speak with?'", completed: false },
      { id: "ib3-5", label: "Take detailed notes during each call — key insights, advice given, names mentioned", completed: false },
      { id: "ib3-6", label: "Within 24 hours of each call, send a thank-you email referencing something specific they said", completed: false },
      { id: "ib3-7", label: "Log 3 specific insights from each call in your contact notes (e.g., 'Healthcare group is expanding', 'Look for SA apps in August')", completed: false },
      { id: "ib3-8", label: "Update each contact's status to 'Call Completed' in your Contacts tab and set a follow-up date 6-8 weeks out", completed: false },
    ],
    internationalConsiderations: "Americans expect prompt thank-you notes. Within 24 hours is the standard. Reference a specific thing they said — 'Your point about the M&A market in healthcare was really helpful.' This shows you were listening, not just collecting contacts. Asking about visa sponsorship is fine — frame it professionally: 'I want to be transparent — I'll need H-1B sponsorship. Does your firm typically sponsor?'",
    resources: [
      { title: "Informational Interview Question Bank", url: "https://www.mergersandinquisitions.com/investment-banking-informational-interview/" },
    ],
    aiTemplate: {
      label: "Post-Call Thank You Email",
      templateId: "ib-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    practiceQuiz: [
      {
        question: "During an informational interview, what percentage of the time should YOU be speaking?",
        options: [
          "70% — you should be pitching yourself",
          "50% — equal conversation",
          "30% — you should mostly be listening and asking questions",
          "10% — barely speak at all"
        ],
        correctIndex: 2,
        explanation: "The 70/30 rule: listen 70%, speak 30%. Your goal is to learn and build rapport, not to pitch yourself. People remember those who showed genuine interest."
      },
      {
        question: "When should you send a thank-you note after an informational interview?",
        options: [
          "Within 1 hour",
          "Within 24 hours",
          "Within 1 week",
          "Only if they asked you to follow up"
        ],
        correctIndex: 1,
        explanation: "Within 24 hours is the professional standard. Reference something specific from your conversation to show you were genuinely engaged."
      }
    ],
    reflectionPrompts: [
      "What was the most surprising thing you learned from your informational interviews?",
      "How did the conversations change your understanding of what investment banking actually involves?",
      "Did anyone mention a skill or experience you hadn't considered important before?"
    ],
    completionGate: { type: "text", prompt: "Enter the names and firms of the people you spoke with and one key insight from each:", placeholder: "e.g., Sarah K. at Goldman Sachs — healthcare group expanding; David L. at Evercore — SA apps open in August" },
  },
  {
    title: "Convert Relationships to Referrals",
    objective: "Ask 2-3 of your informational interview contacts if they would be willing to submit an internal referral for you. Secure at least 1 confirmed referral.",
    whyItMatters: "A referral transforms your application from anonymous to sponsored. At most banks, referred candidates are 5-10x more likely to get an interview. This is where your networking investment pays off.",
    conceptCoaching: "You've done the research. You've had the conversations. Now it's time for the ask — and this is where most students freeze up. They think asking for a referral is imposing, especially across cultures where directness feels uncomfortable. But here's what you need to know: in the American professional context, asking for a referral is completely normal. Many banks actually have formal referral programs with bonuses. When you ask someone to refer you, you're giving them an opportunity to help AND potentially benefit.\n\nTiming is everything. You should NOT ask for a referral during your first conversation. That's transactional. You ask after you've had at least one good conversation, sent a thoughtful thank-you, and ideally had a follow-up interaction. At that point, the person knows you and has a basis for recommending you.\n\nHere's how to frame it: 'I've really valued our conversations, and I'm planning to apply to [Firm] for the [Role]. Would you be comfortable submitting a referral for me? I completely understand if the timing doesn't work or if there's a policy consideration.' This framing is respectful, gives them an easy out, and shows you understand professional boundaries.\n\nImportant: ask for the referral BEFORE you submit your application. At most banks, the referral needs to be in the system before your application for it to be linked. If you apply first and ask for a referral after, it may not count.\n\nIf someone says no or hesitates, be gracious. Say 'I completely understand, thank you for considering it.' Then move on. Do not push. There are many paths to the same destination, and one declined referral doesn't close any doors.",
    subtasks: [
      { id: "ib4-1", label: "Review your informational interview contacts — identify 2-3 who seemed most engaged and supportive during your conversations", completed: false },
      { id: "ib4-2", label: "For each potential referrer, send a personalized message: reference your previous conversation, mention the specific role you're applying for, and ask if they'd be comfortable submitting a referral", completed: false },
      { id: "ib4-3", label: "Make the ask clear and easy to decline: 'Would you be comfortable submitting a referral for me? I completely understand if the timing doesn't work.'", completed: false },
      { id: "ib4-4", label: "If they agree, ask what information they need from you (resume, role link, application ID)", completed: false },
      { id: "ib4-5", label: "Send them your updated resume and the direct link to the job posting immediately", completed: false },
      { id: "ib4-6", label: "Follow up with a thank-you message once the referral is submitted", completed: false },
    ],
    internationalConsiderations: "Asking someone to refer you is normal in the US — it actually helps them too (many banks pay referral bonuses). Frame it as: 'Would you be comfortable submitting a referral for me? I completely understand if the timing doesn't work.' The key is to make it easy for them to say yes OR no without awkwardness.",
    resources: [],
    practiceQuiz: [
      {
        question: "When should you ask for a referral relative to submitting your application?",
        options: [
          "After you apply — so they can see your application in the system",
          "Before you apply — the referral needs to be in the system first for it to be linked",
          "It doesn't matter when you ask",
          "Only after you get an interview"
        ],
        correctIndex: 1,
        explanation: "At most banks, the referral needs to be submitted before your application for it to be properly tracked and linked. Always ask first, then apply."
      }
    ],
    reflectionPrompts: [
      "How did it feel to ask for a referral? Was it easier or harder than you expected?",
      "What would you do differently in how you built the relationship leading up to this ask?",
      "If someone declined, what did you learn from the experience?"
    ],
    completionGate: { type: "text", prompt: "Which contacts did you ask for referrals, and what were the outcomes?", placeholder: "e.g., Asked Sarah K. at Goldman — she agreed and submitted referral. Asked David L. at Evercore — said timing doesn't work but offered to connect me with a colleague." },
  },
  {
    title: "Submit 5 Applications with Strategic Timing",
    objective: "Apply to 5 target banks with tailored materials, referrals where available, and strategic timing aligned with each firm's recruiting calendar.",
    whyItMatters: "IB recruiting follows a strict calendar. Many banks review on a rolling basis — applying in the first 2 weeks dramatically increases your odds. Combined with referrals, strategic timing can be the difference between getting screened and getting screened out.",
    conceptCoaching: "By the time you reach this step, you should have a network of contacts, at least one referral, and a deep understanding of your target firms. Now it's time to apply — but strategically, not desperately.\n\nThe biggest mistake students make is spray-and-pray: sending the same generic application to 30 firms. Instead, you should be applying to 5-7 firms where you have the strongest positioning — meaning you have contacts, referrals, firm-specific knowledge, and a genuine answer to 'Why this firm?'\n\nFor each application, your cover letter should reference specific people you've spoken with and specific things you learned about the firm. 'After speaking with Sarah Kim in the Healthcare group, I was particularly drawn to Goldman's approach to cross-border M&A advisory...' This signals that you've done the work, you know people at the firm, and you have genuine interest.\n\nTiming matters enormously in IB. Most bulge bracket banks open summer analyst applications between July and September for the following summer. Some boutiques open later. Check each firm's specific timeline and apply in the first week the portal opens. Early applications get more attention because the candidate pool is smaller.\n\nTrack every application in your Companies tab. Note the date you applied, whether you had a referral, and any response you receive. This becomes your command center for the recruiting process.",
    subtasks: [
      { id: "ib5-1", label: "Create accounts on each target bank's career portal — don't wait until deadlines approach", completed: false },
      { id: "ib5-2", label: "Confirm referrals are submitted BEFORE you apply (ask your contacts to confirm)", completed: false },
      { id: "ib5-3", label: "Write a tailored cover letter for each bank: mention specific deals, people you spoke with, and why that firm specifically", completed: false },
      { id: "ib5-4", label: "Submit applications in the first week each portal opens — check deadlines in your Companies tab", completed: false },
      { id: "ib5-5", label: "Save each company in your Companies tab with status 'Applied' and the application date in notes", completed: false },
      { id: "ib5-6", label: "Send a brief note to your referral contacts letting them know you've applied", completed: false },
    ],
    internationalConsiderations: "When applications ask about work authorization, be honest. Select 'Will require sponsorship' when applicable. Firms that sponsor expect this. Trying to hide your status will only create problems later.",
    resources: [
      { title: "Wall Street Oasis Bank Rankings", url: "https://www.wallstreetoasis.com/rankings/banking" },
    ],
    practiceQuiz: [
      {
        question: "What should your cover letter reference to stand out from generic applicants?",
        options: [
          "Your GPA and test scores",
          "Specific people you've spoken with at the firm and specific things you learned",
          "How much you need a visa sponsorship",
          "Every internship you've ever had"
        ],
        correctIndex: 1,
        explanation: "Mentioning specific contacts and insights from networking conversations signals that you've done genuine research and have internal advocates."
      }
    ],
    reflectionPrompts: [
      "Looking at your 5 applications, which one do you feel most confident about and why?",
      "What patterns did you notice in how different firms structure their applications?",
      "If you could go back and strengthen one application, which would it be and what would you change?"
    ],
    completionGate: { type: "text", prompt: "List the banks you applied to, whether you had a referral, and the dates:", placeholder: "e.g., Goldman Sachs (Aug 15, referral from Sarah K.), Morgan Stanley (Aug 20, no referral)..." },
  },
  {
    title: "Master Technical & Behavioral Interviews",
    objective: "Be able to answer the top 20 IB technical questions and 5 behavioral stories without hesitation. Complete at least 3 mock interviews.",
    whyItMatters: "Technical questions are binary pass/fail. If you can't walk through a DCF or explain the 3 financial statements, the interview ends regardless of your networking. Behavioral prep ensures you can tell your story compellingly.",
    conceptCoaching: "You've built your network. You've applied with referrals. Now comes the final gate: the interview. And in investment banking, interviews are uniquely demanding because they test both technical knowledge and personal fit in a compressed timeframe.\n\nTechnical interviews in IB test a specific body of knowledge: accounting (the 3 financial statements and how they connect), valuation (DCF, comparable companies, precedent transactions), and deal mechanics (mergers, LBOs). The questions are not trick questions — they're testing whether you've put in the work to learn the fundamentals. And the standard is high: you need to answer confidently, clearly, and quickly.\n\nBehavioral interviews test something different: can you tell a compelling story about your experiences? Do you have self-awareness? Are you someone people want to work with at 2am during a live deal? The STAR format (Situation, Task, Action, Result) is your framework. Prepare 5 stories covering: leadership, teamwork, a failure you learned from, taking initiative, and analytical problem-solving.\n\nThe most important thing you can do is practice out loud. Reading answers silently is not preparation. You need to hear yourself say the words, time your responses, and get feedback from others. Do at least 3 mock interviews — ideally with someone who has banking experience.\n\nAs an international student, be prepared for the 'why' questions: Why banking? Why this firm? Why should we sponsor you? The last question is rarely asked directly, but it's always in the back of the interviewer's mind. Your answer should demonstrate that you bring a unique perspective — cross-border experience, language skills, international market knowledge — that justifies the investment.",
    subtasks: [
      { id: "ib6-1", label: "Memorize the 3-statement model flow: how a $10 increase in depreciation flows through the Income Statement → Balance Sheet → Cash Flow Statement", completed: false },
      { id: "ib6-2", label: "Practice walking through a DCF out loud: Unlevered Free Cash Flow → discount at WACC → Terminal Value → Enterprise Value → subtract net debt → Equity Value", completed: false },
      { id: "ib6-3", label: "Learn the top 3 valuation methodologies (DCF, Comparable Companies, Precedent Transactions) and when to use each", completed: false },
      { id: "ib6-4", label: "Study 3 recent deals at your target banks — know the deal size, strategic rationale, and outcome", completed: false },
      { id: "ib6-5", label: "Write 5 STAR-format behavioral stories: leadership, teamwork, failure/learning, initiative, analytical thinking", completed: false },
      { id: "ib6-6", label: "Complete at least 3 full mock interviews with a partner, timing each one (30-45 min)", completed: false },
      { id: "ib6-7", label: "Record yourself answering 'Walk me through a DCF' and 'Tell me about yourself' — watch the recordings and note areas to improve", completed: false },
    ],
    internationalConsiderations: "In US interviews, saying 'I don't know' is far better than guessing or rambling. Interviewers respect intellectual honesty. You can say: 'I'm not sure about that specific point, but here's how I'd think about it...' Also, practice your answers in English until they feel natural — accent is fine, hesitation on financial terms is not.",
    resources: [
      { title: "400 IB Interview Questions (Wall Street Prep)", url: "https://www.wallstreetprep.com/knowledge/investment-banking-interview-questions/" },
      { title: "M&I Technical Question Guide", url: "https://www.mergersandinquisitions.com/investment-banking-interview-questions-and-answers/" },
    ],
    practiceQuiz: [
      {
        question: "If a company's depreciation increases by $10, what happens to Free Cash Flow (assuming 25% tax rate)?",
        options: [
          "Decreases by $10",
          "No change — depreciation is non-cash",
          "Increases by $7.50 — tax savings from depreciation",
          "Increases by $10"
        ],
        correctIndex: 2,
        explanation: "Depreciation reduces taxable income, creating a tax shield. The FCF impact is: $10 × (1 - 25% tax rate) = $7.50 increase. This is a classic IB technical question."
      }
    ],
    reflectionPrompts: [
      "After doing mock interviews, what technical areas do you still feel weakest in?",
      "How did your behavioral stories land? Were there moments where you lost the interviewer's attention?",
      "What's your plan for the final 48 hours before each real interview?"
    ],
    completionGate: { type: "number", prompt: "How many full mock interviews have you completed?", placeholder: "e.g., 3" },
  },
];

const CONSULTING_TASKS: TaskTemplate[] = [
  {
    title: "Strategic Alumni Research for Consulting",
    objective: "Identify and research 10 alumni working in management consulting. Map their career paths, note firm-specific patterns, and select 5 strong outreach candidates.",
    whyItMatters: "Consulting firms ask 'Why our firm?' in every single interview. The only way to answer credibly is by talking to people who actually work there. Alumni research gives you both intelligence and warm leads.",
    conceptCoaching: "Consulting recruiting has a unique characteristic that most students miss: fit matters as much as capability. Unlike banking where technical skills dominate, consulting firms want people who are genuinely curious, collaborative, and enjoyable to work with. This means your networking approach needs to be authentic, not transactional.\n\nThe consulting landscape is more varied than most students realize. MBB (McKinsey, BCG, Bain) is the top tier, but Big 4 consulting arms (Deloitte S&O, EY-Parthenon, PwC Strategy&, KPMG Strategy) and boutiques (Oliver Wyman, LEK, Roland Berger) offer excellent careers too — and sometimes better sponsorship odds for international students.\n\nYour alumni network is the key to understanding these differences. When you talk to a McKinsey consultant, they'll describe a very different culture than someone at Deloitte S&O. These nuances are invisible from the outside but critical in interviews. Your first step is research: who from your school went into consulting? Where did they end up? What does the typical path look like?\n\nThis isn't just about finding names to message. It's about understanding the ecosystem you're trying to enter. What skills do consulting professionals from your school tend to have? How long do they stay at their first firm? What practice areas are most common? This intelligence shapes everything — your outreach messaging, your interview prep, even which firms you prioritize.\n\nApproach this like a consulting project itself: gather data, look for patterns, and form a hypothesis about where you'll have the strongest fit.",
    subtasks: [
      { id: "c1-1", label: "Open LinkedIn and navigate to your school's Alumni tab. Filter by 'Management Consulting' industry and your target geography.", completed: false },
      { id: "c1-2", label: "Scroll through at least 30 profiles. Note which firms appear most frequently for alumni from your program.", completed: false },
      { id: "c1-3", label: "For 10 alumni, record: name, firm, title, years at firm, and practice area (if visible)", completed: false },
      { id: "c1-4", label: "Identify 3 skills that appear across multiple profiles (e.g., Problem Structuring, Data Analysis, Stakeholder Communication)", completed: false },
      { id: "c1-5", label: "Map 3 common career paths (e.g., Analyst → Consultant → Engagement Manager → Partner track)", completed: false },
      { id: "c1-6", label: "Check H-1B sponsorship data for your top firms on myvisajobs.com", completed: false },
      { id: "c1-7", label: "Select 5 alumni to contact — prioritize recent graduates, people with shared backgrounds, or those at your top-choice firms", completed: false },
      { id: "c1-8", label: "Add all 5 to your Contacts tab with status 'Identified' and their LinkedIn URL", completed: false },
    ],
    internationalConsiderations: "Consulting firms value 'fit' heavily. This means they want people who are genuinely curious, collaborative, and enjoyable to work with. In networking calls, show authentic enthusiasm — Americans can sense scripted responses. Sponsorship varies year to year — confirm during networking conversations.",
    resources: [
      { title: "Vault Consulting Rankings", url: "https://www.vault.com/best-companies-to-work-for/consulting" },
      { title: "H-1B Sponsorship Data", url: "https://www.myvisajobs.com" },
    ],
    practiceQuiz: [
      {
        question: "Why is networking the first step in consulting recruiting, before case prep?",
        options: [
          "Because case prep isn't important",
          "Because networking gives you firm-specific insights and referrals that shape your entire strategy",
          "Because consulting firms don't care about case interviews",
          "Because you can't start case prep without a mentor"
        ],
        correctIndex: 1,
        explanation: "Consulting interviews test 'Why our firm?' — you can only answer this credibly through real conversations with people who work there. Networking comes first because it informs everything else."
      }
    ],
    reflectionPrompts: [
      "What patterns did you notice in consulting career paths from your school?",
      "Were there firms you hadn't considered that seem to hire frequently from your program?",
      "Based on your research, which 2-3 firms feel like the strongest fit for you and why?"
    ],
    completionGate: { type: "text", prompt: "List your 5 selected alumni contacts with firm and role:", placeholder: "e.g., Maria T. at McKinsey, James W. at BCG..." },
  },
  {
    title: "Send 5 Personalized Outreach Messages",
    objective: "Draft and send personalized outreach to your 5 researched alumni. Focus on genuine curiosity about their consulting experience.",
    whyItMatters: "Cold outreach is how every successful consulting candidate builds their network. The people who get offers are the people who had conversations first.",
    conceptCoaching: "Reaching out to strangers feels uncomfortable, especially if you come from a culture where this kind of initiative might seem presumptuous. But in American professional culture — and especially in consulting — proactive networking is expected and respected. Consultants are trained to be helpful and collaborative. Many genuinely enjoy mentoring students from their alma mater.\n\nThe difference between a message that gets a response and one that gets ignored comes down to specificity. A generic message — 'Hi, I'm interested in consulting, can we chat?' — signals low effort. A specific message — 'Hi Maria, I'm a first-year MBA at [School] interested in McKinsey's healthcare practice. I noticed you transitioned from pharma to consulting — I'd love to hear what that transition was like. Would you have 20 minutes for a quick call?' — signals research, genuine interest, and respect for their time.\n\nKey principles for consulting outreach: mention something specific about their career path or practice area. Ask about their experience, not about job openings. Request a specific amount of time (15-20 minutes). Send Tuesday through Thursday, 9-11am their time zone. And always personalize — never send the same message to 5 people.\n\nIf someone doesn't respond within 5 business days, send one polite follow-up. After that, move on. Silence is a polite 'not right now,' and that's fine. Your goal is a response rate of 30-40%, which means 2-3 responses from 5 messages is a great outcome.",
    subtasks: [
      { id: "c2-1", label: "Review each contact's profile again — note something specific about their career path, practice area, or background", completed: false },
      { id: "c2-2", label: "Draft your first outreach message: under 100 words, mention a specific detail about their work, ask for 20 minutes", completed: false },
      { id: "c2-3", label: "Use the AI template as a starting point, then personalize each message with specific details", completed: false },
      { id: "c2-4", label: "Send all 5 messages Tuesday-Thursday, 9-11am in recipient's time zone", completed: false },
      { id: "c2-5", label: "Update each contact's status to 'Messaged' in your Contacts tab", completed: false },
      { id: "c2-6", label: "Set a reminder to follow up after 5 business days if no response", completed: false },
    ],
    internationalConsiderations: "The 'double opt-in' introduction is standard US business etiquette. When someone offers to connect you with a colleague, they'll ask permission first. Don't push for an immediate introduction. Also, 'coffee chat' is the standard informal phrase — even if no coffee is involved.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "consulting-outreach",
      confirmationLabel: "I have personalized and sent this message.",
    },
    practiceQuiz: [
      {
        question: "What makes a consulting outreach message effective?",
        options: [
          "Being as long and detailed as possible to show your interest",
          "Mentioning something specific about their career and asking for a defined amount of time",
          "Asking directly about job openings at their firm",
          "Sending the same template to everyone to save time"
        ],
        correctIndex: 1,
        explanation: "Specificity shows you've done your research. A defined time ask (15-20 minutes) respects their schedule and makes it easy to say yes."
      }
    ],
    reflectionPrompts: [
      "Which message do you think was your strongest? What made it stand out?",
      "How did it feel to reach out to people you don't know? What surprised you?",
      "What would you change about your approach for the next round of outreach?"
    ],
    completionGate: { type: "text", prompt: "Paste one of your outreach messages (anonymize if needed):", placeholder: "Hi [Name], I'm a [year] at [school]..." },
  },
  {
    title: "Conduct 3 Informational Interviews & Build Firm Knowledge",
    objective: "Have 3 conversations with consultants, document firm-specific insights from each, and build your 'Why our firm?' ammunition.",
    whyItMatters: "These conversations build referral relationships and give you insider knowledge that no amount of website research can provide. Every consulting interview asks 'Why our firm?' — your answer needs to come from real conversations.",
    conceptCoaching: "Informational interviews in consulting serve a dual purpose that students often miss. Yes, you're learning about the firm and the role. But you're also auditioning. The person you're speaking with is unconsciously evaluating whether they'd refer you. Are you curious? Thoughtful? Do you ask good questions? Can you hold an intelligent conversation about business?\n\nThis means preparation is critical. Before each call, research the firm's recent work, their practice areas, and any news about them. Know their competitors and what makes them different. When you ask 'What drew you to McKinsey over BCG?', you should already have a hypothesis — you're testing it, not starting from zero.\n\nDuring the call, follow the 70/30 rule: listen 70% of the time, speak 30%. Ask open-ended questions: 'What surprised you most about the transition from your previous career to consulting?' 'What does a typical week look like for you?' 'What do you wish someone had told you before you started?' These questions invite stories, and stories give you the rich, specific details you'll need in interviews.\n\nNever ask for a job during an informational interview. Instead, end with two questions: 'Is there anyone else you'd recommend I speak with?' (this expands your network exponentially) and 'Would you be open to staying in touch as I go through the recruiting process?' Both questions keep the relationship warm without being pushy.\n\nSend a thank-you within 24 hours. Reference something specific they said. This single habit separates you from 90% of candidates.",
    subtasks: [
      { id: "c3-1", label: "Before each call, research the firm: recent projects, practice areas, latest news, and competitors", completed: false },
      { id: "c3-2", label: "Prepare 5 questions for each call — include at least 1 firm-specific question based on your research", completed: false },
      { id: "c3-3", label: "During calls: listen 70%, speak 30%. Start with brief small talk, then move to your questions.", completed: false },
      { id: "c3-4", label: "Do NOT ask for a job or referral. Ask: 'Is there anyone else you'd recommend I speak with?'", completed: false },
      { id: "c3-5", label: "Take detailed notes during each call — insights, advice, names mentioned, practice area details", completed: false },
      { id: "c3-6", label: "Send a thank-you email within 24 hours referencing something specific from the conversation", completed: false },
      { id: "c3-7", label: "Log 3 firm-specific insights from each call (e.g., 'BCG values data-driven approach more than frameworks')", completed: false },
      { id: "c3-8", label: "Update contacts to 'Call Completed' and set follow-up dates 6-8 weeks out", completed: false },
    ],
    internationalConsiderations: "Americans expect you to drive the conversation. Come with specific questions and a clear structure. At the end, ask: 'Would you be open to staying in touch as I progress in my search?' This is professional and expected.",
    resources: [],
    aiTemplate: {
      label: "Post-Call Thank You Email",
      templateId: "consulting-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    practiceQuiz: [
      {
        question: "What is the hidden purpose of an informational interview beyond learning about the firm?",
        options: [
          "To get the interviewer's personal phone number",
          "The person is unconsciously evaluating whether they'd refer you — your curiosity and thoughtfulness matter",
          "To practice your case interview skills",
          "To negotiate salary expectations"
        ],
        correctIndex: 1,
        explanation: "Every conversation is an audition. The person is evaluating your curiosity, preparation, and communication skills — all things that determine whether they'll vouch for you later."
      }
    ],
    reflectionPrompts: [
      "What was the most valuable insight you gained from these conversations?",
      "How do the firms differ in culture or approach based on what you heard?",
      "Which firm feels like the best fit for you now, and has that changed from your initial research?"
    ],
    completionGate: { type: "text", prompt: "Enter the names and firms of the 3 people you spoke with and one key insight from each:", placeholder: "e.g., Maria T. at McKinsey — values structured thinking over frameworks; James W. at BCG — data-first culture" },
  },
  {
    title: "Secure Referrals & Submit Applications",
    objective: "Ask 2-3 contacts for referrals, submit applications to 5 consulting firms, and attend at least 1 firm-hosted event.",
    whyItMatters: "In consulting, referrals and firm event attendance signal genuine interest. Firms track who shows up, and internal referrals move your application to the top of the review pile.",
    conceptCoaching: "This is where your networking investment converts into tangible results. You've built relationships, had meaningful conversations, and developed firm-specific knowledge. Now it's time to ask for referrals and apply — in that order.\n\nAsking for a referral follows the same principle as everything else in this process: be direct, respectful, and make it easy to say no. After you've had at least one good conversation and sent a thoughtful thank-you, reach out again: 'I've really valued our conversations about [Firm]. I'm planning to apply for the [Role] position. Would you be comfortable submitting a referral? I completely understand if the timing doesn't work.'\n\nSubmit the referral BEFORE your application. At most firms, the referral needs to be in the system for it to be linked to your application. If you apply first, the referral may not count.\n\nFirm events are equally important. Consulting firms host coffee chats, case workshops, and info sessions — and they track attendance. Being seen at events signals genuine interest. Come with thoughtful questions, introduce yourself to at least one person, and follow up within 48 hours.\n\nFor your applications, each cover letter should reference specific people and specific insights: 'After speaking with Maria Torres about McKinsey's healthcare practice, I was particularly drawn to the firm's approach to combining data analytics with traditional strategy work...' This demonstrates research, relationships, and genuine interest.",
    subtasks: [
      { id: "c4-1", label: "Identify 2-3 contacts who seemed most supportive during your informational interviews", completed: false },
      { id: "c4-2", label: "Send referral request messages — be direct, specific about the role, and give an easy out", completed: false },
      { id: "c4-3", label: "Confirm referrals are submitted before you apply", completed: false },
      { id: "c4-4", label: "Check your school's career center for upcoming consulting events — register and attend at least 1", completed: false },
      { id: "c4-5", label: "At events: introduce yourself, ask a thoughtful question, exchange contact info with at least 1 person", completed: false },
      { id: "c4-6", label: "Write tailored cover letters for each firm — reference specific people, conversations, and firm attributes", completed: false },
      { id: "c4-7", label: "Submit applications to 5 firms. Save each in Companies tab with status 'Applied'.", completed: false },
      { id: "c4-8", label: "Send follow-up emails to event contacts within 48 hours", completed: false },
    ],
    internationalConsiderations: "At US networking events, the standard greeting is a firm handshake, eye contact, and 'Hi, I'm [first name].' Have your 15-second elevator pitch ready: 'I'm a first-year MBA at [School], focused on [area]. I'm particularly interested in [Firm]'s work in [practice area].' End with a question to them.",
    resources: [],
    practiceQuiz: [
      {
        question: "Why should you submit your referral BEFORE your application?",
        options: [
          "Because firms reject applicants who apply first",
          "Because the referral needs to be in the system to be linked to your application — if you apply first, it may not count",
          "Because referrals expire after 24 hours",
          "Because it shows you have connections"
        ],
        correctIndex: 1,
        explanation: "Most firms' applicant tracking systems link referrals to applications. If the referral isn't in the system when you apply, it may not be associated with your application."
      }
    ],
    reflectionPrompts: [
      "How did it feel to ask for referrals? What would you do differently next time?",
      "What did you learn from attending a firm event that you couldn't learn online?",
      "Which of your 5 applications do you feel strongest about and why?"
    ],
    completionGate: { type: "text", prompt: "Which firms did you apply to and which had referrals?", placeholder: "e.g., McKinsey (referral from Maria T.), BCG (no referral), Bain (referral from James W.)..." },
  },
  {
    title: "Master Case Interviews Through Structured Practice",
    objective: "Be able to structure and solve 3 different case types (profitability, market entry, M&A) confidently. Complete at least 6 practice cases with a partner.",
    whyItMatters: "The case interview is THE gate to consulting. Top firms reject 80%+ of candidates at this stage. Unlike networking, case performance is binary — you either pass or you don't.",
    conceptCoaching: "Case interviews test one thing above all else: structured thinking. Not knowledge of frameworks, not business vocabulary, not your ability to memorize. The interviewers want to see how your mind works when faced with an unfamiliar problem.\n\nThe biggest mistake students make is memorizing frameworks and trying to force-fit them onto every case. 'This is a profitability case, so I'll use the profitability framework.' Interviewers see through this instantly. Instead, learn to build custom structures. Start with the question: 'The client wants to increase profits.' Break it down: profits = revenue - costs. Revenue = price × volume. Then go deeper based on the specific case context.\n\nThink of it like this: frameworks are training wheels. You need to understand them, but the goal is to ride without them. The best candidates create issue trees that are specific to the case, not generic templates.\n\nPractice is non-negotiable. You need at least 20-30 practice cases before you're interview-ready, with at least half done with a partner who gives you real-time feedback. Record yourself and watch the recordings — you'll spot verbal tics, unclear logic, and pacing issues you'd never notice in the moment.\n\nAs an international student, there's one critical cultural point: thinking out loud is essential in US case interviews. Silence makes interviewers uncomfortable. If you need time to think, say 'Let me take 30 seconds to structure my thoughts.' Then walk through your logic step by step. This demonstrates structured thinking even when you're uncertain.",
    subtasks: [
      { id: "c5-1", label: "Study the 4 core case types: profitability, market sizing, market entry, M&A — understand the logic behind each, not just the frameworks", completed: false },
      { id: "c5-2", label: "Practice building custom issue trees from scratch for 3 different business problems (don't use a framework template)", completed: false },
      { id: "c5-3", label: "Find a case partner and complete 2 practice cases per week, alternating interviewer/interviewee roles", completed: false },
      { id: "c5-4", label: "Record at least 2 of your practice cases and watch the recordings — note areas for improvement", completed: false },
      { id: "c5-5", label: "Complete at least 1 practice case with someone currently working in consulting", completed: false },
      { id: "c5-6", label: "Practice market sizing questions: estimate the number of gas stations in the US, the market for dog food, etc.", completed: false },
    ],
    internationalConsiderations: "In US case interviews, thinking out loud is essential. Silence makes interviewers uncomfortable. Say 'Let me take 30 seconds to structure my thoughts' — then walk through your logic step by step. Practice doing this in English until it feels natural.",
    resources: [
      { title: "PrepLounge Case Library", url: "https://www.preplounge.com/en/management-consulting-cases" },
      { title: "Case in Point (Book)", url: "https://www.amazon.com/Case-Point-Complete-Interview-Preparation/dp/0986370711" },
    ],
    practiceQuiz: [
      {
        question: "What's wrong with memorizing consulting frameworks and applying them to every case?",
        options: [
          "Frameworks are outdated and no longer used",
          "Interviewers want to see custom, structured thinking — force-fitting frameworks shows you can't think independently",
          "You'll run out of frameworks for unusual cases",
          "Frameworks take too long to explain"
        ],
        correctIndex: 1,
        explanation: "Consulting interviews test structured thinking, not framework recall. Custom issue trees tailored to the specific problem signal intellectual horsepower."
      }
    ],
    reflectionPrompts: [
      "After 6+ practice cases, what type of case do you find most challenging?",
      "What feedback have your practice partners given you most consistently?",
      "How has your approach to structuring problems changed since you started practicing?"
    ],
    completionGate: { type: "number", prompt: "How many practice cases have you completed with a partner?", placeholder: "e.g., 6" },
  },
  {
    title: "Interview Execution & Offer Strategy",
    objective: "Complete final preparation for consulting interviews: behavioral stories, firm-specific 'Why' answers, and a clear offer negotiation strategy.",
    whyItMatters: "Consulting interviews test both case skills and personal fit. Behavioral preparation ensures you can tell your story compellingly and handle the 'fit' portion that determines 40-50% of the decision.",
    conceptCoaching: "Consulting interviews typically have two components: the case and the behavioral/fit interview. Most candidates over-prepare for the case and under-prepare for the fit portion. This is a mistake — at MBB firms, fit can account for 40-50% of the hiring decision.\n\nThe behavioral portion tests three things: can you tell a compelling story about your experiences? Do you have genuine self-awareness? Are you someone consultants would want on their team at midnight when a client deliverable is due?\n\nPrepare 5 STAR stories (Situation, Task, Action, Result) covering: leadership, teamwork, overcoming a challenge, driving impact with data, and navigating ambiguity. Each story should be 2-3 minutes when told out loud. Practice until they feel natural, not rehearsed.\n\nFor the 'Why consulting?' and 'Why our firm?' questions, draw directly from your informational interviews. 'After speaking with [Name] about McKinsey's work in [Practice Area], I was struck by how the firm approaches [Specific Methodology].' This is infinitely more convincing than generic answers about 'problem solving' and 'learning.'",
    subtasks: [
      { id: "c6-1", label: "Write 5 STAR stories: leadership, teamwork, failure/learning, data-driven impact, navigating ambiguity", completed: false },
      { id: "c6-2", label: "Craft your 'Why consulting?' answer using genuine reasons — not generic 'problem solving' answers", completed: false },
      { id: "c6-3", label: "Prepare firm-specific 'Why [Firm]?' answers using insights from your informational interviews", completed: false },
      { id: "c6-4", label: "Practice your 30-second elevator pitch: Present → Past → Future format", completed: false },
      { id: "c6-5", label: "Complete 2 full mock interviews (case + behavioral) with timing", completed: false },
      { id: "c6-6", label: "Research your target firms' offer timelines and compensation benchmarks", completed: false },
    ],
    internationalConsiderations: "The 'weakness' question is a test of self-awareness, not a trap. Choose a real weakness you've actively worked on and show growth. For international students, it's fine to mention adapting to US business communication style as a growth area — it shows self-awareness.",
    resources: [],
    practiceQuiz: [
      {
        question: "How much of a consulting hiring decision is typically based on the behavioral/fit interview?",
        options: [
          "10% — cases are all that matter",
          "25% — cases are more important",
          "40-50% — fit is equally important as case performance",
          "80% — firms don't care about cases"
        ],
        correctIndex: 2,
        explanation: "At MBB firms, fit typically accounts for 40-50% of the hiring decision. Under-preparing for behavioral questions is one of the most common mistakes."
      }
    ],
    reflectionPrompts: [
      "Which behavioral story do you feel most confident about? Which needs more work?",
      "How does your 'Why consulting?' answer draw from real conversations you've had?",
      "What's your plan for the final 48 hours before each interview?"
    ],
    completionGate: { type: "number", prompt: "How many full mock interviews (case + behavioral) have you completed?", placeholder: "e.g., 4" },
  },
];

const MARKETING_TASKS: TaskTemplate[] = [
  {
    title: "Strategic Alumni Research for Marketing",
    objective: "Identify 10 alumni in marketing roles, map career patterns across brand/growth/PMM, and select 5 outreach candidates at your target companies.",
    whyItMatters: "Marketing is broad — a 'Brand Manager' at P&G does completely different work than at Google. Only real conversations with insiders reveal these nuances, which you'll need to tell a compelling story in interviews.",
    conceptCoaching: "Marketing recruiting is different from finance or consulting in one critical way: it's less structured. There's no single recruiting calendar, no universal interview format, and no standard career path. This is both a challenge and an opportunity. The challenge is that you can't follow a cookie-cutter playbook. The opportunity is that initiative and creativity — core marketing skills — stand out enormously in the recruiting process.\n\nBefore you do anything else, you need to understand the landscape. Marketing has several distinct functions, and companies hire for specific ones: brand management (P&G, Unilever), growth marketing (tech companies, startups), product marketing (B2B SaaS, tech platforms), and marketing analytics (across industries). Each function values different skills and has different career trajectories.\n\nYour alumni network is the fastest way to understand which path fits you. When you research alumni in marketing, pay attention to their trajectory: did they go straight into marketing, or did they transition from another field? What function are they in? How long did they stay at their first role? What skills do they list?\n\nThis research also helps you identify which companies actively hire from your program. If you see 5 alumni at Google and 0 at Nike, that tells you something about where your school has brand recognition — which affects your odds.\n\nNetworking in marketing is especially important because hiring managers often ask: 'Tell me about a marketing campaign you admire and why.' Your informational interviews give you sophisticated answers that go beyond surface-level analysis.",
    subtasks: [
      { id: "m1-1", label: "Open LinkedIn, navigate to your school's Alumni tab. Filter by Marketing, Advertising, or Brand Management.", completed: false },
      { id: "m1-2", label: "Scroll through 30+ profiles. Note which companies and marketing functions appear most frequently.", completed: false },
      { id: "m1-3", label: "For 10 alumni, record: name, company, title, marketing function (brand/growth/PMM/analytics), and years in role", completed: false },
      { id: "m1-4", label: "Identify 3 common skills across profiles (e.g., Consumer Insights, Data Analysis, Go-to-Market Strategy)", completed: false },
      { id: "m1-5", label: "Note recruiting timelines: CPG typically recruits Sept-Nov, tech is more rolling, agencies hire year-round", completed: false },
      { id: "m1-6", label: "Check H-1B sponsorship data for your top companies on myvisajobs.com", completed: false },
      { id: "m1-7", label: "Select 5 alumni to contact — prioritize people in your target function and at companies you're most interested in", completed: false },
      { id: "m1-8", label: "Add all 5 to your Contacts tab with status 'Identified'", completed: false },
    ],
    internationalConsiderations: "Marketing professionals in the US are expected to have strong opinions backed by data. Saying 'I noticed your brand's Instagram engagement dropped 15% after the campaign pivot — here's what I'd test' shows initiative, not arrogance.",
    resources: [
      { title: "AMA Career Paths in Marketing", url: "https://www.ama.org/marketing-career-paths/" },
    ],
    practiceQuiz: [
      {
        question: "Why is networking especially important in marketing recruiting compared to finance?",
        options: [
          "Marketing firms don't accept online applications",
          "Marketing recruiting is less structured — initiative and relationships matter more because there's no standard playbook",
          "Marketing professionals don't use LinkedIn",
          "Marketing firms only hire through referrals"
        ],
        correctIndex: 1,
        explanation: "Marketing recruiting lacks the rigid calendar of finance/consulting. This means proactive networking and showing initiative — both core marketing skills — have an outsized impact."
      }
    ],
    reflectionPrompts: [
      "Based on your research, which marketing function (brand, growth, PMM, analytics) feels like the best fit for your skills?",
      "What surprised you about the career paths of marketing alumni from your school?",
      "Which companies appeared more than you expected?"
    ],
    completionGate: { type: "text", prompt: "What's your target marketing function and your top 5 alumni contacts?", placeholder: "e.g., Growth Marketing — Ana R. (Google), James T. (Spotify)..." },
  },
  {
    title: "Send 5 Personalized Outreach Messages",
    objective: "Draft and send personalized messages to your 5 researched marketing alumni. Reference specific campaigns or work they've been involved in.",
    whyItMatters: "In marketing, your outreach IS your first portfolio piece. How you communicate says everything about your marketing instincts.",
    conceptCoaching: "Here's something unique about marketing networking: the quality of your outreach message is itself a signal of your marketing ability. A generic, forgettable message suggests you'd create generic, forgettable campaigns. A specific, well-crafted message that shows you've done your research suggests you understand audience, personalization, and compelling communication.\n\nThis is actually great news for you. Unlike banking or consulting, where outreach follows a fairly standard template, marketing outreach gives you creative room. Reference a campaign the person worked on. Mention a product launch their company did. Show that you think like a marketer even in how you network.\n\nFor example: 'Hi Ana, I'm a first-year MBA at [School] focused on growth marketing. I noticed your work on Spotify's Wrapped campaign — the way it turned user data into a shareable social moment was brilliant product marketing. I'd love to hear about how your team approached the data-to-creative pipeline. Would you have 15 minutes for a quick call?'\n\nThis message works because it demonstrates three things: you've researched their specific work, you can articulate WHY something was effective (not just that you liked it), and you have a specific question that shows depth of thinking.\n\nTrack everything in your Contacts tab. Marketing networking tends to be more casual than finance or consulting, but the discipline of tracking is just as important.",
    subtasks: [
      { id: "m2-1", label: "For each contact, find something specific about their work — a campaign, product launch, or company initiative", completed: false },
      { id: "m2-2", label: "Draft your outreach: under 100 words, reference their specific work, show marketing thinking, ask for 15 minutes", completed: false },
      { id: "m2-3", label: "Use the AI template as a starting point, then personalize with specific campaign/product references", completed: false },
      { id: "m2-4", label: "Send all 5 messages — marketing outreach can be slightly more casual than finance, but keep it professional", completed: false },
      { id: "m2-5", label: "Update each contact's status to 'Messaged' in your Contacts tab", completed: false },
      { id: "m2-6", label: "Follow up after 5 business days if no response", completed: false },
    ],
    internationalConsiderations: "In US marketing culture, personal branding matters. Before you start networking, make sure your LinkedIn is polished: professional photo, headline that clearly states what you want to do, and 2-3 posts that demonstrate marketing thinking.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "marketing-outreach",
      confirmationLabel: "I have personalized and sent this message.",
    },
    practiceQuiz: [
      {
        question: "Why does the quality of your networking message matter more in marketing than in other fields?",
        options: [
          "Marketing professionals are pickier about grammar",
          "Your outreach message is itself a demonstration of your communication and marketing skills",
          "Marketing firms require a writing sample with every connection request",
          "It doesn't — all fields value good messages equally"
        ],
        correctIndex: 1,
        explanation: "In marketing, how you communicate IS the skill. A well-crafted, personalized message demonstrates the same abilities you'd use in the job."
      }
    ],
    reflectionPrompts: [
      "How did you personalize each message beyond just changing the name?",
      "Which message are you most proud of and why?",
      "What marketing thinking did you demonstrate in your outreach?"
    ],
    completionGate: { type: "text", prompt: "Paste one of your outreach messages (anonymize if needed):", placeholder: "Hi [Name], I noticed your work on..." },
  },
  {
    title: "Conduct 3 Informational Interviews & Build Industry Knowledge",
    objective: "Have 3 conversations with marketing professionals, understand how different companies approach marketing, and build your 'Why this company?' narrative.",
    whyItMatters: "Marketing roles vary enormously by company. A Brand Manager at P&G owns a P&L. A PMM at Google bridges engineering and business. Only insiders can explain what the day-to-day really looks like.",
    conceptCoaching: "Marketing informational interviews should feel like conversations about work you find genuinely interesting — because they should be. Unlike structured finance interviews, marketing conversations can range from creative strategy to data analysis to cross-functional leadership. Your goal is to understand three things: what does the day-to-day actually look like? What skills matter most? And what separates great candidates from good ones?\n\nPrepare questions that go beyond the surface. Instead of 'What does a brand manager do?', ask 'What's the most challenging part of managing a brand P&L?' Instead of 'How did you get your job?', ask 'What skills from your MBA turned out to be most useful in your first year?'\n\nOne unique advantage in marketing: you can bring up specific campaigns or products and ask for behind-the-scenes perspectives. 'I was really interested in how [Company] repositioned [Product] — was that driven more by consumer research or competitive pressure?' This shows you think like a marketer and turns the conversation into a genuine exchange of ideas.\n\nIf you've built a portfolio piece (which you should do if you have time), mention it naturally: 'I actually did a growth channel analysis of [Company] for a class project — I'd love your perspective on whether my conclusions hold up.' This transforms you from a student asking for help into a peer sharing ideas.\n\nSend thank-you notes within 24 hours. In marketing, you can be slightly more personal — reference not just what they said, but why it matters to your specific career thinking.",
    subtasks: [
      { id: "m3-1", label: "Before each call, research the company's recent campaigns, product launches, and marketing strategy", completed: false },
      { id: "m3-2", label: "Prepare 5 questions including at least 1 about a specific campaign or product decision", completed: false },
      { id: "m3-3", label: "During calls: listen 70%, speak 30%. Show genuine curiosity about their day-to-day work.", completed: false },
      { id: "m3-4", label: "Ask: 'What separates the best marketers you've worked with from the average ones?'", completed: false },
      { id: "m3-5", label: "Send thank-you within 24 hours referencing a specific insight from the conversation", completed: false },
      { id: "m3-6", label: "Log 3 insights from each call in your contact notes", completed: false },
      { id: "m3-7", label: "Update contacts to 'Call Completed' and set follow-up dates", completed: false },
    ],
    internationalConsiderations: "Americans value directness in professional settings. If you have a specific question about how international candidates are perceived or about visa sponsorship, it's fine to ask directly rather than hinting.",
    resources: [],
    aiTemplate: {
      label: "Post-Call Follow-Up Email",
      templateId: "marketing-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    practiceQuiz: [
      {
        question: "What type of question shows the strongest marketing thinking during an informational interview?",
        options: [
          "'How did you get your job?'",
          "'I noticed [Company] repositioned [Product] recently — was that driven by consumer research or competitive pressure?'",
          "'What's the salary range for this role?'",
          "'Do you like your job?'"
        ],
        correctIndex: 1,
        explanation: "Asking about specific marketing decisions shows you think analytically about campaigns and understand the strategic choices behind them."
      }
    ],
    reflectionPrompts: [
      "How do the day-to-day responsibilities differ across the companies you spoke with?",
      "What skill or quality was mentioned most frequently as important for marketers?",
      "Has your target marketing function changed based on these conversations?"
    ],
    completionGate: { type: "text", prompt: "Who did you speak with and what are the top insights?", placeholder: "e.g., Ana R. at P&G — brand managers own full P&L, not just creative..." },
  },
  {
    title: "Secure Referrals & Apply to 5 Marketing Roles",
    objective: "Convert networking relationships into referrals and submit tailored applications to 5 marketing roles. Attach portfolio work where possible.",
    whyItMatters: "In marketing, referrals increase interview rates by 5-10x. Combined with a portfolio piece and tailored applications, you create a candidate profile that stands out from the generic applicant pool.",
    conceptCoaching: "You've built relationships and gathered intelligence. Now it's time to convert that work into applications. In marketing, the application process rewards customization more than almost any other field. Why? Because marketing is about understanding your audience and crafting targeted messages — and your application IS a marketing exercise.\n\nFor each application: reference specific campaigns, products, or strategic decisions the company has made. Mention people you've spoken with. If you have a portfolio piece, link to it or attach it. This combination — referral + personalized application + portfolio — puts you in the top 5% of applicants.\n\nWhen asking for referrals, marketing contacts tend to be more informal about it. You can say: 'I'm applying to the [Role] at [Company]. Would you be willing to put in a good word or submit a referral? Happy to send you my resume and the job link.' Keep it casual but clear.\n\nAlso consider reaching out directly to the hiring manager via LinkedIn. In marketing, this is more accepted than in finance or consulting. A brief message — 'Hi, I recently applied to the [Role] and wanted to introduce myself. I spoke with [Contact Name] who recommended I look into this position...' — can move your application from the pile to someone's inbox.",
    subtasks: [
      { id: "m4-1", label: "Identify 2-3 contacts who were most engaged during your conversations and ask for referrals", completed: false },
      { id: "m4-2", label: "For each application, write a tailored cover letter referencing the company's specific marketing work", completed: false },
      { id: "m4-3", label: "If you have a portfolio piece, attach or link it with your applications", completed: false },
      { id: "m4-4", label: "Apply through company career portal AND send a brief LinkedIn message to the hiring manager", completed: false },
      { id: "m4-5", label: "Save each company in your Companies tab with status 'Applied'", completed: false },
      { id: "m4-6", label: "Follow up one week after applying if you haven't heard back", completed: false },
    ],
    internationalConsiderations: "Following up on job applications is expected in the US. One week after applying, send a brief LinkedIn message to the recruiter expressing your continued interest. This is professional, not pushy.",
    resources: [],
    practiceQuiz: [
      {
        question: "Why is a tailored application more important in marketing than in other fields?",
        options: [
          "Marketing firms have stricter application requirements",
          "Because your application IS a marketing exercise — customization demonstrates the core skill they're hiring for",
          "Because marketing firms don't accept generic applications",
          "Because marketing roles are more competitive"
        ],
        correctIndex: 1,
        explanation: "Marketing is about understanding your audience and crafting targeted messages. A generic application contradicts the very skill you're supposed to demonstrate."
      }
    ],
    reflectionPrompts: [
      "Looking at your 5 applications, which feels strongest? What made it different?",
      "How did your informational interview insights improve your application materials?",
      "If you could redo one application, what would you change?"
    ],
    completionGate: { type: "text", prompt: "List the companies and roles you applied to:", placeholder: "e.g., Google (PMM Intern), P&G (Brand Manager Intern), Spotify (Growth Marketing)..." },
  },
  {
    title: "Build Marketing Skills & Portfolio",
    objective: "Create 1 tangible portfolio piece and complete at least 1 relevant certification to demonstrate hands-on marketing capability.",
    whyItMatters: "Marketing hiring managers care about what you can DO, not just what you know. A concrete portfolio piece and relevant certifications put you ahead of 90% of candidates who only talk strategy.",
    conceptCoaching: "Here's a truth about marketing recruiting that most students learn too late: talking about marketing strategy is not the same as demonstrating marketing skills. Anyone can say 'I'm interested in growth marketing.' Very few candidates can show a growth channel analysis they actually built, with real data, actionable recommendations, and expected impact.\n\nYour portfolio piece doesn't need to be perfect. It needs to be real. Choose a format that aligns with your target function: a brand audit for brand management, a growth channel analysis for growth marketing, a competitive positioning study for PMM, or a funnel analysis for marketing analytics. Use real data — SimilarWeb, social analytics, earnings calls, industry reports.\n\nStructure it professionally: executive summary, analysis, recommendations, expected impact. Keep it to 5-8 slides or a 2-page document. Get feedback from a professor, classmate, or professional in marketing.\n\nCertifications are the other signal that separates serious candidates. Google Analytics, HubSpot Inbound Marketing, and Meta Blueprint are all free and carry genuine weight in hiring decisions. They demonstrate that you can use the tools, not just talk about the concepts.\n\nThis task is positioned later in your roadmap intentionally. By now, your informational interviews have given you a much clearer picture of what skills matter most for your target roles. Use that intelligence to choose the right portfolio focus and certifications.",
    subtasks: [
      { id: "m5-1", label: "Choose your portfolio format based on your target function: brand audit, growth analysis, competitive study, or funnel analysis", completed: false },
      { id: "m5-2", label: "Gather real data for your analysis using free tools (SimilarWeb, social analytics, public financials)", completed: false },
      { id: "m5-3", label: "Structure your piece professionally: executive summary → analysis → recommendations → expected impact", completed: false },
      { id: "m5-4", label: "Keep it to 5-8 slides or 2 pages. Quality over quantity.", completed: false },
      { id: "m5-5", label: "Get feedback from at least 1 person — ideally someone in marketing", completed: false },
      { id: "m5-6", label: "Complete at least 1 certification relevant to your target role (Google Analytics, HubSpot, Meta Blueprint)", completed: false },
      { id: "m5-7", label: "Add the certification to your LinkedIn and resume", completed: false },
    ],
    internationalConsiderations: "American employers value initiative and 'showing, not telling.' Creating a portfolio piece on your own — without being asked — signals exactly the kind of proactive mindset US companies want. Free certifications carry real weight in US marketing hiring.",
    resources: [
      { title: "Google Analytics Academy", url: "https://analytics.google.com/analytics/academy/" },
      { title: "HubSpot Academy (Free)", url: "https://academy.hubspot.com" },
    ],
    practiceQuiz: [
      {
        question: "Why should you build a marketing portfolio piece AFTER your informational interviews, not before?",
        options: [
          "Because you need permission from companies first",
          "Because your conversations help you understand which skills matter most for your target roles, making your portfolio more relevant",
          "Because portfolio pieces aren't important until you have an interview",
          "Because you need professional connections to access data"
        ],
        correctIndex: 1,
        explanation: "Informational interviews reveal what skills and deliverables actually matter in your target role. This intelligence makes your portfolio piece more targeted and impressive."
      }
    ],
    reflectionPrompts: [
      "How does your portfolio piece demonstrate the specific skills your target roles require?",
      "What did you learn from the process of building this piece that you couldn't learn from a textbook?",
      "How will you present this portfolio piece in interviews?"
    ],
    completionGate: { type: "text", prompt: "Describe your portfolio piece (topic, format, key finding) and any certifications completed:", placeholder: "e.g., Growth channel audit for Duolingo showing organic social drives 3x ROI vs. paid. Completed Google Analytics cert." },
  },
  {
    title: "Interview Preparation & Execution",
    objective: "Prepare for marketing interviews with behavioral stories, case studies, and a clear personal brand narrative. Complete at least 2 mock interviews.",
    whyItMatters: "Marketing interviews test both strategic thinking and communication skills. Your ability to tell a compelling story — about yourself and about marketing problems — determines the outcome.",
    conceptCoaching: "Marketing interviews vary widely by company, but they typically include three components: behavioral questions (tell me about a time...), a marketing case or exercise (how would you launch this product?), and a portfolio discussion (walk me through work you've done).\n\nFor behavioral questions, prepare 5 STAR stories covering: leadership, teamwork, data-driven decision making, creative problem solving, and influencing without authority. Marketing is inherently cross-functional — you work with engineering, sales, finance, and creative teams. Stories that show you can collaborate and influence across functions are gold.\n\nFor marketing cases, practice structuring your approach: target audience → problem/opportunity → strategy → tactics → measurement. Whether the question is 'How would you grow Instagram in Japan?' or 'Design a launch plan for a new product,' this framework keeps you organized.\n\nYour personal brand narrative should connect your background to marketing in a clear, compelling way. 'I started in [Previous Field], where I learned [Skill]. That experience made me realize that [Insight about Marketing]. Now I'm focused on [Specific Marketing Function] because [Genuine Reason].' This story should take 90 seconds to tell and feel natural, not rehearsed.",
    subtasks: [
      { id: "m6-1", label: "Write 5 STAR stories: leadership, teamwork, data-driven decisions, creative problem solving, cross-functional influence", completed: false },
      { id: "m6-2", label: "Craft your personal brand narrative: 90 seconds connecting your background to your marketing goals", completed: false },
      { id: "m6-3", label: "Practice 3 marketing cases: product launch, market entry, and growth strategy", completed: false },
      { id: "m6-4", label: "Prepare to discuss your portfolio piece: what was the insight, the process, and the impact", completed: false },
      { id: "m6-5", label: "Complete 2 mock interviews covering behavioral + case + portfolio discussion", completed: false },
    ],
    internationalConsiderations: "In US marketing interviews, showing personality matters more than in other fields. Marketers are expected to be engaging communicators. Be authentic — your international perspective is a strength, especially for companies with global brands.",
    resources: [],
    practiceQuiz: [
      {
        question: "What framework should you use when answering a marketing case question like 'How would you launch this product?'",
        options: [
          "Revenue - Costs = Profit (profitability framework)",
          "Target Audience → Problem/Opportunity → Strategy → Tactics → Measurement",
          "SWOT Analysis only",
          "Just brainstorm creative ideas without structure"
        ],
        correctIndex: 1,
        explanation: "Starting with the target audience and working through strategy to measurement shows structured marketing thinking. The key differentiator from generic frameworks is starting with the customer."
      }
    ],
    reflectionPrompts: [
      "How does your personal brand narrative connect your unique background to marketing?",
      "Which behavioral story do you feel most confident about? Which needs more work?",
      "What's your plan for the final 48 hours before each interview?"
    ],
    completionGate: { type: "number", prompt: "How many full mock interviews have you completed?", placeholder: "e.g., 2" },
  },
];

const PRODUCT_TECH_TASKS: TaskTemplate[] = [
  {
    title: "Strategic Alumni Research for Product & Tech",
    objective: "Identify 10 alumni in PM or tech roles across Big Tech, growth-stage, and enterprise companies. Map career paths and select 5 outreach candidates.",
    whyItMatters: "Product and engineering interviews test 'product sense' and 'culture fit' — both are invisible from the outside. Insiders teach you the vocabulary, frameworks, and values each company prizes.",
    conceptCoaching: "Tech and product recruiting operates differently from every other industry. There's no single recruiting calendar, no standard interview format across companies, and the role of 'Product Manager' means something completely different at Google versus a 20-person startup. This ambiguity is actually an advantage for proactive networkers.\n\nThe tech ecosystem has three tiers you should understand: Big Tech (Google, Meta, Amazon, Apple, Microsoft) has structured rotational programs with defined application windows, typically July-September. Growth-stage companies (Stripe, Notion, Figma, Airbnb) have semi-structured recruiting with more flexibility. And enterprise (Salesforce, Adobe, Oracle) has year-round hiring with less brand cachet but strong sponsorship records.\n\nYour alumni network helps you navigate this landscape. When you see that 3 alumni from your school are PMs at Stripe, that tells you something about your school's credibility with that company's recruiters. When you see an alumnus who transitioned from consulting to product, their career path reveals what skills translated — and what they had to learn.\n\nIn tech, networking is less formal than finance or consulting. People connect over shared interests in products, side projects, and technology trends. Your outreach can be more casual, more specific about products, and more curiosity-driven. This is a field where asking 'How did your team decide to sunset that feature?' is a perfectly natural conversation starter.\n\nResearch first, message second. Understanding the landscape gives you the intelligence to craft outreach that feels genuine, not transactional.",
    subtasks: [
      { id: "t1-1", label: "Open LinkedIn, navigate to your school's Alumni tab. Filter by Technology, Product Management, or Software Engineering.", completed: false },
      { id: "t1-2", label: "Scroll through 30+ profiles. Note which companies and role types (PM, PMM, SWE, Data) appear most frequently.", completed: false },
      { id: "t1-3", label: "For 10 alumni, record: name, company, title, years in role, and whether they came from a technical or non-technical background", completed: false },
      { id: "t1-4", label: "Categorize your targets: Big Tech (structured programs), Growth-stage (flexible hiring), Enterprise (year-round)", completed: false },
      { id: "t1-5", label: "Check H-1B sponsorship and compensation data on myvisajobs.com and levels.fyi", completed: false },
      { id: "t1-6", label: "Note application windows: Big Tech PM programs often open July-September, growth-stage is rolling", completed: false },
      { id: "t1-7", label: "Select 5 alumni to contact — prioritize people at your target companies with backgrounds similar to yours", completed: false },
      { id: "t1-8", label: "Add all 5 to your Contacts tab with status 'Identified'", completed: false },
    ],
    internationalConsiderations: "In US tech culture, titles matter less than impact. Nobody cares if you were a 'Vice President' at a university club — they care what you built, shipped, and measured. Frame your experience in terms of outcomes.",
    resources: [
      { title: "Levels.fyi Compensation Data", url: "https://www.levels.fyi" },
      { title: "H-1B Sponsorship Lookup", url: "https://www.myvisajobs.com" },
    ],
    practiceQuiz: [
      {
        question: "What's the key difference between Big Tech and growth-stage PM recruiting?",
        options: [
          "Big Tech pays more",
          "Big Tech has structured programs with defined windows; growth-stage has flexible, rolling hiring",
          "Growth-stage companies don't sponsor visas",
          "Big Tech doesn't do referrals"
        ],
        correctIndex: 1,
        explanation: "Understanding the structure of each tier helps you time your applications and networking appropriately."
      }
    ],
    reflectionPrompts: [
      "Based on your alumni research, which tier (Big Tech, growth-stage, enterprise) seems to hire most from your program?",
      "What surprised you about PM/tech career paths from your school?",
      "How does your own background (technical vs. non-technical) align with the alumni you researched?"
    ],
    completionGate: { type: "text", prompt: "List your top 5 target companies and the specific role at each:", placeholder: "e.g., Google (APM), Stripe (PM Intern), Notion (Product Analyst)..." },
  },
  {
    title: "Send 5 Product-Focused Outreach Messages",
    objective: "Draft and send outreach to 5 alumni referencing specific product decisions or features at their companies.",
    whyItMatters: "In tech, your outreach should demonstrate product thinking. Referencing a specific feature or product decision shows you think like a PM, not just a job seeker.",
    conceptCoaching: "Tech networking has a unique advantage: products are visible and public. Unlike banking deals (which are confidential) or consulting engagements (which are private), tech products are things you can use, analyze, and have genuine opinions about. This makes your outreach inherently more authentic.\n\nThe best tech outreach references a specific product decision: 'I noticed Stripe recently launched [Feature] — I was curious about how your team prioritized that over other items on the roadmap.' This works because it shows three things: you use the product, you think about product decisions, and you have genuine curiosity about the 'why' behind the 'what.'\n\nTech culture is also more casual than finance or consulting. Your messages can be shorter, more direct, and less formal. 'Hey' instead of 'Dear.' A reference to a blog post they wrote or a conference talk they gave. A mention of a side project you're working on. The tone should feel like one curious person reaching out to another, not a formal business request.\n\nThat said, you still need structure: who you are (one sentence), why you're reaching out (reference something specific about their work), and what you're asking for (15 minutes). Keep it under 80 words. Send Tuesday through Thursday.\n\nTrack everything in your Contacts tab. Even in casual tech networking, organized follow-up separates people who build real relationships from people who accumulate LinkedIn connections.",
    subtasks: [
      { id: "t2-1", label: "For each contact, identify a specific product feature, launch, or decision at their company that interests you", completed: false },
      { id: "t2-2", label: "Draft outreach messages: under 80 words, reference the specific product detail, ask for 15 minutes", completed: false },
      { id: "t2-3", label: "Use the AI template as a starting point, then personalize with product-specific references", completed: false },
      { id: "t2-4", label: "Send all 5 messages — tech outreach can be more casual but should still be clear and specific", completed: false },
      { id: "t2-5", label: "Update each contact's status to 'Messaged' in your Contacts tab", completed: false },
      { id: "t2-6", label: "Follow up after 5 business days if no response", completed: false },
    ],
    internationalConsiderations: "In US tech, networking is less formal than finance or consulting. It's common to connect over shared interests in products or side projects. Your outreach can be more casual — but still purposeful.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "tech-outreach",
      confirmationLabel: "I have personalized and sent this message.",
    },
    practiceQuiz: [
      {
        question: "What makes tech outreach fundamentally different from finance or consulting outreach?",
        options: [
          "Tech professionals don't respond to cold messages",
          "You can reference specific, publicly visible products — making your outreach naturally more authentic and product-focused",
          "Tech networking only happens at conferences",
          "Tech outreach requires a technical background"
        ],
        correctIndex: 1,
        explanation: "Tech products are public and usable, giving you concrete, authentic talking points that demonstrate product thinking — the core PM skill."
      }
    ],
    reflectionPrompts: [
      "Which product reference in your outreach do you think was most compelling?",
      "How did the casual tone of tech outreach compare to what you expected?",
      "What product decisions at your target companies are you most genuinely curious about?"
    ],
    completionGate: { type: "text", prompt: "Paste one of your outreach messages (anonymize if needed):", placeholder: "Hey [Name], I noticed [Company]'s recent launch of..." },
  },
  {
    title: "Conduct 3 Informational Interviews & Learn Product Vocabulary",
    objective: "Have 3 conversations with PMs or engineers, learn each company's product culture, and understand what 'product sense' means at different organizations.",
    whyItMatters: "Product interviews test your ability to think like the company thinks. Google PMs think in data. Stripe PMs think in developer experience. Only real conversations reveal these differences.",
    conceptCoaching: "Product and tech informational interviews have a unique dynamic: they're often more collaborative and less hierarchical than finance or consulting conversations. PMs and engineers tend to be excited about their products and happy to discuss product decisions with someone who's genuinely interested.\n\nYour goal is to understand three things about each company: How do they make product decisions? What does their PM process look like? And what makes a great candidate in their culture? These answers vary dramatically: at Google, data drives everything. At Stripe, developer empathy is paramount. At Amazon, 'working backwards' from the customer is the methodology.\n\nPrepare questions that reveal these cultural differences: 'How does your team prioritize features?' 'What's the balance between data-driven decisions and product intuition here?' 'What frameworks do your PMs use most frequently?' These questions show product maturity.\n\nIf you've built a product artifact — a spec, teardown, or prototype — this is the perfect time to mention it. 'I actually wrote a feature spec for [Product] — I'd love your perspective on whether my approach to prioritization makes sense.' This transforms the conversation from student-asks-professional to peer-discusses-product.\n\nPay close attention to the vocabulary each person uses. If they say 'customer obsession,' 'working backwards,' 'bar raiser' — those are Amazon terms. If they say 'north star metric,' '10x thinking,' 'launch and iterate' — those are Google/tech startup terms. You'll need this vocabulary in interviews.",
    subtasks: [
      { id: "t3-1", label: "Before each call, use the company's product. Form 2-3 genuine questions about product decisions you observe.", completed: false },
      { id: "t3-2", label: "Prepare 5 questions for each call: product process, prioritization, what makes great candidates, company culture", completed: false },
      { id: "t3-3", label: "During calls: listen 70%, speak 30%. Pay attention to the vocabulary and frameworks they use.", completed: false },
      { id: "t3-4", label: "If you have a product artifact, mention it naturally and ask for feedback", completed: false },
      { id: "t3-5", label: "Note the specific vocabulary each company uses (e.g., 'working backwards', 'north star metric', 'bar raiser')", completed: false },
      { id: "t3-6", label: "Send thank-you within 24 hours referencing a specific product insight from the conversation", completed: false },
      { id: "t3-7", label: "Update contacts to 'Call Completed' and set follow-up dates", completed: false },
    ],
    internationalConsiderations: "US tech interviews expect you to ask clarifying questions before diving in. 'Just to make sure I'm aligned — are we designing for mobile or web? What's the primary user segment?' shows mature product thinking, not uncertainty.",
    resources: [],
    aiTemplate: {
      label: "Post-Call Follow-Up",
      templateId: "tech-thankyou",
      confirmationLabel: "I have sent the follow-up.",
    },
    practiceQuiz: [
      {
        question: "Why should you pay attention to the specific vocabulary PMs use during informational interviews?",
        options: [
          "To sound smarter in casual conversation",
          "Each company has its own product culture and terminology — using their vocabulary in interviews shows you understand their approach",
          "To create a glossary for your notes",
          "Vocabulary doesn't matter in PM interviews"
        ],
        correctIndex: 1,
        explanation: "Using Amazon-speak in an Amazon interview ('working backwards,' 'customer obsession') or Google-speak at Google ('10x thinking,' 'data-driven') signals cultural fit and genuine understanding."
      }
    ],
    reflectionPrompts: [
      "How does the PM role differ across the companies you spoke with?",
      "What vocabulary or frameworks came up most frequently?",
      "Which company's product culture resonated most with how you naturally think?"
    ],
    completionGate: { type: "text", prompt: "Who did you speak with and what's the key product culture insight from each?", placeholder: "e.g., Kevin L. (PM at Stripe) — developer experience is the #1 priority, data fluency valued over MBA..." },
  },
  {
    title: "Secure Referrals & Apply to 5 Product/Tech Roles",
    objective: "Convert networking relationships into referrals and submit tailored applications to 5 PM or tech roles. Include portfolio work where possible.",
    whyItMatters: "Referrals increase your interview rate by 5-10x at tech companies. Combined with a product artifact and tailored application, you become a standout candidate.",
    conceptCoaching: "Tech referrals work slightly differently from finance. In many tech companies, referral programs are formalized — employees earn bonuses for successful referrals, and there's an internal system for submitting them. This means asking for a referral isn't just acceptable, it's expected.\n\nThe best approach: 'I'm planning to apply to the [Role] at [Company]. Would you be willing to submit a referral through your internal system? Happy to send you my resume and the job link.' Most PMs and engineers are comfortable with this request, especially after you've had a good conversation.\n\nFor your applications, tech companies generally care less about cover letters and more about your resume, portfolio, and referral. Make sure your resume emphasizes impact and outcomes — 'Increased user retention by 15% by redesigning the onboarding flow' is better than 'Worked on the onboarding team.'\n\nIf you've built a product artifact — a spec, feature teardown, or prototype — link to it prominently. This alone puts you ahead of most applicants.\n\nImportant tech-specific timing: apply on the company career page, not through third-party job boards. Many tech companies specifically de-prioritize applications from LinkedIn Easy Apply or Indeed. Going directly through the company portal, with a referral, is the highest-signal application method.",
    subtasks: [
      { id: "t4-1", label: "Identify 2-3 contacts who were most engaged and ask for referrals through their company's internal system", completed: false },
      { id: "t4-2", label: "Send each referrer your updated resume and a direct link to the job posting", completed: false },
      { id: "t4-3", label: "Apply on each company's career page directly — avoid third-party job boards", completed: false },
      { id: "t4-4", label: "Include a link to your product artifact or portfolio in your application", completed: false },
      { id: "t4-5", label: "Save each company in your Companies tab with status 'Applied'", completed: false },
      { id: "t4-6", label: "Send a brief note to referrers confirming you've applied", completed: false },
    ],
    internationalConsiderations: "In US tech, it's normal to apply to multiple companies simultaneously and openly discuss competing timelines. Be transparent: 'I'm currently interviewing at [X] and [Y] with a timeline of [date].' This is expected and professional.",
    resources: [],
    practiceQuiz: [
      {
        question: "Why should you avoid applying through third-party job boards (LinkedIn Easy Apply, Indeed) for tech roles?",
        options: [
          "Third-party sites charge application fees",
          "Many tech companies de-prioritize applications from these sources — applying directly through the company career page with a referral is the highest-signal method",
          "These sites don't list tech roles",
          "Referrals can only be linked to direct applications"
        ],
        correctIndex: 1,
        explanation: "Direct applications through the company career page signal higher intent and are easier for the company to track alongside referrals."
      }
    ],
    reflectionPrompts: [
      "How did your networking conversations improve your application materials?",
      "Which application felt strongest? What made it different?",
      "What would you do differently in your referral-building process next time?"
    ],
    completionGate: { type: "text", prompt: "List the companies and roles you applied to with referral status:", placeholder: "e.g., Google (APM, referral from Kevin L.), Stripe (PM Intern, no referral)..." },
  },
  {
    title: "Build a Product Artifact & Demonstrate Skills",
    objective: "Create 1 concrete product artifact — a PRD, feature teardown, or functional prototype — that demonstrates your product thinking.",
    whyItMatters: "PM and tech interviews test your ability to think through products. A real artifact is the strongest possible signal of product sense. It gives you something tangible to discuss that most candidates don't have.",
    conceptCoaching: "Here's what separates great PM candidates from good ones: great candidates can point to something they built. Not something they talked about, not something they planned — something real. A product spec, a feature teardown with data, a functional prototype, a user research study with actionable insights.\n\nThe format matters less than the thinking it demonstrates. Choose something aligned with your target role: a PRD (Product Requirements Document) for a feature you'd build at a target company, a competitive analysis showing how two products differ in their approach to the same problem, a user research study identifying an unmet need, or a functional prototype using Figma or no-code tools.\n\nWhatever you choose, it must include: a clear problem statement, evidence for why this problem matters (data, user feedback, market analysis), a proposed solution with user flows, and metrics for how you'd measure success. This structure mirrors how PMs actually work.\n\nUS tech culture deeply values 'builder mentality.' Launching something imperfect is valued infinitely more than planning something perfect. Don't spend 3 weeks polishing a spec — spend 1 week building it, get feedback, and iterate.\n\nThis artifact becomes a conversation piece in interviews. When asked 'Tell me about a product you admire,' you can say: 'Let me actually show you a spec I wrote for [Product].' This shifts you from candidate to peer.",
    subtasks: [
      { id: "t5-1", label: "Choose your format: PRD for a feature, feature teardown, competitive analysis, user research study, or prototype", completed: false },
      { id: "t5-2", label: "If building: use Figma, Replit, or Notion to create something functional. If analyzing: use real product data.", completed: false },
      { id: "t5-3", label: "Include: problem statement, evidence (data or user insights), proposed solution with user flows, and success metrics", completed: false },
      { id: "t5-4", label: "Keep it focused — a deep analysis of one feature beats a shallow overview of ten", completed: false },
      { id: "t5-5", label: "Get feedback from at least 1 PM, engineer, or classmate with product experience", completed: false },
      { id: "t5-6", label: "Prepare a 2-minute walkthrough of your artifact for interviews", completed: false },
    ],
    internationalConsiderations: "US tech companies deeply value 'builder mentality.' Launching something imperfect is valued more than planning something perfect. Don't over-polish — ship it, get feedback, and iterate.",
    resources: [
      { title: "How to Write a Product Spec (Lenny's Newsletter)", url: "https://www.lennysnewsletter.com/p/how-to-write-a-product-spec" },
      { title: "Figma for Prototyping", url: "https://www.figma.com" },
    ],
    practiceQuiz: [
      {
        question: "What must every product artifact include to demonstrate PM-level thinking?",
        options: [
          "Beautiful visual design and animations",
          "A clear problem statement, evidence for why it matters, a proposed solution, and success metrics",
          "Code that actually works in production",
          "A comprehensive business plan"
        ],
        correctIndex: 1,
        explanation: "PM thinking is demonstrated through structured problem-solving: identifying the problem, supporting it with evidence, proposing a solution, and defining how you'd measure success."
      }
    ],
    reflectionPrompts: [
      "What was the hardest part of building your artifact — defining the problem or proposing the solution?",
      "How would you present this artifact in an interview setting?",
      "What feedback did you receive, and how did you incorporate it?"
    ],
    completionGate: { type: "text", prompt: "Describe what you built/analyzed and the key insight:", placeholder: "e.g., Wrote a PRD for a Notion templates marketplace — key insight was that discovery, not creation, is the bottleneck..." },
  },
  {
    title: "Master Product/Tech Interviews",
    objective: "Be able to answer product design, estimation, and behavioral questions confidently. Complete at least 3 mock PM interviews.",
    whyItMatters: "PM interviews test structured thinking across multiple dimensions simultaneously. Without extensive practice, even strong candidates stumble under the pressure of thinking out loud.",
    conceptCoaching: "Product interviews typically test four areas: product design ('Design a product for X'), estimation ('How many piano tuners are in Chicago?'), behavioral ('Tell me about a time you influenced without authority'), and sometimes technical ('How would you design the backend for this feature?').\n\nFor product design, use a structured approach: start by asking clarifying questions (user segment, platform, constraints), define the user problem, brainstorm solutions, prioritize using a framework (impact vs. effort), detail the top solution, and define success metrics. The key differentiator is starting with clarifying questions — this shows you don't jump to solutions.\n\nFor estimation, the structure matters more than the answer. Break the problem down, state your assumptions clearly, and do the math out loud. Interviewers want to see how you think, not whether you know the exact number.\n\nFor behavioral questions, use the STAR format but emphasize the 'Action' — what specifically did YOU do? PM behavioral questions focus on cross-functional influence, data-driven decisions, and navigating ambiguity.\n\nPractice is critical. You need to hear yourself think out loud for 30-40 minutes. Record yourself and watch the playback. Do at least 3 full mock interviews with timing. The gap between 'I know the answer' and 'I can articulate the answer under pressure in 5 minutes' is enormous.",
    subtasks: [
      { id: "t6-1", label: "Practice 3 product design questions out loud: structure with clarifying questions → problem → solutions → prioritize → metrics", completed: false },
      { id: "t6-2", label: "Practice 3 estimation questions: break down the problem, state assumptions, do math out loud", completed: false },
      { id: "t6-3", label: "Write 5 STAR behavioral stories: cross-functional influence, data-driven decision, navigating ambiguity, leadership, customer focus", completed: false },
      { id: "t6-4", label: "Prepare company-specific 'Why [Company]?' answers using insights from your informational interviews", completed: false },
      { id: "t6-5", label: "Complete at least 3 full mock PM interviews with timing (30-40 minutes each)", completed: false },
      { id: "t6-6", label: "Record at least 1 mock interview and review the recording for areas to improve", completed: false },
    ],
    internationalConsiderations: "Starting a product design question with clarifying questions is a positive signal, not a sign of uncertainty. 'Before I dive in — who is the target user? Is this mobile or web? What's the primary use case?' shows mature product thinking.",
    resources: [
      { title: "Exponent PM Interview Prep", url: "https://www.tryexponent.com" },
      { title: "Cracking the PM Interview (Book)", url: "https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818" },
    ],
    practiceQuiz: [
      {
        question: "What's the first thing you should do when given a product design question in an interview?",
        options: [
          "Start sketching a solution immediately",
          "Ask clarifying questions about the user, platform, and constraints before proposing anything",
          "List all possible features",
          "Ask what the interviewer thinks the answer should be"
        ],
        correctIndex: 1,
        explanation: "Starting with clarifying questions before proposing solutions is the #1 signal of PM maturity. It shows you think about problems before jumping to solutions."
      }
    ],
    reflectionPrompts: [
      "After practicing, which interview type (design, estimation, behavioral) do you feel strongest in?",
      "What feedback came up most frequently from your mock interview partners?",
      "How has your approach to product thinking changed since you started this roadmap?"
    ],
    completionGate: { type: "number", prompt: "How many full mock PM interviews have you completed?", placeholder: "e.g., 3" },
  },
];

const GENERAL_TASKS: TaskTemplate[] = [
  {
    title: "Strategic Alumni Research & Target Mapping",
    objective: "Research 10 alumni in your target field on LinkedIn. Map career patterns, identify common skills, and select 5 strong outreach candidates.",
    whyItMatters: "Networking is the #1 way jobs are filled in the US. Most roles are filled through connections before they're posted publicly. Your alumni network is your most valuable asset — and research comes before outreach.",
    conceptCoaching: "Here is the most important thing you will learn in your entire job search: the US job market runs on relationships, not applications. If you're coming from a culture where jobs are found by applying to postings, submitting a resume, and waiting for a response, you need to fundamentally reset your expectations.\n\nHere's how it actually works in the US, especially for competitive roles: you identify people at target companies. You build genuine relationships with them through conversations. You earn their trust by being curious, thoughtful, and professional. They refer you internally. You interview with an advantage because someone inside the company vouched for you. This is not nepotism or unfairness — it's the system, and it works because employers trust their people's judgment.\n\nThe numbers back this up: referral candidates are hired at a rate of roughly 1 in 16, compared to 1 in 152 for online applicants. That's nearly 10x more effective. For international students who need visa sponsorship, the gap is even larger — a referral reduces the perceived risk of sponsoring you.\n\nYour first step is research, not outreach. Before you message anyone, you need to understand the landscape: who from your school works in your target field? Where did they end up? What does the typical career path look like? What skills appear most frequently? This intelligence shapes your messaging, your interview prep, and even which companies you prioritize.\n\nApproach this like a research project. You're gathering data about your target ecosystem. The outreach comes next, and it will be dramatically more effective because you've done the homework first.",
    subtasks: [
      { id: "g1-1", label: "Open LinkedIn and navigate to your school's Alumni tab. Filter by your target industry and geography.", completed: false },
      { id: "g1-2", label: "Scroll through at least 30 alumni profiles. Note which companies and roles appear most frequently.", completed: false },
      { id: "g1-3", label: "For 10 alumni, record: name, company, role, years in position, and any shared background (country, major, etc.)", completed: false },
      { id: "g1-4", label: "Identify 3 skills that appear across multiple profiles in your target field", completed: false },
      { id: "g1-5", label: "Map 3 common career paths — how did people get from school to where they are now?", completed: false },
      { id: "g1-6", label: "Check H-1B sponsorship data for your top companies on myvisajobs.com", completed: false },
      { id: "g1-7", label: "Select 5 alumni to contact — prioritize recent graduates, shared backgrounds, and people at your top-choice companies", completed: false },
      { id: "g1-8", label: "Add all 5 to your Contacts tab with status 'Identified' and their LinkedIn URL", completed: false },
    ],
    internationalConsiderations: "In the US, specificity is valued over humility when discussing career goals. 'I want to be a product marketing manager at a B2B SaaS company' is much more effective than 'I'm open to anything.' Use your research to sharpen your own positioning.",
    resources: [
      { title: "H-1B Sponsorship Data", url: "https://www.myvisajobs.com" },
    ],
    practiceQuiz: [
      {
        question: "Why does researching alumni come BEFORE reaching out?",
        options: [
          "Because LinkedIn requires you to view profiles before messaging",
          "Because research gives you the intelligence to write personalized, compelling outreach that gets responses",
          "Because you need to wait 24 hours between profile views and messages",
          "Because alumni profiles change frequently"
        ],
        correctIndex: 1,
        explanation: "Personalized outreach based on genuine research gets 3-5x higher response rates than generic messages. The research IS the preparation for effective networking."
      },
      {
        question: "Referral candidates are hired at roughly what rate compared to online applicants?",
        options: [
          "2x more likely",
          "5x more likely",
          "10x more likely (1 in 16 vs. 1 in 152)",
          "100x more likely"
        ],
        correctIndex: 2,
        explanation: "Referrals are hired at roughly 1 in 16, compared to 1 in 152 for online applicants. This is why networking is the #1 priority — not applications."
      }
    ],
    reflectionPrompts: [
      "What patterns did you notice in the career paths of alumni from your school?",
      "Were there any companies or roles that appeared more frequently than you expected?",
      "How does your own background compare to the alumni you researched? Where do you see alignment?"
    ],
    completionGate: { type: "text", prompt: "List your 5 selected alumni contacts with company and role:", placeholder: "e.g., Sarah L. at Deloitte (Strategy Analyst), Mike T. at Amazon (PM)..." },
  },
  {
    title: "Send 5 Personalized Outreach Messages",
    objective: "Draft and send personalized outreach to your 5 researched alumni. Aim for at least 2 responses.",
    whyItMatters: "Cold outreach is how every successful job candidate builds their professional network. The people who get offers are the people who had conversations first.",
    conceptCoaching: "Let's address the elephant in the room: reaching out to people you don't know is uncomfortable. If you come from a culture where this kind of initiative feels presumptuous or forward, you're not alone — many international students feel this way. But here's what you need to understand about American professional culture: proactive outreach isn't just accepted, it's expected. It's how the system works.\n\nWhen you send a message to an alumnus asking for 15 minutes of their time, you're not being a burden. You're doing exactly what every successful professional has done before you. Many people genuinely enjoy helping students from their alma mater — it makes them feel connected to their school and valued as mentors.\n\nThe difference between a message that gets a response and one that gets ignored comes down to three things: specificity (you've done your research), brevity (under 100 words), and a clear ask (exactly 15 minutes, this week or next).\n\nA bad message: 'Hi, I'm an MBA student interested in your field. Can we connect?'\n\nA good message: 'Hi Sarah, I'm a first-year MBA at [School] focused on [Field]. I noticed you transitioned from [Previous Role] to [Current Role] at [Company] — I'm fascinated by that career shift and would love to hear what drove it. Would you have 15 minutes for a quick call this week or next?'\n\nThe good message works because it shows specific research, genuine curiosity, and respect for their time. Send Tuesday through Thursday, 9-11am in the recipient's time zone. If no response after 5 business days, send one polite follow-up. After that, move on.\n\nA 30-40% response rate is excellent. That means 2-3 responses from 5 messages. Don't be discouraged by silence — professionals are busy, and not responding isn't personal.",
    subtasks: [
      { id: "g2-1", label: "Review each contact's LinkedIn profile one more time — note something specific about their career path or current work", completed: false },
      { id: "g2-2", label: "Draft your first message: under 100 words, mention a specific detail about their career, ask for exactly 15 minutes", completed: false },
      { id: "g2-3", label: "Use the AI template as a starting point, then personalize each message with the specific details you noted", completed: false },
      { id: "g2-4", label: "Send all 5 messages between Tuesday-Thursday, 9-11am in their time zone", completed: false },
      { id: "g2-5", label: "Update each contact's status to 'Messaged' in your Contacts tab and log the date", completed: false },
      { id: "g2-6", label: "Set a reminder: follow up after 5 business days if no response (one polite follow-up only)", completed: false },
    ],
    internationalConsiderations: "American professionals expect you to drive networking conversations. Come with specific questions and a clear ask. Asking for '15 minutes' is standard and respectful. An open-ended 'let me know if you're ever free' makes it harder for them to say yes.",
    resources: [],
    aiTemplate: {
      label: "Connection Request Message",
      templateId: "general-outreach",
      confirmationLabel: "I have personalized and sent this message.",
    },
    practiceQuiz: [
      {
        question: "What's the most important element of an effective cold outreach message?",
        options: [
          "Mentioning your GPA and academic achievements",
          "Being as long and detailed as possible to show your interest",
          "Referencing something specific about the person's career that shows you've done your research",
          "Asking directly about job openings at their company"
        ],
        correctIndex: 2,
        explanation: "Specificity demonstrates genuine research and interest. It transforms your message from 'another generic request' to 'someone who took the time to learn about me.'"
      }
    ],
    reflectionPrompts: [
      "How did it feel to send cold messages? What was harder or easier than you expected?",
      "Which of your 5 messages do you think was strongest and why?",
      "What would you do differently in your next round of outreach?"
    ],
    completionGate: { type: "text", prompt: "Paste one of your outreach messages (anonymize if needed):", placeholder: "Hi [Name], I'm a [year] at [school]..." },
  },
  {
    title: "Conduct 3 Informational Interviews & Build Relationships",
    objective: "Have 3 conversations with professionals in your target field, document key insights, and send thank-you notes within 24 hours.",
    whyItMatters: "Informational interviews give you insider knowledge, referral relationships, and the confidence to navigate interviews. They are the bridge between networking and getting hired.",
    conceptCoaching: "You've done the research and sent the messages. Now comes the most valuable part of your job search: real conversations with real professionals who work in the industry you want to break into.\n\nAn informational interview is NOT a job interview. It's a conversation where you're the one asking questions. Your goal is threefold: learn about the industry and company, build a genuine relationship, and position yourself as someone worth remembering when opportunities arise.\n\nHere's how a great informational interview flows: You start with 2 minutes of light conversation — 'How's your week going?' or 'I saw [Company] just announced [News] — must be exciting.' Then you transition to your prepared questions. You should have 5 ready, but good conversations flow naturally, so be flexible.\n\nThe best questions invite stories: 'What surprised you most about this role?' 'What do you wish someone had told you when you were in my position?' 'What separates the people who thrive here from those who struggle?' These questions give you rich, specific insights you can't get from any website.\n\nCritical rules:\n- Listen 70% of the time, speak 30%\n- Take notes during the call\n- Do NOT ask for a job or referral during this conversation\n- At the end, ask: 'Is there anyone else you'd recommend I speak with?' (this expands your network exponentially)\n- Ask: 'Would you be open to staying in touch as I progress?'\n\nWithin 24 hours — not 48 hours, not 'sometime this week' — send a thank-you email. Reference something specific they said. This single habit separates you from 90% of people who send generic thanks or no thanks at all.\n\nLog everything in your contact tracker: what you discussed, key insights, and when to follow up (6-8 weeks later with a brief update on your progress).",
    subtasks: [
      { id: "g3-1", label: "Before each call, research the person's company: recent news, products, industry position", completed: false },
      { id: "g3-2", label: "Prepare 5 questions for each call — include at least 1 about their specific company or career transition", completed: false },
      { id: "g3-3", label: "During each call: start with small talk (2 min), then transition to questions. Listen 70%, speak 30%.", completed: false },
      { id: "g3-4", label: "Do NOT ask for a job or referral. Ask: 'Is there anyone else you'd recommend I speak with?'", completed: false },
      { id: "g3-5", label: "Take notes during each call — capture specific advice, insights, and names they mention", completed: false },
      { id: "g3-6", label: "Send a thank-you email within 24 hours referencing something specific they said", completed: false },
      { id: "g3-7", label: "Log 3 insights from each call in your contact notes", completed: false },
      { id: "g3-8", label: "Update contacts to 'Call Completed' and set follow-up dates 6-8 weeks out", completed: false },
    ],
    internationalConsiderations: "It's completely acceptable to ask about visa sponsorship during networking calls. Frame it professionally: 'I want to be upfront — I'll need H-1B sponsorship. Does your company typically sponsor for this role?' This is a standard professional question.",
    resources: [],
    aiTemplate: {
      label: "Post-Call Thank You Email",
      templateId: "general-thankyou",
      confirmationLabel: "I have sent the follow-up email.",
    },
    practiceQuiz: [
      {
        question: "What should you NEVER do during an informational interview?",
        options: [
          "Take notes during the call",
          "Ask about their career path",
          "Directly ask for a job or referral — that comes later, after you've built trust",
          "Ask about visa sponsorship policies"
        ],
        correctIndex: 2,
        explanation: "Asking for a job during an informational interview makes the conversation feel transactional and damages trust. Referral requests come after you've built a genuine relationship over multiple interactions."
      }
    ],
    reflectionPrompts: [
      "What was the most surprising insight from your conversations?",
      "How has your understanding of your target field changed after talking to people who work in it?",
      "What skill or quality was mentioned most frequently as important?"
    ],
    completionGate: { type: "text", prompt: "Who did you speak with and what's the key insight from each?", placeholder: "e.g., Sarah L. at Deloitte — learned that advisory roles value industry expertise over technical skills..." },
  },
  {
    title: "Secure Referrals & Submit 5 Applications",
    objective: "Convert 2-3 networking relationships into referrals and submit tailored applications to 5 companies with strategic timing.",
    whyItMatters: "A referral transforms your application from anonymous to sponsored. Combined with tailored materials, you become a standout candidate in any applicant pool.",
    conceptCoaching: "This is where your networking investment pays dividends. You've built relationships, had meaningful conversations, and developed real knowledge about your target companies. Now it's time to ask for referrals and apply — in that order.\n\nAsking for a referral follows a simple principle: be direct, respectful, and make it easy to decline. After at least one good conversation and a thoughtful thank-you, reach out again: 'I've really valued our conversations about [Company]. I'm planning to apply for the [Role] position. Would you be comfortable submitting a referral? I completely understand if the timing doesn't work.'\n\nImportant: submit the referral BEFORE your application. At most companies, the referral needs to be in the system first for it to be linked to your application. If you apply first, the referral may not count.\n\nFor your applications, each cover letter should reference specific people and insights: 'After speaking with Sarah about [Company]'s approach to [Initiative], I was particularly drawn to...' This demonstrates genuine research and internal relationships — two things that generic applicants can't offer.\n\nApply through company career portals directly, not through third-party job boards. Track every application in your Companies tab with the date, whether you had a referral, and any response.\n\nIf someone declines your referral request, be gracious: 'I completely understand, thank you for considering it.' One declined referral doesn't close any doors. There are many paths to the same destination.",
    subtasks: [
      { id: "g4-1", label: "Review your informational interview contacts — identify 2-3 who seemed most supportive and engaged", completed: false },
      { id: "g4-2", label: "Send referral request messages: be direct, specify the role, and give an easy out", completed: false },
      { id: "g4-3", label: "If they agree, send your updated resume and the direct job posting link immediately", completed: false },
      { id: "g4-4", label: "Confirm referrals are submitted BEFORE you apply", completed: false },
      { id: "g4-5", label: "Write tailored cover letters for each company referencing specific people and conversations", completed: false },
      { id: "g4-6", label: "Submit 5 applications through company career portals directly", completed: false },
      { id: "g4-7", label: "Save each company in your Companies tab with status 'Applied'", completed: false },
      { id: "g4-8", label: "Send a brief note to referrers confirming you've applied", completed: false },
    ],
    internationalConsiderations: "Asking for a referral is normal in the US — many companies offer referral bonuses, so it can benefit the person too. Frame it professionally and make it easy for them to say yes or no.",
    resources: [],
    practiceQuiz: [
      {
        question: "Why must the referral be submitted BEFORE you submit your application?",
        options: [
          "Because companies reject applications without referrals",
          "Because the referral needs to be in the system first to be properly linked to your application",
          "Because referrals expire after 24 hours",
          "Because the referrer needs to review your application"
        ],
        correctIndex: 1,
        explanation: "Most applicant tracking systems link referrals to applications by timestamp. If your application arrives before the referral, they may not be connected."
      }
    ],
    reflectionPrompts: [
      "How did it feel to ask for referrals? Was it easier or harder than you expected?",
      "Which of your 5 applications feels strongest, and what makes it different?",
      "What would you do differently in building relationships before the referral ask?"
    ],
    completionGate: { type: "text", prompt: "Which companies did you apply to and which had referrals?", placeholder: "e.g., Deloitte (referral from Sarah L.), Amazon (no referral), Google (referral from Mike T.)..." },
  },
  {
    title: "Resume Optimization & Skills Positioning",
    objective: "Produce a US-formatted, 1-page resume with quantified impact statements. Align your skills with what your networking revealed matters most.",
    whyItMatters: "Your resume should reflect what you've learned from your networking conversations. By this point, you know what skills and experiences your target employers actually value — now make sure your resume highlights them.",
    conceptCoaching: "Notice that this task comes AFTER networking, not before. This is intentional. Most students start their job search by updating their resume. But how can you write an effective resume if you don't yet know what your target employers actually value? Your informational interviews have given you that intelligence.\n\nNow you can write a resume that speaks directly to what matters. If your networking revealed that your target companies value data-driven decision making, lead your bullets with quantified results. If they value cross-functional leadership, structure your experiences to highlight collaboration.\n\nUS resumes follow specific conventions that differ from CVs used in other countries: no photo, no personal details (age, nationality, marital status), no 'Objective' statement, strictly 1 page (2 pages only with 5+ years of experience). Every bullet point must answer: 'So what?'\n\nThe formula for strong bullets: '[Strong verb] [what you did] [with what tools/methods], resulting in [quantified outcome].' For example: 'Redesigned customer onboarding flow using A/B testing, increasing 30-day retention by 18%.' Not: 'Responsible for customer onboarding.'\n\nGet feedback from at least 2 people: one familiar with US resume conventions and ideally one person in your target field. Your school's career center can help, but peer review from someone who's been through the same recruiting process is often more practical.",
    subtasks: [
      { id: "g5-1", label: "Review insights from your networking conversations — what skills and experiences do your target employers value most?", completed: false },
      { id: "g5-2", label: "Remove all photos, personal details, and references to age/nationality/marital status from your resume", completed: false },
      { id: "g5-3", label: "Keep to 1 page. If you have 5+ years of experience, 2 pages maximum.", completed: false },
      { id: "g5-4", label: "Rewrite every bullet using the formula: [Strong verb] + [what you did] + [quantified result]", completed: false },
      { id: "g5-5", label: "Prioritize experiences that align with what your networking contacts said matters most", completed: false },
      { id: "g5-6", label: "Get feedback from 2 people: one familiar with US resume conventions and one in your target field", completed: false },
    ],
    internationalConsiderations: "US resumes are significantly different from CVs used in Europe, Asia, and other regions. No photo. No personal details. No 'Objective' statement. It's 'resume,' not 'CV.' Every bullet must answer: 'So what?'",
    resources: [
      { title: "Harvard Business School Resume Guide", url: "https://www.hbs.edu/recruiting/resources/Pages/resume-guidelines.aspx" },
    ],
    practiceQuiz: [
      {
        question: "Why does this roadmap place resume optimization AFTER networking, not before?",
        options: [
          "Because resumes don't matter",
          "Because you can't write a resume without a job description",
          "Because networking reveals what your target employers actually value — your resume should reflect those insights",
          "Because career centers are only available later in the semester"
        ],
        correctIndex: 2,
        explanation: "Your resume should be tailored to what employers actually value, which you only learn through real conversations. A resume written in a vacuum may emphasize the wrong things."
      }
    ],
    reflectionPrompts: [
      "How did your networking insights change what you emphasized on your resume?",
      "Which bullet point are you most proud of? Does it follow the quantified impact formula?",
      "What feedback did you receive that surprised you?"
    ],
    completionGate: { type: "confirm", prompt: "Confirm: My resume is 1 page, US-formatted, every bullet has a quantified result, and it's been reviewed by at least 1 person." },
  },
  {
    title: "Interview Preparation & Execution",
    objective: "Prepare 5 polished behavioral stories (STAR format), a 30-second elevator pitch, and complete at least 2 mock interviews.",
    whyItMatters: "US interviews are heavily behavioral. Without prepared, practiced stories, even the most qualified candidates fumble under pressure.",
    conceptCoaching: "Interviews in the US are largely behavioral — meaning they test how you've handled real situations in the past, not just what you know. The underlying assumption is: past behavior predicts future performance. This is why 'Tell me about a time when...' questions dominate US interviews.\n\nThe STAR format (Situation, Task, Action, Result) is your framework for answering these questions. But most candidates make a critical mistake: they spend too much time on the Situation and Task (the setup) and too little on the Action and Result (what you actually DID and what happened). Your Action section should be the longest — 50-60% of your answer — and should describe YOUR specific contributions, not what the team did.\n\nPrepare 5 stories covering: leadership, teamwork, overcoming a failure/challenge, taking initiative, and analytical/data-driven decision making. Each story should be 2-3 minutes when told out loud. Practice until they feel natural, not rehearsed.\n\nYour elevator pitch follows the Present → Past → Future format: 'I'm currently [Present — what you're doing now]. Before this, I [Past — relevant experience]. I'm focused on [Future — what you're pursuing and why].' This should take 30 seconds.\n\nFor common questions — 'Why this company?', 'Tell me about yourself', 'What's your weakness?' — draw on your networking conversations for authentic answers. 'After speaking with [Name] about [Company]'s approach to [Initiative], I was drawn to...' is infinitely more convincing than generic answers.\n\nPractice is non-negotiable. You need to hear yourself answer questions out loud, under time pressure, and get feedback. Do at least 2 mock interviews. Record yourself and watch the playback. The gap between knowing your stories and being able to deliver them confidently under pressure is enormous.",
    subtasks: [
      { id: "g6-1", label: "Write 5 STAR stories: leadership, teamwork, failure/learning, initiative, analytical/data-driven thinking", completed: false },
      { id: "g6-2", label: "For each story, make sure the Action section is the longest (50-60% of the answer) and describes YOUR specific contributions", completed: false },
      { id: "g6-3", label: "Craft your 30-second elevator pitch: Present → Past → Future", completed: false },
      { id: "g6-4", label: "Prepare 'Why this company?' answers using insights from your networking conversations", completed: false },
      { id: "g6-5", label: "Practice telling each story out loud (not just reading them) — time yourself: 2-3 minutes per story", completed: false },
      { id: "g6-6", label: "Complete at least 2 full mock interviews (30-40 minutes each) with a partner or career center", completed: false },
      { id: "g6-7", label: "Record at least 1 mock interview and review the recording for areas to improve", completed: false },
    ],
    internationalConsiderations: "The 'weakness' question is a test of self-awareness, not a trap. Choose a real weakness you've actively worked on and show growth. Saying 'I don't have any weaknesses' is the worst possible answer.",
    resources: [],
    practiceQuiz: [
      {
        question: "In a STAR-format answer, which section should take the MOST time?",
        options: [
          "Situation — set the scene thoroughly",
          "Task — explain exactly what was expected",
          "Action — describe YOUR specific contributions in detail (50-60% of the answer)",
          "Result — emphasize the outcome extensively"
        ],
        correctIndex: 2,
        explanation: "The Action section is where you demonstrate your value. Interviewers want to hear what YOU specifically did, not just the situation or the outcome."
      }
    ],
    reflectionPrompts: [
      "Which behavioral story do you feel most confident about? Which needs more work?",
      "How do your 'Why this company?' answers draw from real conversations you've had?",
      "After mock interviews, what was the #1 area for improvement?"
    ],
    completionGate: { type: "number", prompt: "How many full mock interviews have you completed?", placeholder: "e.g., 2" },
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
    conceptCoaching: "Not hearing back is the single most common experience in professional networking — and the one that discourages students the most. Here's the reality: people are busy. Your message landed in their inbox alongside 50 others. They may have read it, thought 'I should reply,' and then got pulled into a meeting. Silence is almost never personal.\n\nOne follow-up is expected and professional. The key is timing and tone: wait 5 business days, then send a brief message that adds value or context rather than just saying 'following up.' For example: 'Hi Sarah, I wanted to follow up on my message from last week. I recently read about [Company]'s work on [Project] and would love to hear your perspective. Still hoping for 15 minutes if you have time.'\n\nAfter 2 attempts with no response, move on gracefully. Never send a third follow-up. Silence after 2 messages is a polite decline, and pushing further damages your reputation.",
    subtasks: [
      { id: "a-nr-1", label: "Wait 5 business days after your initial message before following up", completed: false },
      { id: "a-nr-2", label: "Review your original message — was it too long? too generic? missing a specific ask?", completed: false },
      { id: "a-nr-3", label: "Draft a brief follow-up that adds new context or value, not just 'following up'", completed: false },
      { id: "a-nr-4", label: "Send the follow-up message to up to 3 unresponsive contacts", completed: false },
      { id: "a-nr-5", label: "If still no response after 2 attempts, update contact status and move on", completed: false },
    ],
    internationalConsiderations: "One follow-up is expected and professional. Two is the maximum. Never send three. If someone doesn't respond after 2 attempts, they're politely declining.",
    resources: [],
    completionGate: { type: "text", prompt: "Paste your revised follow-up message:", placeholder: "Hi [Name], I wanted to follow up..." },
    aiTemplate: {
      label: "Follow-Up Message",
      templateId: "general-followup",
      confirmationLabel: "I have sent this follow-up.",
    },
    reflectionPrompts: [
      "Looking at your original messages, what could you improve to increase response rates?",
      "How does it feel to follow up? Has it gotten easier with practice?"
    ],
  },
  interview: {
    title: "Interview Preparation Sprint",
    objective: "Complete targeted preparation for your upcoming interview in the next 48 hours.",
    whyItMatters: "Getting an interview is a major milestone — it means your profile stood out. Focused preparation in the 48 hours before dramatically improves performance.",
    conceptCoaching: "An interview invitation means your networking and application work paid off. Now is not the time to coast — it's the time to prepare with intensity and focus.\n\nThe 48-hour sprint before an interview should cover three areas: company deep-dive (latest news, products, leadership, challenges), role-specific prep (your 'Why this company?' and 'Why this role?' answers), and behavioral practice (your STAR stories adapted to this specific context).\n\nDraw on your informational interviews for authentic 'Why this company?' answers. If you spoke with someone at the firm, reference that conversation: 'After speaking with [Name] about [Company]'s approach to [Initiative], I was particularly excited about...' This kind of answer is impossible to fake and immediately credible.\n\nPrepare 2-3 thoughtful questions to ask at the end. In the US, not having questions is a red flag. Ask about team culture, current challenges, or what success looks like in the first 90 days.",
    subtasks: [
      { id: "a-iv-1", label: "Research the company: latest news, product launches, key leaders, recent challenges", completed: false },
      { id: "a-iv-2", label: "Prepare 3 specific 'Why this company?' points using insights from your networking calls", completed: false },
      { id: "a-iv-3", label: "Rehearse your 5 STAR stories, adapting each to be relevant to this specific role", completed: false },
      { id: "a-iv-4", label: "Do 1 focused mock interview tailored to this company's interview style", completed: false },
      { id: "a-iv-5", label: "Prepare 2-3 thoughtful questions to ask the interviewer (NOT about salary or benefits)", completed: false },
    ],
    internationalConsiderations: "In US interviews, asking questions at the end is mandatory. Never say 'No, I think you covered everything.' Ask about team culture, current challenges, or what success looks like in the first 90 days.",
    resources: [],
    completionGate: { type: "text", prompt: "What company is the interview with and what are your 3 'Why this company?' points?", placeholder: "e.g., McKinsey — (1) healthcare practice, (2) global model, (3) international track record" },
    reflectionPrompts: [
      "How confident do you feel about your preparation?",
      "What's your biggest concern going into this interview?"
    ],
  },
  visa: {
    title: "Visa Strategy Checkpoint",
    objective: "Verify your visa timeline and confirm target companies sponsor H-1B.",
    whyItMatters: "Visa status is the #1 differentiator for international student job searches. Understanding your timeline and options prevents costly mistakes.",
    conceptCoaching: "Visa strategy is not just a legal checkbox — it's a core part of your job search strategy. The companies you target, the timing of your applications, and even how you position yourself in interviews are all affected by your visa status.\n\nKey things to understand: OPT (Optional Practical Training) gives you 12 months of work authorization after graduation. If your degree is in a STEM field, you get an additional 24 months (STEM OPT extension). CPT (Curricular Practical Training) covers internships during your program.\n\nH-1B sponsorship is the longer-term visa path, and not all companies sponsor equally. Large companies (Big Tech, MBB, big banks) sponsor regularly. Mid-size companies are more variable. Startups rarely sponsor. Use myvisajobs.com to check sponsorship history.\n\nBeing transparent about your visa needs is not a weakness — it's a professional necessity. Frame it directly: 'I want to be upfront — I'll need H-1B sponsorship. Does your firm typically sponsor for this role?' Companies that sponsor expect this question.",
    subtasks: [
      { id: "a-vs-1", label: "Confirm your OPT eligibility and application timeline with your international student office", completed: false },
      { id: "a-vs-2", label: "If your degree is STEM-eligible, understand STEM OPT extension rules (24 additional months)", completed: false },
      { id: "a-vs-3", label: "Re-verify H-1B sponsorship history for your top 5 target companies on myvisajobs.com", completed: false },
      { id: "a-vs-4", label: "If doing an internship before graduation, understand CPT rules and restrictions", completed: false },
      { id: "a-vs-5", label: "Identify 2-3 Plan B companies with strong sponsorship records in case top choices don't work out", completed: false },
    ],
    internationalConsiderations: "It's completely acceptable to ask about visa sponsorship during networking calls and even early interviews. Frame it professionally: 'I want to be upfront — I'll need H-1B sponsorship. Does your firm typically sponsor for this role?'",
    resources: [
      { title: "USCIS OPT Information", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" },
    ],
    completionGate: { type: "text", prompt: "What's your visa status and timeline?", placeholder: "e.g., F-1 student, graduating May 2027, eligible for OPT + STEM extension" },
  },
  rejection: {
    title: "Process the Rejection and Pivot",
    objective: "Turn a rejection into actionable next steps and broaden your approach.",
    whyItMatters: "Rejection is universal in job searching. How you respond determines whether it's a setback or a redirect toward something better.",
    conceptCoaching: "Rejection stings. There's no shortcut around that. But here's something that might help: every successful professional you admire has been rejected multiple times. The difference between people who break in and people who give up is not talent — it's resilience and strategy.\n\nWhen you receive a rejection, give yourself 24 hours to be disappointed. That's real and human. Then move forward with a plan. First, reply to the rejection with grace: 'Thank you for letting me know. I really enjoyed learning about [Company]. Would you be willing to share any feedback that might help me in future applications?' Most people don't ask for feedback — doing so shows maturity and separates you from the crowd.\n\nThen analyze: was the rejection about fit (wrong culture match), skills (something you could improve), or timing (they'd already filled the role)? Each diagnosis leads to a different action. Fit → broaden your company targets. Skills → identify and close the gap. Timing → apply earlier next cycle.\n\nFinally, reach out to your network with an honest update. People are more willing to help someone who's resilient and transparent than someone who pretends everything is fine.",
    subtasks: [
      { id: "a-rj-1", label: "Allow yourself 24 hours to process the disappointment — this is normal and healthy", completed: false },
      { id: "a-rj-2", label: "Reply to the rejection thanking them and professionally asking for feedback", completed: false },
      { id: "a-rj-3", label: "Analyze: was it fit (wrong culture), skills gap (something to improve), or timing?", completed: false },
      { id: "a-rj-4", label: "Based on your analysis, identify 2-3 alternative companies or roles to pursue", completed: false },
      { id: "a-rj-5", label: "Reach out to 2 people in your network with an honest update and ask for guidance", completed: false },
    ],
    internationalConsiderations: "Asking for feedback after a rejection is professional and respected in the US. Most people don't do it, so you'll stand out positively.",
    resources: [],
    completionGate: { type: "text", prompt: "What did you learn from this rejection and what's your next step?", placeholder: "e.g., Rejected from Goldman — feedback was to get more deal experience. Pivoting to mid-market banks where I have stronger positioning..." },
    reflectionPrompts: [
      "Was the rejection about fit, skills, or timing? How does that change your strategy?",
      "What would you do differently if you could go through the process again?"
    ],
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
            conceptCoaching: t.conceptCoaching || "",
            practiceQuiz: t.practiceQuiz || undefined,
            reflectionPrompts: t.reflectionPrompts || undefined,
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
