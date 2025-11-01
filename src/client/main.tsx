import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

// Add error boundary and logging for debugging
console.log('Planning Poker App: Initializing...')

// Simple Error Boundary for main app
class AppErrorBoundary extends React.Component<
    { children: React.ReactNode }, 
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Planning Poker App Critical Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Planning Poker Application</h1>
                    <p>Unable to load the application. Please refresh the page.</p>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

const rootElement = document.getElementById('root')
if (rootElement) {
    console.log('Planning Poker App: Root element found, mounting React app')
    try {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <AppErrorBoundary>
                    <App />
                </AppErrorBoundary>
            </React.StrictMode>
        )
        console.log('Planning Poker App: Successfully mounted')
    } catch (error) {
        console.error('Planning Poker App: Failed to mount:', error)
    }
} else {
    console.error('Planning Poker App: Root element not found!')
}
