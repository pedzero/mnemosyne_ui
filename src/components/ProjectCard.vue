<template>
    <div
        class="group relative w-full max-w-sm rounded-2xl bg-neutral-800 shadow-2xl overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <div class="w-full h-40 bg-neutral-700">
            <img :src="project.image" alt="Project image" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-1">{{ project.name }}</h3>
            <p class="text-sm text-neutral-300 line-clamp-3">{{ project.summary }}</p>
        </div>
        <div class="flex items-center gap-4 px-4 py-3 text-neutral-300">
            <div class="flex items-center gap-1 group/repo"
                :title="`${project.repositories.length} repositórios`">
                <FolderGit2 class="w-5 h-5" />
                <span class="text-sm">{{ project.repositories.length }}</span>
            </div>

            <div class="flex items-center gap-1 group/collab"
                :title="`${project.collaborators.length} colaboradores`">
                <UserRoundPlus class="w-5 h-5" />
                <span class="text-sm">{{ project.collaborators.length }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderGit2, UserRoundPlus } from 'lucide-vue-next'

defineProps<{
    project: {
        name: string
        summary: string
        image: string
        repositories: any[]
        collaborators: any[]
    }
}>()
</script>

<style scoped>
.group:hover {
    transform: scale(1.03);
}
</style>