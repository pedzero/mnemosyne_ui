<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project } from '../types'

const emit = defineEmits<{
  (e: 'submit', formData: FormData, token: string): void
}>()

const props = defineProps<{
  initialProject?: Project | null
}>()

const name = ref('')
const summary = ref('')
const description = ref('')
const stack = ref('')
const order = ref(0)
const technologies = ref<{ name: string; url: string }[]>([])
const repositories = ref<{ name: string; url: string }[]>([])
const collaborators = ref<{ name: string; portfolioUrl: string }[]>([])
const images = ref<File[]>([])
const token = ref('')

const existingImages = ref<string[]>([])

watch(() => props.initialProject, (project) => {
  if (project) {
    name.value = project.name
    summary.value = project.summary
    description.value = project.description!
    stack.value = project.stack
    order.value = project.order || 0
    technologies.value = project.technologies.map(t => ({ name: t.name, url: t.url }))
    repositories.value = project.repositories?.map(r => ({ name: r.name, url: r.url })) || []
    collaborators.value = project.collaborators?.map(c => ({ name: c.name, portfolioUrl: c.portfolioUrl })) || []
    existingImages.value = project.images.map(i => i.url)
  }
}, { immediate: true })

function addTechnology() {
  technologies.value.push({ name: '', url: '' })
}

function removeTechnology(index: number) {
  technologies.value.splice(index, 1)
}

function addRepository() {
  repositories.value.push({ name: '', url: '' })
}

function removeRepository(index: number) {
  repositories.value.splice(index, 1)
}

function addCollaborator() {
  collaborators.value.push({ name: '', portfolioUrl: '' })
}

function removeCollaborator(index: number) {
  collaborators.value.splice(index, 1)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    images.value = Array.from(target.files)
  }
}

function handleSubmit() {
  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('summary', summary.value)
  formData.append('description', description.value)
  formData.append('stack', stack.value)
  formData.append('order', order.value.toString())

  // Corrigido: enviar arrays como JSON
  formData.append('repositories', JSON.stringify(repositories.value))
  formData.append('technologies', JSON.stringify(technologies.value))
  formData.append('collaborators', JSON.stringify(collaborators.value))

  images.value.forEach((file) => {
    formData.append('images', file)
  })

  emit('submit', formData, token.value)
}
</script>

<template>
  
  <form class="w-full max-w-screen-lg bg-transparent backdrop-blur-sm rounded-xl space-y-6"
    @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="name" placeholder="Nome" class="input" required />
      <input v-model="stack" placeholder="Stack" class="input" required />
      <input v-model.number="order" type="number" placeholder="Ordem" class="input" min="0" />
    </div>

    <textarea v-model="summary" placeholder="Resumo" rows="3" class="input resize-none" required />
    <textarea v-model="description" placeholder="Descrição" rows="5" class="input resize-none" />

    <!-- repositories -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold text-white/80">Repositórios</h2>
      <div v-for="(repo, index) in repositories" :key="index" class="flex flex-col md:flex-row gap-2">
        <input v-model="repo.name" type="text" placeholder="Nome do repositório" class="input flex-1" />
        <input v-model="repo.url" type="text" placeholder="URL" class="input flex-1" />
        <button type="button" @click="removeRepository(index)"
          class="text-sm text-red-400 hover:text-red-300 hover:underline self-center md:self-auto">Remover</button>
      </div>
      <button type="button" @click="addRepository"
        class="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all">+ Adicionar
        repositório</button>
    </div>

    <!-- technologies -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold text-white/80">Tecnologias</h2>
      <div v-for="(tech, index) in technologies" :key="index" class="flex flex-col md:flex-row gap-2">
        <input v-model="tech.name" type="text" placeholder="Nome da tecnologia" class="input flex-1" />
        <input v-model="tech.url" type="text" placeholder="URL" class="input flex-1" />
        <button type="button" @click="removeTechnology(index)"
          class="text-sm text-red-400 hover:text-red-300 hover:underline self-center md:self-auto">Remover</button>
      </div>
      <button type="button" @click="addTechnology"
        class="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all">+ Adicionar
        tecnologia</button>
    </div>

    <!-- collaborators -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold text-white/80">Colaboradores</h2>
      <div v-for="(collab, index) in collaborators" :key="index" class="flex flex-col md:flex-row gap-2">
        <input v-model="collab.name" type="text" placeholder="Nome do colaborador" class="input flex-1" />
        <input v-model="collab.portfolioUrl" type="text" placeholder="URL do portfólio" class="input flex-1" />
        <button type="button" @click="removeCollaborator(index)"
          class="text-sm text-red-400 hover:text-red-300 hover:underline self-center md:self-auto">Remover</button>
      </div>
      <button type="button" @click="addCollaborator"
        class="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all">+ Adicionar
        colaborador</button>
    </div>

    <!-- images -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold text-white/80">Imagens</h2>
      <input type="file" accept="image/*" multiple @change="handleFileChange" class="input-file" />
      <div v-if="existingImages.length > 0" class="space-y-1 text-sm text-neutral-300">
        <p class="text-neutral-400">Imagens existentes:</p>
        <ul class="list-disc list-inside">
          <li v-for="(img, i) in existingImages" :key="i">
            <a :href="img" target="_blank" class="hover:underline text-violet-700 break-all">{{ img }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- auth -->
    <div
      class="flex flex-col md:flex-row gap-4 items-center justify-end focus:outline-none focus:ring-2 focus:ring-white/20">
      <input v-model="token" type="password" placeholder="Senha de autenticação" class="input flex-1" />
      <button type="submit"
        class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-base font-medium transition-all">
        {{ props.initialProject ? 'Salvar alterações' : 'Criar projeto' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.input {
  @apply w-full bg-white/10 text-white placeholder-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20;
}

.input-file {
  @apply block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 hover:file:bg-white/30;
}
</style>
