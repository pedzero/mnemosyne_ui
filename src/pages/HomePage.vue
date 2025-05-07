<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchProfile } from '../services/profileService'
import { fetchProjects } from '../services/projectsService'
import ProjectCard from '../components/ProjectCard.vue'
import EducationCard from '../components/EducationCard.vue'
import type { Profile, Project } from '../types/index'
import { Github, Linkedin, Youtube, Mail } from 'lucide-vue-next'
import NebulaBackground from '../components/backgrounds/NebulaBackground.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToProject(id: number) {
    router.push(`/projects/${id}`)
}

const profile = ref<Profile | null>(null)
const projects = ref<Project[]>([])

onMounted(async () => {
    profile.value = await fetchProfile()
    projects.value = await fetchProjects()
})

function getSocialIcon(name: string) {
    switch (name.toLowerCase()) {
        case 'github': return Github
        case 'linkedin': return Linkedin
        case 'youtube': return Youtube
        default: return null
    }
}
</script>

<template>
    <NebulaBackground />

    <main class="relative z-0 min-h-screen text-white font-space-grotesk px-6 py-8 space-y-12 bg-transparent">

        <!-- header -->
        <header class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div class="bg-white/5 backdrop-blur-sm p-4 rounded-xl space-y-1">
                <h1 class="text-3xl font-bold text-white">{{ profile?.name }}</h1>
                <p class="text-base font-light text-neutral-300">{{ profile?.summary }}</p>
            </div>
            <div class="bg-white/5 backdrop-blur-sm p-4 rounded-xl flex gap-4">
                <a v-for="social in profile?.socials" :key="social.name" :href="social.url" target="_blank"
                    rel="noopener noreferrer">
                    <component :is="getSocialIcon(social.name)"
                        class="w-6 h-6 text-neutral-300 hover:text-white transition-colors" />
                </a>
            </div>
        </header>

        <!-- projects -->
        <section>
            <h2
                class="text-2xl font-semibold text-white mb-4 bg-white/5 backdrop-blur-sm inline-block px-4 py-2 rounded-xl">
                Projetos</h2>
            <div class="flex flex-wrap gap-6">
                <ProjectCard v-for="project in projects" :key="project.id" :project="project"
                    @click="goToProject(project.id)" />
            </div>
        </section>

        <!-- education -->
        <section v-if="profile">
            <h2
                class="text-2xl font-semibold text-white mb-4 bg-white/5 backdrop-blur-sm inline-block px-4 py-2 rounded-xl">
                Formação</h2>
            <div class="space-y-4">
                <EducationCard v-for="edu in profile.educations" :key="edu.id" :degree="edu.degree"
                    :institution="edu.institution" :startYear="edu.startYear" :endYear="edu.endYear" />
            </div>
        </section>

        <!-- footer -->
        <footer
            class="border-t border-neutral-700 pt-6 mt-12 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400 bg-white/5 backdrop-blur-md px-4 py-6 rounded-xl">
            <div>{{ profile?.name }}</div>
            <div class="mb-2 md:mb-0">Mnemosyne © {{ new Date().getFullYear() }}</div>
            <div class="flex items-center gap-2">
                <Mail class="w-4 h-4" />
                <span>
                    <a :href="`mailto:${profile?.email}`" class="hover:underline text-neutral-300">
                        {{ profile?.email }}
                    </a>
                </span>
            </div>
        </footer>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Aldrich&family=Space+Grotesk:wght@300;400&display=swap');

.font-space-grotesk {
    font-family: 'Space Grotesk', sans-serif;
}
</style>