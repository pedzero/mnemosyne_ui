<template>
  <NebulaBackground />

  <main
    class="relative z-0 min-h-screen flex items-center justify-center px-6 py-8 text-white font-space-grotesk bg-transparent">
    <section
      class="w-full max-w-screen-md grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Card: Gerenciar Perfil -->
      <router-link
        to="/manage/profile"
        class="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all duration-300 shadow-lg hover:scale-[1.02]">
        <UserRound class="w-10 h-10 text-white mb-4" />
        <h2 class="text-xl font-semibold mb-1">Gerenciar Perfil</h2>
        <p class="text-sm text-white/70">Atualize suas informações pessoais, redes sociais e contato.</p>
      </router-link>

      <!-- Card: Gerenciar Projetos -->
      <router-link
        to="/manage/projects"
        class="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all duration-300 shadow-lg hover:scale-[1.02]">
        <Code class="w-10 h-10 text-white mb-4" />
        <h2 class="text-xl font-semibold mb-1">Gerenciar Projetos</h2>
        <p class="text-sm text-white/70">Crie, edite e organize seus projetos de portfólio com facilidade.</p>
      </router-link>
    </section>
  </main>
</template>

<script setup lang="ts">
import NebulaBackground from '../components/backgrounds/NebulaBackground.vue'
import { UserRound, Code } from 'lucide-vue-next'
</script>
