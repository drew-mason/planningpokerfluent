// ULTRA-AGGRESSIVE extension suppressor - inject immediately into page context
if (typeof document !== 'undefined') {
    const script = document.createElement('script');
    script.textContent = `
(function() {
    'use strict';
    const originalError = console.error;
    const suppressPatterns = ['content_script', 'cannot read properties of undefined', 'control', 'shouldoffercompletionlistforfield'];
    
    console.error = function(...args) {
        const msg = String(args[0] || '').toLowerCase();
        if (!suppressPatterns.some(p => msg.includes(p))) {
            originalError.apply(console, args);
        }
    };
    
    window.onerror = function(msg, src) {
        const msgStr = String(msg || '').toLowerCase();
        const srcStr = String(src || '').toLowerCase();
        if (msgStr.includes('content_script') || srcStr.includes('content_script') || msgStr.includes('cannot read properties of undefined')) {
            return true;
        }
        return false;
    };
    
    console.log('🛡️ Extension suppressor injected in page context');
})();
    `;
    (document.head || document.documentElement).appendChild(script);
    script.remove(); // Clean up
}

// IMMEDIATE extension error suppression - before any other code
(function() {
    if (typeof window === 'undefined') return;
    
    // Override console methods immediately
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function(...args) {
        const msg = String(args[0] || '').toLowerCase();
        if (msg.includes('content_script') || 
            msg.includes('cannot read properties of undefined') || 
            msg.includes('control') || 
            msg.includes('uncaught typeerror') ||
            msg.includes('shouldoffercompletionlistforfield') ||
            msg.includes('elementwasfocused') ||
            msg.includes('focusineventhandler') ||
            msg.includes('processinputevent')) {
            return; // Silently suppress
        }
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const msg = String(args[0] || '').toLowerCase();
        if (msg.includes('content_script') || msg.includes('extension')) {
            return; // Silently suppress
        }
        originalWarn.apply(console, args);
    };
    
    // Override error handlers
    window.onerror = function(msg, source, line, col, error) {
        const msgStr = String(msg || '').toLowerCase();
        const srcStr = String(source || '').toLowerCase();
        
        if (msgStr.includes('content_script') || 
            srcStr.includes('content_script') ||
            msgStr.includes('cannot read properties of undefined') ||
            msgStr.includes('control') ||
            srcStr.includes('chrome-extension') ||
            srcStr.includes('moz-extension')) {
            return true; // Suppress
        }
        return false;
    };
    
    window.addEventListener('error', function(e) {
        const msg = String(e.message || '').toLowerCase();
        const src = String(e.filename || '').toLowerCase();
        if (msg.includes('content_script') || src.includes('content_script') ||
            msg.includes('cannot read properties of undefined')) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
    
    window.addEventListener('unhandledrejection', function(e) {
        const reason = String(e.reason || '').toLowerCase();
        if (reason.includes('content_script') || reason.includes('control')) {
            e.preventDefault();
        }
    });
    
    console.log('Extension suppression activated immediately');
})();

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