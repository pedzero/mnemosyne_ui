<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProjectById, createProject, updateProject } from '../services/projectsService'
import { toast } from 'vue-sonner'
import ProjectForm from '../components/ProjectForm.vue'
import NebulaBackground from '../components/backgrounds/NebulaBackground.vue'
import { ChevronLeft } from 'lucide-vue-next'
import type { Project } from '../types'

const route = useRoute()
const router = useRouter()

const isEditing = !!route.params.id
const projectId = Number(route.params.id)

const project = ref<Project | null>(null)
const loading = ref(false)

onMounted(async () => {
  if (isEditing && !isNaN(projectId)) {
    try {
      loading.value = true
      project.value = await fetchProjectById(projectId)
    } catch (err: any) {
      toast.error(`Erro ${err.response?.status || 500}: ${err.response?.data?.message || 'Erro ao carregar projeto'}`)
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit(formData: FormData, token: string) {
  try {
    loading.value = true

    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    if (isEditing && project.value) {
      const updated = await updateProject(project.value.id, formData, config)
      project.value = updated
      toast.success('Projeto atualizado com sucesso')
    } else {
      const newProject = await createProject(formData, config)
      toast.success('Projeto criado com sucesso')
      router.replace(`/manage/projects/${newProject.id}`)
    }
  } catch (err: any) {
    toast.error(`Erro ${err.response?.status || 500}: ${err.response?.data?.message || 'Erro ao salvar projeto'}`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NebulaBackground />

  <main class="relative z-10 min-h-screen py-12 px-6 font-space-grotesk text-white flex justify-center items-start">
    <section class="w-full max-w-5xl bg-white/5 rounded-2xl p-6 space-y-8 border border-white/10 shadow-xl">
      
      <div class="flex items-center gap-4">
        <router-link to="/manage/projects" class="bg-white/0 hover:bg-white/10 p-2 rounded-xl shrink-0">
          <ChevronLeft class="w-5 h-5 text-white" />
        </router-link>
        <h1 class="text-2xl font-bold tracking-tight">
          {{ isEditing ? 'Editar Projeto' : 'Novo Projeto' }}
        </h1>
      </div>

      <div v-if="!loading">
        <ProjectForm :initial-project="project" @submit="handleSubmit" />
      </div>

      <div v-else class="text-center text-neutral-400 py-12">
        Carregando informações do projeto...
      </div>
    </section>
  </main>
</template>
