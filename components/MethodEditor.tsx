"use client"

import { useState, useEffect } from "react"
import {
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useDropzone } from "react-dropzone"
import { v4 as uuidv4 } from "uuid"
import { Combobox } from "@headlessui/react"
import type { Method, Step, Asset, Expert } from "../types/method"

interface MethodEditorProps {
  method?: Method
  isEditing?: boolean
  onSave?: (method: Method) => void
  onPublish?: (method: Method) => void
}

const emptyMethod: Method = {
  id: "",
  name: "",
  description: "",
  approach: [],
  downloads: [],
  video: null,
  audio: null,
  code: null,
  tags: [],
  related: [],
  experts: [],
}

// Sample existing methods for related methods selection
const existingMethods = [
  { id: "user-testing", name: "User Testing" },
  { id: "surveys", name: "User Surveys" },
  { id: "focus-groups", name: "Focus Groups" },
  { id: "card-sorting", name: "Card Sorting" },
  { id: "tree-testing", name: "Tree Testing" },
]

// Sample tags for autocomplete
const availableTags = [
  "Digital design",
  "Public sector",
  "Private sector",
  "Discovery",
  "Alpha",
  "Beta",
  "Live",
  "User research",
  "Data analysis",
  "Strategy",
  "Architecture",
  "DevOps",
  "Cyber security",
]

export default function MethodEditor({
  method = emptyMethod,
  isEditing = false,
  onSave,
  onPublish,
}: MethodEditorProps) {
  const [formData, setFormData] = useState<Method>(method)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [videoInputType, setVideoInputType] = useState<"upload" | "url">("upload")
  const [audioInputType, setAudioInputType] = useState<"upload" | "url">("upload")
  const [videoUrl, setVideoUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [tagQuery, setTagQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>(formData.tags)
  const [relatedQuery, setRelatedQuery] = useState("")
  const [selectedRelated, setSelectedRelated] = useState<string[]>(formData.related)

  // Rich text editor for description
  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: formData.description,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, description: editor.getHTML() }))
    },
  })

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.name) {
        localStorage.setItem("method-draft", JSON.stringify(formData))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [formData])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("method-draft")
    if (draft && !isEditing) {
      const parsedDraft = JSON.parse(draft)
      setFormData(parsedDraft)
      setSelectedTags(parsedDraft.tags || [])
      setSelectedRelated(parsedDraft.related || [])
    }
  }, [isEditing])

  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!formData.name.trim()) errors.push("Method name is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (formData.approach.length === 0) errors.push("At least one approach step is required")

    formData.approach.forEach((step, index) => {
      if (!step.title.trim()) errors.push(`Step ${index + 1} title is required`)
      if (!step.body.trim()) errors.push(`Step ${index + 1} body is required`)
    })

    return errors
  }

  const handleSave = () => {
    const errors = validateForm()
    setValidationErrors(errors)

    if (errors.length === 0) {
      const methodToSave = {
        ...formData,
        id: formData.id || uuidv4(),
        tags: selectedTags,
        related: selectedRelated,
      }
      onSave?.(methodToSave)
      localStorage.removeItem("method-draft")
    }
  }

  const handlePublish = () => {
    const errors = validateForm()
    setValidationErrors(errors)

    if (errors.length === 0) {
      const methodToPublish = {
        ...formData,
        id: formData.id || uuidv4(),
        tags: selectedTags,
        related: selectedRelated,
      }
      onPublish?.(methodToPublish)
      localStorage.removeItem("method-draft")
    }
  }

  const addStep = () => {
    const newStep: Step = {
      id: uuidv4(),
      title: "",
      body: "",
      resources: [],
    }
    setFormData((prev) => ({
      ...prev,
      approach: [...prev.approach, newStep],
    }))
  }

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setFormData((prev) => ({
      ...prev,
      approach: prev.approach.map((step) => (step.id === stepId ? { ...step, ...updates } : step)),
    }))
  }

  const removeStep = (stepId: string) => {
    setFormData((prev) => ({
      ...prev,
      approach: prev.approach.filter((step) => step.id !== stepId),
    }))
  }

  const addExpert = () => {
    const newExpert: Expert = {
      id: uuidv4(),
      name: "",
      role: "",
      avatarUrl: "",
    }
    setFormData((prev) => ({
      ...prev,
      experts: [...prev.experts, newExpert],
    }))
  }

  const updateExpert = (expertId: string, updates: Partial<Expert>) => {
    setFormData((prev) => ({
      ...prev,
      experts: prev.experts.map((expert) => (expert.id === expertId ? { ...expert, ...updates } : expert)),
    }))
  }

  const removeExpert = (expertId: string) => {
    setFormData((prev) => ({
      ...prev,
      experts: prev.experts.filter((expert) => expert.id !== expertId),
    }))
  }

  // File upload handlers
  const { getRootProps: getDownloadRootProps, getInputProps: getDownloadInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const newAssets: Asset[] = acceptedFiles.map((file) => ({
        id: uuidv4(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: "document",
      }))
      setFormData((prev) => ({
        ...prev,
        downloads: [...prev.downloads, ...newAssets],
      }))
    },
  })

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: {
      "video/*": [".mp4", ".mov", ".avi"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const videoAsset: Asset = {
          id: uuidv4(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: "video",
        }
        setFormData((prev) => ({ ...prev, video: videoAsset }))
      }
    },
  })

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const audioAsset: Asset = {
          id: uuidv4(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: "audio",
        }
        setFormData((prev) => ({ ...prev, audio: audioAsset }))
      }
    },
  })

  const handleVideoUrl = () => {
    if (videoUrl.trim()) {
      const videoAsset: Asset = {
        id: uuidv4(),
        name: "Video from URL",
        url: videoUrl,
        type: "video",
      }
      setFormData((prev) => ({ ...prev, video: videoAsset }))
      setVideoUrl("")
    }
  }

  const handleAudioUrl = () => {
    if (audioUrl.trim()) {
      const audioAsset: Asset = {
        id: uuidv4(),
        name: "Audio from URL",
        url: audioUrl,
        type: "audio",
      }
      setFormData((prev) => ({ ...prev, audio: audioAsset }))
      setAudioUrl("")
    }
  }

  const filteredTags =
    tagQuery === "" ? availableTags : availableTags.filter((tag) => tag.toLowerCase().includes(tagQuery.toLowerCase()))

  const filteredMethods =
    relatedQuery === ""
      ? existingMethods
      : existingMethods.filter((method) => method.name.toLowerCase().includes(relatedQuery.toLowerCase()))

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

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Main Form */}
            <div className="flex-1 max-w-4xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#061F37]">{isEditing ? "Edit Method" : "Create New Method"}</h1>
                <p className="text-gray-600 mt-2">
                  {isEditing
                    ? "Update the methodology details below."
                    : "Fill in the details to create a new methodology."}
                </p>
              </div>

              <form className="space-y-8">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Method Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                    placeholder="e.g. User Interviews"
                  />
                  <p className="text-sm text-gray-500 mt-1">The main title for this methodology</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <div className="border border-[#E5E7EB] rounded-md">
                    <div className="border-b border-[#E5E7EB] p-2 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => descriptionEditor?.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 text-sm rounded ${
                          descriptionEditor?.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
                      >
                        Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => descriptionEditor?.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 text-sm rounded ${
                          descriptionEditor?.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
                      >
                        Italic
                      </button>
                      <button
                        type="button"
                        onClick={() => descriptionEditor?.chain().focus().toggleBulletList().run()}
                        className={`px-2 py-1 text-sm rounded ${
                          descriptionEditor?.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
                      >
                        List
                      </button>
                    </div>
                    <EditorContent
                      editor={descriptionEditor}
                      className="prose prose-sm max-w-none p-3 min-h-[120px] focus-within:ring-2 focus-within:ring-[#E0001B]"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide an overview of what this methodology is and when to use it
                  </p>
                </div>

                {/* Approach Steps */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">Approach Steps *</label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="inline-flex items-center px-3 py-2 border border-[#E5E7EB] shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0001B]"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Step
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.approach.map((step, index) => (
                      <StepEditor
                        key={step.id}
                        step={step}
                        index={index}
                        onUpdate={(updates) => updateStep(step.id, updates)}
                        onRemove={() => removeStep(step.id)}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Break down the methodology into clear, actionable steps</p>
                </div>

                {/* Downloads */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Downloads & Templates</label>
                  <div
                    {...getDownloadRootProps()}
                    className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer"
                  >
                    <input {...getDownloadInputProps()} />
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drop files here or click to upload</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, PPTX up to 10MB</p>
                  </div>

                  {formData.downloads.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.downloads.map((download) => (
                        <div
                          key={download.id}
                          className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <DocumentIcon className="h-8 w-8 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">{download.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                downloads: prev.downloads.filter((d) => d.id !== download.id),
                              }))
                            }
                            className="text-[#E0001B] hover:text-red-800"
                            role="button"
                            aria-label={`Remove ${download.name}`}
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Upload supporting documents, templates, and resources</p>
                </div>

                {/* Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
                  <div className="border border-[#E5E7EB] rounded-lg">
                    <div className="flex border-b border-[#E5E7EB]">
                      <button
                        type="button"
                        onClick={() => setVideoInputType("upload")}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${
                          videoInputType === "upload"
                            ? "bg-[#E0001B] text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoInputType("url")}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${
                          videoInputType === "url"
                            ? "bg-[#E0001B] text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Paste URL
                      </button>
                    </div>
                    <div className="p-4">
                      {videoInputType === "upload" ? (
                        <div
                          {...getVideoRootProps()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                        >
                          <input {...getVideoInputProps()} />
                          <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Drop video file here or click to upload</p>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                          />
                          <button
                            type="button"
                            onClick={handleVideoUrl}
                            className="px-4 py-2 bg-[#E0001B] text-white rounded-md hover:bg-red-700"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {formData.video && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{formData.video.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, video: null }))}
                        className="text-[#E0001B] hover:text-red-800"
                        role="button"
                        aria-label="Remove video"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Add a video demonstration or explanation</p>
                </div>

                {/* Audio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audio</label>
                  <div className="border border-[#E5E7EB] rounded-lg">
                    <div className="flex border-b border-[#E5E7EB]">
                      <button
                        type="button"
                        onClick={() => setAudioInputType("upload")}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${
                          audioInputType === "upload"
                            ? "bg-[#E0001B] text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setAudioInputType("url")}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${
                          audioInputType === "url"
                            ? "bg-[#E0001B] text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Paste URL
                      </button>
                    </div>
                    <div className="p-4">
                      {audioInputType === "upload" ? (
                        <div
                          {...getAudioRootProps()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                        >
                          <input {...getAudioInputProps()} />
                          <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Drop audio file here or click to upload</p>
                          <p className="text-xs text-gray-500">MP3, WAV, M4A up to 50MB</p>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            placeholder="https://example.com/audio.mp3"
                            value={audioUrl}
                            onChange={(e) => setAudioUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                          />
                          <button
                            type="button"
                            onClick={handleAudioUrl}
                            className="px-4 py-2 bg-[#E0001B] text-white rounded-md hover:bg-red-700"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {formData.audio && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{formData.audio.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, audio: null }))}
                        className="text-[#E0001B] hover:text-red-800"
                        role="button"
                        aria-label="Remove audio"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Add an audio explanation or interview</p>
                </div>

                {/* Code Snippet */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Code Snippet
                  </label>
                  <textarea
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B] font-mono text-sm"
                    placeholder="// Add code examples here..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add code examples or snippets related to this methodology
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <Combobox value={selectedTags} onChange={setSelectedTags} multiple>
                    <div className="relative">
                      <Combobox.Input
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                        onChange={(event) => setTagQuery(event.target.value)}
                        placeholder="Type to search tags..."
                      />
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredTags.map((tag) => (
                          <Combobox.Option
                            key={tag}
                            value={tag}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                active ? "bg-[#E0001B] text-white" : "text-gray-900"
                              }`
                            }
                          >
                            {tag}
                          </Combobox.Option>
                        ))}
                        {tagQuery !== "" && !filteredTags.includes(tagQuery) && (
                          <Combobox.Option
                            value={tagQuery}
                            className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
                          >
                            Create "{tagQuery}"
                          </Combobox.Option>
                        )}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                  {selectedTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-600"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                            className="ml-2 text-slate-400 hover:text-slate-600"
                            role="button"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Add tags to help categorise this methodology</p>
                </div>

                {/* Related Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Methods</label>
                  <Combobox value={selectedRelated} onChange={setSelectedRelated} multiple>
                    <div className="relative">
                      <Combobox.Input
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                        onChange={(event) => setRelatedQuery(event.target.value)}
                        placeholder="Search for related methods..."
                      />
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredMethods.map((method) => (
                          <Combobox.Option
                            key={method.id}
                            value={method.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                active ? "bg-[#E0001B] text-white" : "text-gray-900"
                              }`
                            }
                          >
                            {method.name}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                  {selectedRelated.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {selectedRelated.map((methodId) => {
                        const method = existingMethods.find((m) => m.id === methodId)
                        return method ? (
                          <div key={methodId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{method.name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedRelated(selectedRelated.filter((id) => id !== methodId))}
                              className="text-[#E0001B] hover:text-red-800"
                              role="button"
                              aria-label={`Remove ${method.name} from related methods`}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Link to other methodologies that complement this one</p>
                </div>

                {/* Experts */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">PA Experts</label>
                    <button
                      type="button"
                      onClick={addExpert}
                      className="inline-flex items-center px-3 py-2 border border-[#E5E7EB] shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0001B]"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Expert
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.experts.map((expert) => (
                      <div
                        key={expert.id}
                        className="flex items-center space-x-4 p-4 border border-[#E5E7EB] rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-lg">👤</span>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Expert name"
                            value={expert.name}
                            onChange={(e) => updateExpert(expert.id, { name: e.target.value })}
                            className="px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                            aria-label="Expert name"
                          />
                          <input
                            type="text"
                            placeholder="Job title"
                            value={expert.role}
                            onChange={(e) => updateExpert(expert.id, { role: e.target.value })}
                            className="px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
                            aria-label="Expert job title"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExpert(expert.id)}
                          className="text-[#E0001B] hover:text-red-800"
                          role="button"
                          aria-label="Remove expert"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Add PA experts who can provide guidance on this methodology
                  </p>
                </div>
              </form>
            </div>

            {/* Side Panel */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Action Buttons */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="w-full px-4 py-2 border border-[#E5E7EB] shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0001B]"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={handlePublish}
                      className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E0001B] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0001B]"
                    >
                      Publish Method
                    </button>
                  </div>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Auto-save Status */}
                <div className="bg-gray-50 border border-[#E5E7EB] rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Auto-save:</span> Every 30 seconds
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Your progress is automatically saved to local storage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Editor Component
interface StepEditorProps {
  step: Step
  index: number
  onUpdate: (updates: Partial<Step>) => void
  onRemove: () => void
}

function StepEditor({ step, index, onUpdate, onRemove }: StepEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: step.body,
    onUpdate: ({ editor }) => {
      onUpdate({ body: editor.getHTML() })
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const newResources: Asset[] = acceptedFiles.map((file) => ({
        id: uuidv4(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: "document",
      }))
      onUpdate({ resources: [...(step.resources || []), ...newResources] })
    },
  })

  return (
    <div className="border border-[#E5E7EB] rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">Step {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-[#E0001B] hover:text-red-800"
          role="button"
          aria-label={`Remove step ${index + 1}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Step Title *</label>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:ring-2 focus:ring-[#E0001B] focus:border-[#E0001B]"
            placeholder="e.g. Define research goals"
            aria-label={`Step ${index + 1} title`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Step Description *</label>
          <div className="border border-[#E5E7EB] rounded-md">
            <div className="border-b border-[#E5E7EB] p-2 flex space-x-2">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-2 py-1 text-sm rounded ${
                  editor?.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 text-sm rounded ${
                  editor?.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 text-sm rounded ${
                  editor?.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                List
              </button>
            </div>
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none p-3 min-h-[100px] focus-within:ring-2 focus-within:ring-[#E0001B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attach Resources</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
          >
            <input {...getInputProps()} />
            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">Drop files here or click to upload</p>
            <p className="text-xs text-gray-500">PDF, DOCX, PPTX up to 10MB</p>
          </div>

          {step.resources && step.resources.length > 0 && (
            <div className="mt-2 space-y-2">
              {step.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{resource.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        resources: step.resources?.filter((r) => r.id !== resource.id) || [],
                      })
                    }
                    className="text-[#E0001B] hover:text-red-800"
                    role="button"
                    aria-label={`Remove ${resource.name}`}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
