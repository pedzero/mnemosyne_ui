import api from '../lib/api'

export async function fetchProjects() {
    const response = await api.get('/projects')
    return response.data
}
