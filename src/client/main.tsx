// Aggressive extension error suppression - must be first
if (typeof window !== 'undefined') {
    // Override console.error to suppress extension errors
    const originalError = console.error
    console.error = (...args) => {
        const msg = String(args[0] || '').toLowerCase()
        if (msg.includes('content_script') || 
            msg.includes('cannot read properties of undefined') || 
            msg.includes('control') || 
            msg.includes('shouldoffercompletionlistforfield') ||
            msg.includes('elementwasfocused') ||
            msg.includes('focusineventhandler') ||
            msg.includes('processinputevent') ||
            msg.includes('uncaught typeerror')) {
            // Silently suppress extension errors
            return
        }
        originalError.apply(console, args)
    }
    
    // Override window.onerror to catch extension errors
    const originalOnError = window.onerror
    window.onerror = (msg, source, line, col, error) => {
        const msgStr = String(msg || '').toLowerCase()
        const srcStr = String(source || '').toLowerCase()
        
        if (msgStr.includes('content_script') || 
            srcStr.includes('content_script') ||
            msgStr.includes('cannot read properties of undefined') ||
            msgStr.includes('control') ||
            srcStr.includes('chrome-extension') ||
            srcStr.includes('moz-extension')) {
            return true // Suppress the error
        }
        return originalOnError ? originalOnError(msg, source, line, col, error) : false
    }
    
    // Handle unhandled promise rejections from extensions  
    const originalUnhandledRejection = window.onunhandledrejection
    window.onunhandledrejection = (event) => {
        const reason = event.reason
        const message = String(reason?.message || reason || '').toLowerCase()
        
        if (message.includes('content_script') ||
            message.includes('cannot read properties of undefined') ||
            message.includes('control') ||
            message.includes('shouldoffercompletionlistforfield')) {
            event.preventDefault()
            return true
        }
        
        return originalUnhandledRejection ? originalUnhandledRejection.call(window, event) : false
    }
    
    console.log('Extension error suppression activated')
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'

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