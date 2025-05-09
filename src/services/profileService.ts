import api from '../lib/api'

export async function fetchProfile() {
    const response = await api.get('/profile')
    return response.data
}

export async function updateProfile(profile: any, password: string) {
  return await api.put('/profile', profile, {
    headers: { Authorization: `Bearer ${password}` }
  })
}
