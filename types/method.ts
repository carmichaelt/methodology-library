export type Method = {
  id: string
  name: string
  description: string
  approach: Step[]
  downloads: Asset[]
  video?: Asset | null
  audio?: Asset | null
  code?: string | null
  tags: string[]
  related: string[]
  experts: Expert[]
}

export type Step = {
  id: string
  title: string
  body: string
  resources?: Asset[]
}

export type Asset = {
  id: string
  name: string
  url: string
  type: "document" | "video" | "audio"
}

export type Expert = {
  id: string
  name: string
  role: string
  avatarUrl?: string
}
