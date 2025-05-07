<template>
    <NebulaBackground />

    <main class="relative z-0 min-h-screen text-white font-space-grotesk px-6 py-8 space-y-12 bg-transparent">
        <section class="max-w-7xl mx-auto flex flex-col space-y-6 bg-white/5 backdrop-blur-sm p-6 rounded-xl">

            <!-- Header do Projeto -->
            <div class="flex justify-between w-full">
                <!-- Esquerda: Botão + Nome + Summary -->
                <div class="flex items-center gap-4">
                    <!-- Botão de voltar centralizado verticalmente -->
                    <div class="flex items-center">
                        <router-link to="/" class="bg-white/0 hover:bg-white/10 p-2 rounded-xl shrink-0">
                            <ChevronLeft class="w-5 h-5 text-white" />
                        </router-link>
                    </div>

                    <!-- Nome + Summary -->
                    <div class="flex flex-col text-left">
                        <h1 class="text-2xl font-bold leading-tight">{{ project?.name }}</h1>
                        <p class="text-sm text-neutral-300 leading-snug">
                            {{ project?.summary }}
                        </p>
                    </div>
                </div>

                <!-- Direita: Stack centralizado verticalmente -->
                <div class="flex items-center">
                    <span class="bg-white/10 text-sm text-white px-3 py-1 rounded-full">
                        {{ formatStack(project?.stack) }}
                    </span>
                </div>
            </div>


            <!-- Área principal: Carrossel + Detalhes -->
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Carrossel -->
                <div class="flex-1 min-h-[400px] relative overflow-hidden rounded-lg">
                    <div v-if="project?.images?.length" class="h-full w-full relative">
                        <img v-for="(src, i) in decodedImages" :key="i" :src="src" alt="Imagem do projeto"
                            class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
                            :class="{ 'opacity-100': currentImage === i, 'opacity-0': currentImage !== i }" />
                    </div>
                    <div v-else class="h-full w-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                        Sem imagens disponíveis
                    </div>
                </div>

                <!-- Informações -->
                <div class="flex-1 flex flex-col space-y-6">
                    <!-- Descrição -->
                    <p class="text-neutral-300 whitespace-pre-line text-justify">{{ project?.description }}</p>

                    <!-- Repositórios -->
                    <div>
                        <h3 class="text-sm text-white/70 mb-2">Repositórios</h3>
                        <div class="flex flex-wrap gap-2">
                            <a v-for="repo in project?.repositories" :key="repo.name" :href="repo.url" target="_blank"
                                class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20">
                                <component :is="getRepositoryIcon(repo.url)" class="w-4 h-4" />
                                {{ repo.name }}
                            </a>
                        </div>
                    </div>

                    <!-- Tecnologias -->
                    <div>
                        <h3 class="text-sm text-white/70 mb-2">Tecnologias</h3>
                        <div class="flex flex-wrap gap-2">
                            <a v-for="tech in project?.technologies" :key="tech.name" :href="tech.url" target="_blank"
                                class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20">
                                <component :is="getTechnologyIcon(tech.url)" class="w-4 h-4" />
                                {{ tech.name }}
                            </a>
                        </div>
                    </div>

                    <!-- Colaboradores -->
                    <div>
                        <h3 class="text-sm text-white/70 mb-2">Colaboradores</h3>
                        <div class="flex flex-wrap gap-2">
                            <a v-for="collab in project?.collaborators" :key="collab.name" :href="collab.portfolioUrl"
                                target="_blank"
                                class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20">
                                <UserRound class="w-4 h-4" />
                                {{ collab.name }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Project } from '../types/index'
import NebulaBackground from '../components/backgrounds/NebulaBackground.vue'
import { fetchProjectById } from '../services/projectsService'

import {
    ChevronLeft,
    Github,
    Gitlab,
    Youtube,
    Code,
    UserRound,
    Link,
} from 'lucide-vue-next'

import {
    siSwagger,
    siNotion,
    siGit,
    siDocker,
    siJavascript,
    siTypescript,
    siRedis,
    siMinio,
    siReact,
    siNodedotjs,
    siVuedotjs,
    siPython,
    siPhp,
    siRuby,
    siMongodb,
    siPostgresql,
    siMysql,
    siHtml5,
    siCss3,
    siSass,
    siWebpack,
    siNginx,
    siKubernetes,
    siFlutter,
    siVite,
    siJest,
    siTerraform
} from 'simple-icons'

const route = useRoute()
const project = ref<Project | null>(null)
const currentImage = ref(0)

onMounted(async () => {
    const id = Number(route.params.id)
    project.value = await fetchProjectById(id)

    if (project.value) {
        if (project.value?.images?.length > 1) {
            setInterval(() => {
                currentImage.value = (currentImage.value + 1) % project.value!.images.length
            }, 5000)
        }
    }
})

const decodedImages = computed(() => {
    return (project.value?.images ?? [])
        .map((img) => {
            const byteArray = Object.values(img.data ?? {})
            try {
                const binary = String.fromCharCode(...byteArray)
                return `data:image/png;base64,${btoa(binary)}`
            } catch (e) {
                console.error('Erro ao decodificar imagem', e)
                return null
            }
        })
        .filter((src): src is string => src !== null)
})

function getRepositoryIcon(url: string) {
    if (url.includes('github.com')) return Github
    if (url.includes('gitlab.com')) return Gitlab
    if (url.includes('youtube.com')) return Youtube
    if (url.includes('swagger.io')) return siSwagger
    if (url.includes('notion.so')) return siNotion
    return Code
}

function getTechnologyIcon(url: string) {
    if (url.includes('git-scm.com')) return siGit;
    if (url.includes('docker.com')) return siDocker;
    if (url.includes('javascript.com') || url.includes('js.org')) return siJavascript;
    if (url.includes('typescriptlang.org')) return siTypescript;
    if (url.includes('redis.io')) return siRedis;
    if (url.includes('min.io')) return siMinio;
    if (url.includes('reactjs.org')) return siReact;
    if (url.includes('nodejs.org')) return siNodedotjs;
    if (url.includes('vuejs.org')) return siVuedotjs;
    if (url.includes('python.org')) return siPython;
    if (url.includes('php.net')) return siPhp;
    if (url.includes('ruby-lang.org')) return siRuby;
    if (url.includes('mongodb.com')) return siMongodb;
    if (url.includes('postgresql.org')) return siPostgresql;
    if (url.includes('mysql.com')) return siMysql;
    if (url.includes('w3.org/html')) return siHtml5;
    if (url.includes('w3.org/css')) return siCss3;
    if (url.includes('sass-lang.com')) return siSass;
    if (url.includes('webpack.js.org')) return siWebpack;
    if (url.includes('nginx.org')) return siNginx;
    if (url.includes('kubernetes.io')) return siKubernetes;
    if (url.includes('flutter.dev')) return siFlutter;
    if (url.includes('vitejs.dev')) return siVite;
    if (url.includes('jestjs.io')) return siJest;
    if (url.includes('terraform.io')) return siTerraform;
    return Link;
}

function formatStack(stack?: string): string {
    switch (stack?.toLowerCase()) {
        case 'full':
        case 'fullstack':
            return 'Fullstack'
        case 'frontend':
            return 'Frontend'
        case 'backend':
            return 'Backend'
        default:
            return stack ?? ''
    }
}
</script>
