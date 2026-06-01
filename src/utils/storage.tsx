export const getRole = () => {
    return localStorage.getItem("role")
}
export const setRole = (role: string) => {
    localStorage.setItem("role", role)
}

export const getName = () => {
    return localStorage.getItem("name")
}
export const setName = (name: string) => {
    localStorage.setItem("name", name)
}


export const getId = () => {
    return localStorage.getItem("id")
}
export const setId = (id: string) => {
    localStorage.setItem("id", id)
}


export const getToken = () => {
    return localStorage.getItem("token")
}
export const setToken = (token: string) => {
    localStorage.setItem("token", token)
}
