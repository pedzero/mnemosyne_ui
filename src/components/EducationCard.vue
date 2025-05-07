<template>
    <div
        class="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div class="flex items-start gap-2">
            <GraduationCap class="w-5 h-5 text-white/70 mt-[2px]" />
            <div>
                <h3 class="text-white font-semibold text-lg">{{ degree }}</h3>
                <p class="text-sm text-neutral-300 mt-1">{{ institution }}</p>
            </div>
        </div>
        <span class="text-sm text-neutral-400 sm:text-right mt-2 sm:mt-0">
            {{ startYear }} - {{ endYear ?? 'Atual' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next'

defineProps<{
    degree: string
    institution: string
    startYear: number
    endYear?: number | null
}>()
</script>
