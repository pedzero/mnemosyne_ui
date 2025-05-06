<template>
    <div class="min-h-screen bg-black text-white p-6 space-y-4">
        <h1 class="text-3xl font-bold">Projetos</h1>

        <div class="flex flex-wrap gap-6">
            <ProjectCard v-for="(project, index) in projects" :key="index" :project="project" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ProjectCard from '../components/ProjectCard.vue'

const projects = [
    {
        name: 'Meu Projeto',
        summary: 'Resumo do projeto aqui',
        image: 'https://via.placeholder.com/400x200.png?text=Imagem+1',
        collaborators: Array(3).fill({}),
        repositories: Array(2).fill({})
    },
    {
        name: 'Outro Projeto',
        summary: 'Exemplo de outro projeto',
        image: 'https://via.placeholder.com/400x200.png?text=Imagem+2',
        collaborators: Array(1).fill({}),
        repositories: Array(4).fill({})
    }
]
</script>