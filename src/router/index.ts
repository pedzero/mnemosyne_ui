import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProjectPage from '../pages/ProjectPage.vue'
import ManageHome from '../pages/ManageHome.vue'
import ManageProfile from '../pages/ManageProfile.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/projects/:id', component: ProjectPage },
    { path: '/manage', component: ManageHome },
    { path: '/manage/profile', component: ManageProfile }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
