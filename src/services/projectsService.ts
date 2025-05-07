import api from '../lib/api'

export async function fetchProjects() {
    const response = await api.get('/projects')
    return response.data
}

export async function fetchProjectById(id: number) {
    const response = await api.get(`/projects/${id}`)
    return response.data
}
