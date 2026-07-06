const USERS_KEY = 'auth_users'
const SESSION_KEY = 'auth_session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export const authApi = {
  getSession: () => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
    } catch {
      return null
    }
  },

  login: (credentials) => {
    const users = getUsers()
    const user = users.find(
      (u) => (u.identifier === credentials.identifier && u.password === credentials.password)
    )
    if (!user) {
      throw new Error('شماره موبایل یا رمز عبور اشتباه است')
    }
    const { password, ...safe } = user
    saveSession(safe)
    return safe
  },

  register: (data) => {
    const users = getUsers()
    const exists = users.some((u) => u.identifier === data.identifier)
    if (exists) {
      throw new Error('این شماره موبایل قبلاً ثبت شده است')
    }
    const newUser = { id: Date.now(), ...data }
    users.push(newUser)
    saveUsers(users)
    const { password, ...safe } = newUser
    saveSession(safe)
    return safe
  },

  logout: () => {
    clearSession()
  },

  updateUser: (userId, updates) => {
    const users = getUsers()
    const index = users.findIndex((u) => u.id === userId)
    if (index === -1) return null
    users[index] = { ...users[index], ...updates }
    saveUsers(users)
    const { password, ...safe } = users[index]
    saveSession(safe)
    return safe
  },
}
