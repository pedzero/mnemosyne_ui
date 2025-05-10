import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProjectPage from '../pages/ProjectPage.vue'
import ManageHome from '../pages/ManageHome.vue'
import ManageProfile from '../pages/ManageProfile.vue'
import ManageProjectsSelector from '../pages/ManageProjectsSelector.vue'
import ManageProject from '../pages/ManageProject.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/projects/:id', component: ProjectPage },
    { path: '/manage', component: ManageHome },
    { path: '/manage/profile', component: ManageProfile },
    { path: '/manage/projects', component: ManageProjectsSelector },
    { path: '/manage/projects/:id', component: ManageProject }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
