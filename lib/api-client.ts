const API_BASE = "/api"

export const apiClient = {
  async getMenu(category?: string) {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    const response = await fetch(`${API_BASE}/menu?${params}`)
    return response.json()
  },

  async getOrders(status?: string) {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    const response = await fetch(`${API_BASE}/orders?${params}`)
    return response.json()
  },

  async createOrder(data: any) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async updateOrder(id: string, data: any) {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getReservations(status?: string, date?: string) {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    if (date) params.append("date", date)
    const response = await fetch(`${API_BASE}/reservations?${params}`)
    return response.json()
  },

  async createReservation(data: any) {
    const response = await fetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },
}
