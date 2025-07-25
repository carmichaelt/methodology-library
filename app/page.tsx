"use client"

import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Disclosure } from "@headlessui/react"
import Link from "next/link"

// Sample data structure
const methods = [
  {
    id: 1,
    title: "Agile Development",
    sector: "Public sector",
    capabilities: ["Architecture, Engineering & DevOps"],
    phase: "Alpha",
    community: "Product and Strategy",
  },
  {
    id: 2,
    title: "User Research",
    sector: "Private sector",
    capabilities: ["Digital Strategy & Experience"],
    phase: "Discovery",
    community: "Digital Design",
  },
  {
    id: 3,
    title: "User Interviews",
    sector: "Public sector",
    capabilities: ["Digital Strategy & Experience"],
    phase: "Discovery",
    community: "Digital Design",
  },
  {
    id: 4,
    title: "User Desk Research",
    sector: "Public sector",
    capabilities: ["Digital Strategy & Experience"],
    phase: "Discovery",
    community: "Data Science",
  },
  // Add more sample methods as needed
]

const filterCategories = {
  capability: [
    "Digital Strategy & Experience",
    "Architecture, Engineering & DevOps",
    "Digital Trust & Cyber Security",
    "Data Science",
  ],
  community: [
    "Product and Strategy",
    "Delivery & Transformation",
    "Digital Design",
    "Cyber Risk Management",
    "Security Architecture",
    "Operational Technology (OT) & Internet of Things (IoT)",
    "Operational Resilience",
    "Data Analytics",
    "Machine Learning",
    "Cloud Infrastructure",
    "DevOps Engineering",
    "Quality Assurance",
    "Business Analysis",
    "Project Management",
    "Change Management",
    "Service Design",
    "Content Strategy",
    "Technical Writing",
    "Information Architecture",
    "User Experience Design",
  ],
  deliveryFramework: ["Public sector", "Private sector"],
  phase: ["Set-up", "Discovery", "Alpha", "Private beta", "Public beta", "Live"],
}

export default function MethodologyLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    capability: [],
    community: [],
    deliveryFramework: [],
    phase: [],
  })

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  // Filtered search results for sidebar
  const filteredMethods = methods.filter((method) => {
    const matchesSearch = searchTerm
      ? method.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (method.community && method.community.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (method.sector && method.sector.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    return matchesSearch
  })

  const clearAllFilters = () => {
    setSelectedFilters({
      capability: [],
      community: [],
      deliveryFramework: [],
      phase: [],
    })
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <span className="text-lg font-medium text-gray-900">Digital & Data Methodology Library</span>
            </div>

            {/* Centre: Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-red-600 font-medium hover:text-red-700">
                Home
              </Link>
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

            {/* Right: User Avatar */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">User's name</span>
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          <div className="flex gap-12">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0">
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by keyword or phrase
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="search"
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                {/* Search Results Dropdown */}
                {searchTerm && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
                    {filteredMethods.length > 0 ? (
                      filteredMethods.map((method) => (
                        <div key={method.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                          {method.title}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Filters */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Community <span className="text-xs text-gray-500">({filteredMethods.filter((m) => m.community).length}/20)</span></h3>
                </div>
                <div className="max-h-40 overflow-y-auto mb-4 border-b border-gray-100 pb-2">
                  {filterCategories.community.map((item) => (
                    <label key={item} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={selectedFilters.community.includes(item)}
                        onChange={() => handleFilterChange("community", item)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Delivery framework <span className="text-xs text-gray-500">(1/2)</span></h3>
                  {filterCategories.deliveryFramework.map((item) => (
                    <label key={item} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={selectedFilters.deliveryFramework.includes(item)}
                        onChange={() => handleFilterChange("deliveryFramework", item)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Phase <span className="text-xs text-gray-500">(1/6)</span></h3>
                  {filterCategories.phase.map((item) => (
                    <label key={item} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={selectedFilters.phase.includes(item)}
                        onChange={() => handleFilterChange("phase", item)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-gray-700 underline mt-2">Clear all</button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Breadcrumb and Header */}
              <div className="mb-8">
                <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">Digital & Data</p>
                <h1 className="text-4xl font-bold text-[#061F37] mb-4">Methodology Library</h1>
                <p className="text-gray-700 mb-4">
                  Welcome to the Methodology Library, the home of the methods we use across Digital & Data at PA. The
                  library contains the frameworks, methodologies, tools and templates we use to deliver brilliant work
                  for clients. You'll find detailed descriptions, walkthroughs, 'how to' guides and handy tips from
                  experts across the stream.
                </p>
                <p className="text-gray-700 mb-8">
                  Explore the library by capability or delivery framework, or search for a specific methodology.
                </p>
              </div>

              {/* Delivery Frameworks Section */}
              <div>
                <h2 className="text-2xl font-semibold text-[#061F37] mb-6">Delivery frameworks</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Public Sector Card */}
                  <Link href="/frameworks/public" className="group">
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 hover:border-red-500 transition-all duration-200">
                      <h3 className="text-lg font-medium text-[#061F37] mb-3">Public sector</h3>
                      <p className="text-gray-700 mb-4">
                        PA delivers public services from policy to live closely following the{" "}
                        <span className="underline">GOV.UK Service Standards</span>. We take a structured approach that
                        ensures compliance and effective delivery.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">6 delivery phases</span>
                        <ChevronRightIcon className="h-5 w-5 text-[#E0001B] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  {/* Private Sector Card */}
                  <Link href="/frameworks/private" className="group">
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 hover:border-red-500 transition-all duration-200">
                      <h3 className="text-lg font-medium text-[#061F37] mb-3">Private sector</h3>
                      <p className="text-gray-700 mb-4">
                        Vestibulum pretium aliquam sem non suscipit. Vestibulum eu bibendum lectus, eu scelerisque arcu.
                        Praesent lobortis arcu vitae justo suscipit eleifend. Integer tincidunt malesuada mi.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">6 delivery phases</span>
                        <ChevronRightIcon className="h-5 w-5 text-[#E0001B] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Create Method Button */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#061F37] mb-2">Contribute to the Library</h2>
                    <p className="text-gray-700">
                      Share your expertise by creating a new methodology for the Digital & Data community.
                    </p>
                  </div>
                  <Link
                    href="/methods/new"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E0001B] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0001B] transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Method
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
