import api from '../lib/api'

export async function fetchProfile() {
    const response = await api.get('/profile')
    return response.data
}
