<!-- src/pages/ManageProjects.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProjects } from '../services/projectsService'
import type { Project } from '../types'
import { toast } from 'vue-sonner'
import NebulaBackground from '../components/backgrounds/NebulaBackground.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { Plus, ChevronLeft } from 'lucide-vue-next'

const projects = ref<Project[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    projects.value = await fetchProjects()
    toast.success('Projetos carregados com sucesso')
  } catch (err: any) {
    const status = err.response?.status || 500
    const message = err.response?.data?.message || 'Erro ao carregar projetos'
    toast.error(`Erro ${status}: ${message}`)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <NebulaBackground />

  <main class="relative z-0 min-h-screen py-8 px-6 text-white font-space-grotesk bg-transparent flex justify-center">
    <section class="w-full max-w-screen-xl bg-white/5 backdrop-blur-sm p-6 rounded-xl space-y-8">

      <div class="flex items-center gap-4">
        <router-link to="/manage" class="bg-white/0 hover:bg-white/10 p-2 rounded-xl shrink-0">
          <ChevronLeft class="w-5 h-5 text-white" />
        </router-link>
        <h1 class="text-2xl font-bold text-white">Gerenciar Projetos</h1>
      </div>

      <div v-if="isLoading" class="text-center text-neutral-400">Carregando projetos...</div>

      <div v-else-if="projects.length === 0" class="text-center text-neutral-400">
        Nenhum projeto encontrado.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- add new project -->
        <div
          class="group relative w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden transform-gpu transition-transform duration-300 ease-out hover:rotate-[0.25deg] hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(42,21,63,0.4)] cursor-pointer flex flex-col items-center justify-center text-white/70 hover:text-white py-10"
          :style="{ perspective: '1000px' }"
          @click="$router.push('/manage/projects/new')"
        >
          <Plus class="w-10 h-10 mb-2" />
          <span class="text-base font-medium">Adicionar Projeto</span>
        </div>

        <!-- existing projects -->
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @click="$router.push(`/manage/projects/${project.id}`)"
        />
      </div>
    </section>
  </main>
</template>
