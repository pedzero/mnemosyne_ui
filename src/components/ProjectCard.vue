<template>
    <div class="group relative w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden transform-gpu transition-transform duration-300 ease-out hover:rotate-[0.25deg] hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(42,21,63,0.4)]"
        :style="{ perspective: '1000px' }" @click="handleClick">

        <!-- Imagem -->
        <div class="w-full h-40 bg-neutral-700">
            <img v-if="firstImageSrc" :src="firstImageSrc" alt="Imagem do projeto" class="w-full h-full object-cover" />
        </div>

        <!-- Conteúdo -->
        <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-1">{{ project.name }}</h3>
            <p class="text-sm text-neutral-300 line-clamp-3">{{ project.summary }}</p>
        </div>

        <!-- Rodapé do Card -->
        <div class="flex items-center gap-4 px-4 py-3 text-neutral-300">
            <div class="flex items-center gap-1" :title="`${project.repositories.length} repositórios`">
                <FolderGit2 class="w-5 h-5" />
                <span class="text-sm">{{ project.repositories.length }}</span>
            </div>

            <div v-if="project.collaborators.length > 0" class="flex items-center gap-1"
                :title="`${project.collaborators.length} colaboradores`">
                <UserRoundPlus class="w-5 h-5" />
                <span class="text-sm">{{ project.collaborators.length }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderGit2, UserRoundPlus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import type { Collaborator, Image, Repository } from '../types/index'

const props = defineProps<{
    project: {
        id: number
        name: string
        summary: string
        images: Image[]
        collaborators: Collaborator[]
        repositories: Repository[]
    }
}>()

const router = useRouter()

function handleClick() {
    router.push(`/projects/${props.project.id}`)
}

const firstImageSrc = computed(() => {
    const image = props.project.images?.[0]
    const data = image?.data

    if (!data) return null

    const byteArray = Object.values(data)

    try {
        const binary = String.fromCharCode(...byteArray)
        return `data:image/png;base64,${btoa(binary)}`
    } catch (e) {
        console.error('Erro ao converter imagem:', e)
        return null
    }
})

</script>

<style scoped></style>
