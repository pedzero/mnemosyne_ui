import api from '../lib/api'

export async function fetchProjects() {
  const response = await api.get('/projects')
  return response.data
}

export async function fetchProjectById(id: number) {
  const response = await api.get(`/projects/${id}`)
  return response.data
}

export async function createProject(formData: FormData, config?: object) {
  const response = await api.post('/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(config?.['headers'] || {})
    }
  })
  return response.data
}

export async function updateProject(id: number, formData: FormData, config?: object) {
  const response = await api.put(`/projects/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(config?.['headers'] || {})
    }
  })
  return response.data
}

export async function deleteProject(id: number) {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}

