export interface Profile {
    id: number
    name: string
    summary: string
    email: string
    socials: SocialLink[]
    educations: Education[]
}

export interface SocialLink {
    name: string
    url: string
}

export interface Education {
    id: number
    institution: string
    degree: string
    startYear: number
    endYear?: number
}

export interface Project {
    id: number
    name: string
    summary: string
    description?: string
    stack: string
    technologies: Technology[]
    collaborators: Collaborator[]
    repositories: Repository[]
    images: Image[]
}

export interface Technology {
    name: string
    url: string
}

export interface Collaborator {
    name: string
    portfolioUrl: string
}

export interface Repository {
    name: string
    url: string
}

export interface Image {
    data: string
}
