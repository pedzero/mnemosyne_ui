<template>
  <canvas ref="canvas" class="fixed inset-0 -z-50 w-full h-full"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x08040D, 1) // bg color

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 20

  // circular texture
  function generateCircleTexture() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'aliceblue')
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
    return new THREE.CanvasTexture(canvas)
  }

  const starTexture = generateCircleTexture()

  // stars
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 1000
  const positions = new Float32Array(starCount * 3)
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 200
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const starMaterial = new THREE.PointsMaterial({
    map: starTexture,
    size: .75,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    color: 0xffffff,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // comets
  const cometGroup = new THREE.Group()
  scene.add(cometGroup)

  type TrailParticle = {
    position: THREE.Vector3
    velocity: THREE.Vector3
    life: number
    maxLife: number
    alpha: number
  }

  type Comet = {
    head: THREE.Mesh
    trailParticles: TrailParticle[]
    velocity: THREE.Vector3
    life: number
  }

  const comets: Comet[] = []

  const maxTrailParticles = 100000
  const trailGeometry = new THREE.BufferGeometry()
  const trailPositions = new Float32Array(maxTrailParticles * 3)
  const trailAlphas = new Float32Array(maxTrailParticles)
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
  trailGeometry.setAttribute('alpha', new THREE.BufferAttribute(trailAlphas, 1))

  const trailMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
    attribute float alpha;
    varying float vAlpha;
    void main() {
      vAlpha = alpha;
      gl_PointSize = 2.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    precision mediump float;
    varying float vAlpha;
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      float strength = 1.0 - smoothstep(0.45, 0.5, d);
      gl_FragColor = vec4(0.6, 0.8, 1.0, vAlpha * strength);
    }
  `
  });

  const trailPoints = new THREE.Points(trailGeometry, trailMaterial)
  trailPoints.frustumCulled = false
  scene.add(trailPoints)


  function getRandomDirectionVector(): THREE.Vector3 {
    const x = THREE.MathUtils.randFloatSpread(1)
    const y = THREE.MathUtils.randFloatSpread(0.5)
    const z = THREE.MathUtils.randFloatSpread(0.5)
    const dir = new THREE.Vector3(x, y, z)
    dir.normalize()
    dir.multiplyScalar(0.5 + Math.random() * 0.1) // final velocity
    return dir
  }

  function getRandomStartPosition(): THREE.Vector3 {
    const face = Math.floor(Math.random() * 6)
    const range = 40
    switch (face) {
      case 0: return new THREE.Vector3(-range, Math.random() * 20 - 10, Math.random() * 10 - 5)
      case 1: return new THREE.Vector3(range, Math.random() * 20 - 10, Math.random() * 10 - 5)
      case 2: return new THREE.Vector3(Math.random() * 40 - 20, -20, Math.random() * 10 - 5)
      case 3: return new THREE.Vector3(Math.random() * 40 - 20, 20, Math.random() * 10 - 5)
      case 4: return new THREE.Vector3(Math.random() * 40 - 20, Math.random() * 20 - 10, -20)
      case 5: return new THREE.Vector3(Math.random() * 40 - 20, Math.random() * 20 - 10, 20)
      default: return new THREE.Vector3(-range, 0, 0)
    }
  }

  function spawnComet() {
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xccddff })

    const head = new THREE.Mesh(headGeometry, headMaterial)
    const start = getRandomStartPosition()
    const velocity = getRandomDirectionVector()

    head.position.copy(start)
    cometGroup.add(head)

    comets.push({
      head,
      trailParticles: [],
      velocity,
      life: 0
    })
  }

  let lastCometTime = 0
  const cometInterval = 5000

  let frameId: number
  function animate(time: number) {
    frameId = requestAnimationFrame(animate)

    stars.rotation.y += 0.0002
    stars.rotation.x += 0.0001

    if (time - lastCometTime > cometInterval) {
      spawnComet()
      lastCometTime = time
    }

    let particleIndex = 0
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i]
      c.head.position.add(c.velocity)
      c.life++

      // add new trail particle
        const maxLife = 20
        c.trailParticles.push({
          position: c.head.position.clone(),
          velocity: c.velocity.clone().multiplyScalar(-0.1).add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.02,
              (Math.random() - 0.5) * 0.02,
              (Math.random() - 0.5) * 0.02
            )
          ),
          life: maxLife,
          maxLife,
          alpha: 1.0
        })

      // update comet particle
      for (let j = c.trailParticles.length - 1; j >= 0; j--) {
        const p = c.trailParticles[j]
        p.position.add(p.velocity)
        p.life--
        p.alpha = p.life / p.maxLife
        if (p.life <= 0) {
          c.trailParticles.splice(j, 1)
        } else {
          if (particleIndex < maxTrailParticles) {
            trailPositions[particleIndex * 3 + 0] = p.position.x
            trailPositions[particleIndex * 3 + 1] = p.position.y
            trailPositions[particleIndex * 3 + 2] = p.position.z
            trailAlphas[particleIndex] = p.alpha
            particleIndex++
          }
        }
      }

      // Remover cometa
      if (c.life > 400) {
        cometGroup.remove(c.head)
        comets.splice(i, 1)
      }
      if (particleIndex >= maxTrailParticles) break
    }

    trailGeometry.setDrawRange(0, particleIndex)
    trailGeometry.attributes.position.needsUpdate = true
    trailGeometry.attributes.alpha.needsUpdate = true

    renderer.render(scene, camera)
  }

  animate(0)

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onResize)

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  })
})
</script>

<style scoped>
canvas {
  background: transparent
}
</style>
