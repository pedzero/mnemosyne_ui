import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProjectPage from '../pages/ProjectPage.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/projects/:id', component: ProjectPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
