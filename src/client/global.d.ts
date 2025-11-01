// handles importing scss as modules
declare module '*.scss' {
    const content: string
    export default content
}

// handles importing html as modules
declare module '*.html' {
    const content: string
    export default content
}

// ServiceNow specific global types
declare global {
    interface Window {
        g_ck: string
        g_user: {
            userID: string
            firstName: string
            lastName: string
            userName: string
        }
        NOW: any
    }
}

export {}
