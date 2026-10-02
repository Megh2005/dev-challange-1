"use client";

import React, { useState } from "react";
import { FaHardHat } from "react-icons/fa";
import {
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiCheckCircle,
} from "react-icons/fi";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: "General" | "Learning" | "AI & Support" | "Site & Verification";
}

const faqs: FaqItem[] = [
  {
    id: 1,
    category: "General",
    question: "What is ShramPark?",
    answer:
      "ShramPark is a mobile training platform made for construction workers on active job sites. It helps bridge the gap between engineering drawings, technical standards, and actual physical work on the ground. Workers can watch simple visual lessons and practice trade tasks directly on their mobile phones.",
  },
  {
    id: 2,
    category: "General",
    question: "Who can use ShramPark?",
    answer:
      "ShramPark is tailored specifically for construction site supervisors and civil engineers. Supervisors use it for site safety supervision, crew guidance, and AI visual audits, while civil engineers use it for offline IS-code structural calculations and technical verification.",
  },
  {
    id: 3,
    category: "Learning",
    question: "How can ShramPark help me learn a construction trade?",
    answer:
      "It breaks down complicated site tasks into short, step-by-step visual lessons with clear pictures and voice guidance. You can practice skills on your phone, test your knowledge with simple image quizzes, and then demonstrate your work to your site supervisor for real verification.",
  },
  {
    id: 4,
    category: "Learning",
    question: "What kind of training can I find here?",
    answer:
      "You will find practical, task-focused training on how to perform construction jobs safely and correctly. Lessons cover essential activities like cutting and bending steel reinforcement bars according to specifications and assembling timber formwork and staging.",
  },
  {
    id: 5,
    category: "Learning",
    question: "How does the learning work?",
    answer:
      "Learning follows a simple seven-step path. You set up your profile in your preferred language, pick your trade, follow your personalized lesson path, take a short visual quiz, and request a supervisor verification on site to receive your digital certificate.",
  },
  {
    id: 6,
    category: "Learning",
    question: "Do I need to read long manuals?",
    answer:
      "No, you do not need to read thick books or complicated manuals. All lessons are built around short demonstration videos, clear diagrams, and audio instructions so you can understand the work without having to read long paragraphs.",
  },
  {
    id: 7,
    category: "Learning",
    question: "Can I learn using videos and pictures?",
    answer:
      "Yes, ShramPark is designed visual-first. Every lesson uses two- to three-minute demonstration videos, step-by-step photos, and clear illustrations that show you exactly how tools should be held and how materials should be placed.",
  },
  {
    id: 8,
    category: "Learning",
    question: "Can I listen to instructions in my language?",
    answer:
      "Yes, ShramPark supports voice audio in regional Indian languages. You can listen to spoken explanations alongside every visual card, making it easy to learn even if you are not comfortable reading text.",
  },
  {
    id: 9,
    category: "Learning",
    question: "Can I use ShramPark when there is no internet?",
    answer:
      "Yes, ShramPark works reliably even when you have no mobile network or internet connection on site, such as in basements or remote areas. Your lessons stay available on your phone, and you can keep studying and taking quizzes without interruptions.",
  },
  {
    id: 10,
    category: "AI & Support",
    question: "How does the AI Coach help me?",
    answer:
      "The AI Coach acts as a friendly digital helper that explains difficult construction terms in simple, everyday words. It answers your questions using only the verified course material and can explain things in your preferred language.",
  },
  {
    id: 11,
    category: "AI & Support",
    question: "Can I ask the AI Coach questions about a lesson?",
    answer:
      "Yes, whenever you are confused about a step or term in a lesson, you can ask the AI Coach by typing or speaking. It will give you a clear, simple answer based strictly on the approved lesson content.",
  },
  {
    id: 12,
    category: "AI & Support",
    question: "Will the AI Coach give me engineering advice?",
    answer:
      "No, the AI Coach is strictly a learning assistant and is never an engineering authority. It cannot give independent structural advice, approve design changes, or perform structural calculations, which must always be handled by a qualified engineer or supervisor.",
  },
  {
    id: 13,
    category: "AI & Support",
    question: "How does the AI Co-Pilot help engineers?",
    answer:
      "The AI Co-Pilot assists site engineers and supervisors by summarizing technical standards, clarifying notes on complex structural drawings, and helping prepare site training summaries for worker briefings. It helps engineers communicate technical requirements to workers faster and more clearly.",
  },
  {
    id: 14,
    category: "AI & Support",
    question:
      "Can the system help me understand drawings or technical information?",
    answer:
      "Yes, the platform converts difficult engineering drawings and Indian Standard codes into simple visual cards and step-by-step guides. For example, it translates the IS 2502 code for reinforcement into clear pictures showing exact hook lengths, bend angles, and wire tying rules.",
  },
  {
    id: 15,
    category: "Site & Verification",
    question: "How does my supervisor verify my practical skills?",
    answer:
      "After you complete a module and pass the quiz on your phone, you send a verification request through the app. Your site supervisor then observes you performing the physical task on the job site and officially records your sign-off in the system.",
  },
  {
    id: 16,
    category: "Site & Verification",
    question: "Can I generate inspection and engineering reports?",
    answer:
      "Yes, SiteVision and Raghav AI allow you to generate and export official PDF compliance audit memos and step-by-step structural calculation sheets directly to your device.",
  },
  {
    id: 17,
    category: "Site & Verification",
    question: "How can ShramPark help supervisors?",
    answer:
      "Supervisors can easily track the learning progress of their crews, review who is ready for hands-on tasks, and conduct structured competency checks on site. It reduces the time spent repeating basic instructions and provides clear records of verified skills.",
  },
  {
    id: 18,
    category: "Site & Verification",
    question: "How can ShramPark help contractors?",
    answer:
      "Contractors get clear visibility into the verified skills and safety readiness of their entire workforce across job sites. This helps in assigning the right skilled workers to critical tasks, leading to better build quality, fewer safety accidents, and less wasted material.",
  },
  {
    id: 19,
    category: "Site & Verification",
    question: "How does ShramPark improve safety on construction sites?",
    answer:
      "Safety guidance is built directly into every practical lesson rather than taught as a separate lecture. Before starting any task, workers see the required safety gear, common hazards like pinch points or falling objects, and daily toolbox-talk reminders.",
  },
  {
    id: 20,
    category: "Site & Verification",
    question: "How can it help reduce mistakes and rework?",
    answer:
      "By showing the correct methods and standard tolerances before work begins, workers make fewer placement and bending mistakes. Doing the job right the first time prevents expensive structural rework, delays, and wasted materials like rebar and timber.",
  },
  {
    id: 21,
    category: "Site & Verification",
    question: "How does it connect training with actual site work?",
    answer:
      "Training is directly tied to physical site requirements and recognized building codes. Workers learn standard practices on their phone, practice simulated tasks in the sandbox, and must physically execute the work under supervisor inspection before receiving certification.",
  },
  {
    id: 22,
    category: "General",
    question: "Which trades are currently covered?",
    answer:
      "The current working prototype focuses on two core construction trades: Bar Bending (rebar cutting, bending, and tying) and Carpentry (formwork, shuttering, and staging). These represent two of the most critical structural tasks on any concrete build site.",
  },
  {
    id: 23,
    category: "General",
    question: "Will more construction trades be added?",
    answer:
      "Yes, the platform is designed to expand in the future to include additional trades such as masonry, plumbing, electrical work, welding, tiling, painting, scaffolding, concrete pouring, and equipment operation.",
  },
  {
    id: 24,
    category: "Learning",
    question: "Can the platform support different Indian languages?",
    answer:
      "Yes, the prototype supports multilingual learning so workers can study in their native tongue, and future plans include expanding support to more regional Indian languages with natural voice options.",
  },
  {
    id: 25,
    category: "Learning",
    question: "What happens to my learning progress when I am offline?",
    answer:
      "All your progress, completed lessons, and quiz answers are securely saved directly on your phone while you are offline. As soon as your device reconnects to mobile data or Wi-Fi, your information automatically updates with the main system.",
  },
  {
    id: 26,
    category: "Learning",
    question: "How does ShramPark help workers with limited reading ability?",
    answer:
      "ShramPark is built specifically for workers with limited literacy by using short videos, simple diagrams, spoken audio, and large easy-to-tap buttons. A worker can complete an entire training module simply by watching and listening.",
  },
  {
    id: 27,
    category: "General",
    question:
      "Is ShramPark only for workers or can engineers and supervisors use it too?",
    answer:
      "It is built for both. Workers use it for hands-on learning and skill certification, while engineers and supervisors use it to verify work on site, summarize standards, explain drawings, and monitor team safety compliance.",
  },
  {
    id: 28,
    category: "General",
    question: "What is the main benefit of using ShramPark?",
    answer:
      "The main benefit is having a single, easy-to-use platform that helps workers build verified practical skills and safety habits while helping sites reduce mistakes, prevent rework, and maintain high construction quality.",
  },
];

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const categories = [
    "All",
    "General",
    "Learning",
    "AI & Support",
    "Site & Verification",
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
      <main className="w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col gap-5 py-4">
        {/* Header Hero Card */}
        <section
          aria-labelledby="faq-title"
          className="w-full bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_12px_28px_rgba(240,101,41,0.08),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.06)] border border-[#F06529]/15 flex flex-col items-center text-center gap-3.5"
        >
          <div
            aria-hidden="true"
            className="w-14 h-14 rounded-[20px] bg-[#F06529] shadow-[4px_8px_18px_rgba(240,101,41,0.35),inset_2px_2px_4px_rgba(255,255,255,0.55),inset_-2px_-2px_4px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-2xl shrink-0"
          >
            <FiHelpCircle className="drop-shadow-sm" />
          </div>

          <div className="flex flex-col gap-1 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#F06529]">
              Help &amp; Knowledge Base
            </span>
            <h1 id="faq-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#181A1E]">
              Frequently Asked Questions
            </h1>
          </div>

          <p className="text-xs sm:text-base text-[#555A64] font-medium leading-relaxed max-w-2xl">
            Simple, practical guidance for on-site construction workers, supervisors, civil engineers, and contractors.
          </p>

          {/* Quick Search Input */}
          <div className="w-full max-w-2xl relative mt-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F06529] text-base" />
            <input
              type="text"
              placeholder="Search questions (e.g., offline, AI co-pilot, certificates, rebar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-[18px] bg-[#FFF5EE] text-sm text-[#181A1E] placeholder-[#8C939F] border border-[#F06529]/20 shadow-[inset_1px_1px_3px_rgba(240,101,41,0.08)] outline-none focus:border-[#F06529]"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 justify-center pt-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#F06529] text-white shadow-[2px_4px_10px_rgba(240,101,41,0.3)]"
                      : "bg-[#FFF5EE] text-[#555A64] hover:text-[#181A1E] border border-[#F06529]/15"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Counter */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-[#8C939F]">
          <span>Showing {filteredFaqs.length} Questions</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[#F06529] hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        {/* FAQ Grid: 2-columns on laptop, 1-column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <article
                key={faq.id}
                className="w-full bg-white rounded-[22px] p-4 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF,inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.04)] border border-[#F06529]/15 flex flex-col gap-2.5 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between text-left gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-[8px] bg-[#FFF5EE] text-[#F06529] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-[#F06529]/20">
                      {faq.id}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-[#181A1E] group-hover:text-[#F06529] transition-colors leading-snug">
                      {faq.question}
                    </h2>
                  </div>

                  <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center shrink-0 text-sm">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-2 pl-8.5 border-t border-[#F06529]/10 mt-1 animate-in fade-in duration-200">
                    <p className="text-xs sm:text-sm text-[#555A64] font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] font-semibold text-[#8C939F] pt-2 pb-4">
          ShramPark Help Center • Plain language guidance for civil site workers
        </p>
      </main>
    </div>
  );
}
