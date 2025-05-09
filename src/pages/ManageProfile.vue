<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProfile, updateProfile } from '../services/profileService'
import NebulaBackground from '../components/backgrounds/NebulaBackground.vue'
import { toast } from 'vue-sonner'
import type { Profile } from '../types'

type ProfileForm = Omit<Profile, 'educations'> & {
  educations: Array<Omit<Profile['educations'][number], 'id'>>
}

const profile = ref<ProfileForm | null>(null)
const password = ref('')

onMounted(async () => {
  try {
    const data = await fetchProfile()
    profile.value = data
    toast.success('Perfil carregado com sucesso')
  } catch (err: any) {
    const status = err.response?.status || 500
    const message = err.response?.data?.message || 'Erro ao carregar perfil'
    toast.error(`Erro ${status}: ${message}`)
  }
})

function addSocial() {
  profile.value?.socials.push({ name: '', url: '' })
}

function removeSocial(index: number) {
  profile.value?.socials.splice(index, 1)
}

function addEducation() {
  profile.value?.educations.push({
    institution: '',
    degree: '',
    startYear: new Date().getFullYear(),
    endYear: undefined
  })
}

function removeEducation(index: number) {
  profile.value?.educations.splice(index, 1)
}

async function saveProfile() {
  try {
    const res = await updateProfile(profile.value!, password.value)
    toast.success(`Sucesso ${res.status}: Perfil atualizado`)
  } catch (err: any) {
    const status = err.response?.status || 500
    const message = err.response?.data?.message || 'Erro ao atualizar perfil'
    toast.error(`Erro ${status}: ${message}`)
  }
}
</script>

<template>
  <NebulaBackground />

  <main class="relative z-0 min-h-screen py-8 px-6 text-white font-space-grotesk bg-transparent flex justify-center">
    <section class="w-full max-w-screen-lg bg-white/5 backdrop-blur-sm p-6 rounded-xl space-y-8">
      <h1 class="text-2xl font-bold text-white">Gerenciar Perfil</h1>

      <div v-if="profile" class="space-y-6">
        <!-- main data -->
        <div class="space-y-3">
          <input v-model="profile.name" placeholder="Nome"
            class="w-full bg-white/10 text-white placeholder-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20" />
          <input v-model="profile.email" placeholder="Email"
            class="w-full bg-white/10 text-white placeholder-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20" />
          <textarea v-model="profile.summary" placeholder="Resumo" rows="5"
            class="w-full bg-white/10 text-white placeholder-neutral-400 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-white/20" />
        </div>

        <!-- socials -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-white/80">Redes Sociais</h2>
          <div v-for="(social, index) in profile.socials" :key="index" class="flex flex-col md:flex-row gap-2">
            <input v-model="social.name" placeholder="Nome (ex: GitHub)"
              class="flex-1 bg-white/10 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20" />
            <input v-model="social.url" placeholder="URL"
              class="flex-1 bg-white/10 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20" />
            <button @click="removeSocial(index)"
              class="text-sm text-red-400 hover:text-red-300 hover:underline self-center md:self-auto">Remover</button>
          </div>
          <button @click="addSocial"
            class="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all">Adicionar rede</button>
        </div>

        <!-- educations -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-white/80">Formação</h2>
          <div v-for="(edu, index) in profile.educations" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input v-model="edu.institution" placeholder="Instituição"
              class="bg-white/10 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20" />
            <input v-model="edu.degree" placeholder="Curso"
              class="bg-white/10 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20" />
            <input v-model.number="edu.startYear" type="number" placeholder="Ano início"
              class="bg-white/10 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20" />
            <input v-model.number="edu.endYear" type="number" placeholder="Ano fim"
              class="bg-white/10 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20" />
            <button @click="removeEducation(index)"
              class="text-sm text-red-400 hover:text-red-300 hover:underline col-span-1 md:col-span-2 text-left">Remover</button>
          </div>
          <button @click="addEducation"
            class="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all">Adicionar
            formação</button>
        </div>

        <!-- auth -->
        <div class="space-y-2">
          <label class="text-sm text-neutral-300 block">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="Senha de autenticação"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
          />
        </div>

        <!-- save -->
        <div class="text-right">
          <button @click="saveProfile"
            class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-base font-medium transition-all">
            Salvar
          </button>
        </div>
      </div>

      <div v-else class="text-center text-neutral-400">Carregando perfil...</div>
    </section>
  </main>
</template>