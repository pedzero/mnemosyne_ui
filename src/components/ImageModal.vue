<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" @click.self="close">
      <div class="relative max-w-5xl w-full p-4">
        <button @click="close" class="absolute top-4 left-4 text-white hover:text-red-400 z-50">
          <X class="w-6 h-6" />
        </button>

        <img :src="images[current].url" alt="Imagem ampliada"
     class="w-full max-h-[80vh] object-contain rounded-lg transition-all duration-300" />

        <!-- Navegação -->
        <button v-if="images.length > 1" @click="prev" class="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
          <ChevronLeft class="w-8 h-8" />
        </button>
        <button v-if="images.length > 1" @click="next" class="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
          <ChevronRight class="w-8 h-8" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

const props = defineProps<{
  images: { url: string }[]
  index: number
  show: boolean
}>()

const emit = defineEmits(['close'])

const current = ref(props.index)

function close() {
  emit('close')
}

function next() {
  current.value = (current.value + 1) % props.images.length
}

function prev() {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))

watch(() => props.index, (val) => current.value = val)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
