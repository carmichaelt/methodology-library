"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDownIcon, DocumentIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { Method } from "../types/method"

// Sample data matching the screenshot
const sampleMethod: Method = {
  id: "user-interviews",
  name: "User Interviews",
  description: `User interviews are a core methodology in qualitative user research. They are structured conversations that help uncover the needs, pain points and motivations behind user behaviours and provide a deeper understanding of why people act the way they do. This insight can be leveraged to guide management and design decisions to ensure a product or service fits the user's context and meets their needs.

User interviews are different from user testing. To find about more about conducting user testing, review the methodology.`,
  approach: [
    {
      id: "step-1",
      title: "Define research goals",
      body: `Before you set out to start talking to users, ask yourself: what do you want to get out of these interviews? Establish hypotheses you're looking to validate, look back at your desk research to see if there are any open questions you'd like to explore, or think about any assumptions your team might have made that you'd like to test. Your interview goals need to be specific - make a note of those.

This step is particularly important as the research can become unfocused, inefficient, and you might fail to deliver valuable insights if you don't know what you're looking for before starting the interviews.

You should at this stage have high-level research goals established, if not, try using the problem definition canvas. Once you have those, you can break them down into more specific goals which align with several themes and then group them.`,
      resources: [
        {
          id: "res-1",
          name: "User research for government services: an introduction",
          url: "/resources/gov-uk-research.pdf",
          type: "document",
        },
        {
          id: "res-2",
          name: "User Research Insight to Impact: The Art of Scaling Research",
          url: "/resources/scaling-research.pdf",
          type: "document",
        },
      ],
    },
    {
      id: "step-2",
      title: "Identify and recruit target users",
      body: `Recruiting research participants can be challenging, and sometimes can be the trickiest part of the process. Plan accordingly as it always takes longer than estimated. Make sure you budget extra time and consider recruiting more participants than you think you'll need as back-ups. If you need to recruit a niche or complex target user profile, you should allow more time. The general rule of thumb is to allow up to a month to find participants.

Firstly, compile a list of potential interviewees who are likely to provide the necessary information. If you're conducting research with colleagues or the client to identify the right contacts. Make sure you're recruiting a diverse range of participants that represent your user base in terms of demographics, needs and of varying levels of digital confidence. Please refer to the accessibility and digital inclusion research methods list. Depending on the product lifecycle stage you're at, it's 10 important per user group should suffice. After that you'll probably start getting the same insights and answers. It's the law of diminishing returns.

Next, screen your users. You could either circulate the leads comes from a pre-screened list of participants or you could recruit participants via e-mail or survey.

Plan a schedule for the interviews. Remember to leave enough time between them (at least 30 minutes to 1 hour) to allow for overruns, tidy up notes and course-correct - adapting the discussion guide if needed. Interviews should be 30-60-minute sessions, depending on your research goals. If you have lots of stimuli, diagrams, screens etc, it could be longer.

Send an invite email to participants. Explain on your e-mail what you're looking to accomplish through the interview and include an information sheet with useful information, such as where it will take place - either in-person or online. Remember the users might have little to no context to what you're doing, so keep it brief and straightforward - don't use jargon if you have a client email account, make sure you send the invites from that account rather than your personal one. This helps build trust and legitimacy with participants.

Usually, clients will have their own template - if not, the resources list below has some examples.`,
      resources: [
        {
          id: "res-3",
          name: "Discussion guide template",
          url: "/resources/discussion-guide.pdf",
          type: "document",
        },
      ],
    },
    {
      id: "step-3",
      title: "Title goes here",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ],
  downloads: [
    {
      id: "download-1",
      name: "User research for government services: an introduction",
      url: "/downloads/gov-research-intro.pdf",
      type: "document",
    },
    {
      id: "download-2",
      name: "Discussion guide template",
      url: "/downloads/discussion-guide-template.docx",
      type: "document",
    },
  ],
  video: null,
  audio: null,
  code: null,
  tags: ["Digital design", "Public sector", "Discovery", "Alpha", "Private beta", "Public beta"],
  related: ["user-testing", "surveys", "focus-groups"],
  experts: [
    {
      id: "expert-1",
      name: "Name goes here",
      role: "Job title goes here",
    },
    {
      id: "expert-2",
      name: "Name goes here",
      role: "Job title goes here",
    },
    {
      id: "expert-3",
      name: "Name goes here",
      role: "Job title goes here",
    },
  ],
}

interface MethodDetailsProps {
  method?: Method
}

export default function MethodDetails({ method = sampleMethod }: MethodDetailsProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [question, setQuestion] = useState("")

  // Generate table of contents from method structure
  const tableOfContents = [
    { id: "overview", title: "Overview" },
    {
      id: "approach",
      title: "Approach",
      children: method.approach.map((step) => ({ id: step.id, title: step.title })),
    },
    { id: "outputs", title: "Outputs" },
    { id: "pro-tips", title: "Pro tips" },
    { id: "experts", title: "PA experts" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]")
      let current = ""

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100) {
          current = section.getAttribute("data-section") || ""
        }
      })

      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      console.log("Question submitted:", question)
      setQuestion("")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#E0001B] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <span className="text-lg font-medium text-gray-900">Digital & Data Methodology Library</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-[#E0001B] font-medium hover:text-red-700">
                Home
              </a>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  Capabilities
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  Digital Product and Service Delivery
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-gray-700">User's name</span>
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Left Sidebar */}
        <div className="w-56 flex-shrink-0 sticky top-16 h-screen overflow-y-auto border-r border-[#E5E7EB] bg-white">
          <div className="p-4">
            {/* Back to search results */}
            <a href="/methods" className="text-sm text-gray-600 hover:text-gray-900 mb-6 block">
              ← Back to search results
            </a>

            {/* Contents */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Contents</h3>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                        activeSection === item.id ? "text-[#E0001B] bg-red-50" : "text-gray-700"
                      }`}
                      aria-label={`Section ${item.title}`}
                      role="button"
                    >
                      {item.title}
                    </button>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollToSection(child.id)}
                            className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                              activeSection === child.id ? "text-[#E0001B] bg-red-50" : "text-gray-600"
                            }`}
                            aria-label={`Section ${child.title}`}
                            role="button"
                          >
                            {child.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Ask questions widget */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Ask questions</h4>
              </div>
              <p className="text-xs text-gray-600 mb-3">Get instant help about this methodology</p>
              <form onSubmit={handleQuestionSubmit} className="flex">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 text-sm border border-gray-300 rounded-l-md px-3 py-2 focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                  aria-label="Ask a question about this methodology"
                />
                <button
                  type="submit"
                  className="bg-[#E0001B] text-white px-3 py-2 rounded-r-md hover:bg-red-700"
                  role="button"
                  aria-label="Send question"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl mx-auto px-8 py-8">
          <div className="prose prose-sm max-w-none">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6 not-prose">
              {method.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-[#061F37] mb-8" data-section="title">
              {method.name}
            </h1>

            {/* Overview */}
            <section data-section="overview" className="mb-12">
              <h2 className="text-2xl font-semibold text-[#061F37] mb-4">Overview</h2>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">{method.description}</div>
            </section>

            {/* Approach */}
            <section data-section="approach" className="mb-12">
              <h2 className="text-2xl font-semibold text-[#061F37] mb-6">Approach</h2>
              {method.approach.map((step, index) => (
                <div key={step.id} data-section={step.id} className="mb-10">
                  <h3 className="text-xl font-medium text-[#061F37] mb-4">
                    {index + 1}. {step.title}
                  </h3>
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">{step.body}</div>

                  {step.resources && step.resources.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-[#061F37] mb-4">Resources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="w-40 h-30 border border-[#E5E7EB] rounded-lg p-4 hover:ring-2 hover:ring-[#E0001B] transition-all cursor-pointer bg-white"
                          >
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                                <DocumentIcon className="h-6 w-6 text-white" />
                              </div>
                              <h5 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                                {resource.name}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Code Section */}
            {method.code && (
              <section data-section="code" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#061F37] mb-4">Code</h2>
                <SyntaxHighlighter language="javascript" style={oneDark} className="rounded-lg">
                  {method.code}
                </SyntaxHighlighter>
              </section>
            )}

            {/* Video Section */}
            {method.video && (
              <section data-section="video" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#061F37] mb-4">Video</h2>
                <div className="aspect-video">
                  <iframe
                    src={method.video.url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={method.video.name}
                  />
                </div>
              </section>
            )}

            {/* Audio Section */}
            {method.audio && (
              <section data-section="audio" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#061F37] mb-4">Audio</h2>
                <audio controls className="w-full">
                  <source src={method.audio.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </section>
            )}

            {/* Outputs */}
            <section data-section="outputs" className="mb-12">
              <h2 className="text-2xl font-semibold text-[#061F37] mb-4">Outputs</h2>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </section>

            {/* Pro tips */}
            <section data-section="pro-tips" className="mb-12">
              <h2 className="text-2xl font-semibold text-[#061F37] mb-4">Pro tips</h2>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </section>

            {/* PA Experts */}
            <section data-section="experts" className="mb-12">
              <h2 className="text-2xl font-semibold text-[#061F37] mb-4">PA experts</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Reach out to the following people if you have questions about the method.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                {method.experts.map((expert) => (
                  <div key={expert.id} className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-gray-600 text-2xl">👤</span>
                    </div>
                    <h4 className="font-medium text-gray-900">{expert.name}</h4>
                    <p className="text-sm text-gray-600">{expert.role}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
