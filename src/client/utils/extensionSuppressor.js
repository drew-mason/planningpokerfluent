/**
 * Comprehensive Browser Extension Interference Suppressor
 * 
 * This module aggressively prevents browser extensions (password managers,
 * form fillers, etc.) from interfering with the Planning Poker application.
 */

class ExtensionSuppressor {
    constructor() {
        this.initialized = false
        this.originalMethods = {}
        this.suppressedErrors = new Set()
        this.init()
    }

    init() {
        if (this.initialized || typeof window === 'undefined') return
        
        this.suppressConsoleErrors()
        this.suppressWindowErrors()
        this.interceptEventListeners()
        this.addProtectiveMeta()
        this.hideExtensionOverlays()
        this.preventFormInterference()
        
        this.initialized = true
        console.debug('ExtensionSuppressor: Initialized comprehensive protection')
    }

    suppressConsoleErrors() {
        const original = console.error
        this.originalMethods.consoleError = original
        
        console.error = (...args) => {
            const message = args.join(' ').toLowerCase()
            
            // Extension-related error patterns
            const extensionPatterns = [
                'content_script',
                "cannot read properties of undefined (reading 'control')",
                'shouldoffercompletionlistforfield',
                'elementwasfocused',
                'focusineventhandler',
                'processInputEvent',
                'lastpass',
                '1password',
                'bitwarden',
                'dashlane',
                'keeper',
                'roboform',
                'extension',
                'chrome-extension',
                'moz-extension'
            ]
            
            const isExtensionError = extensionPatterns.some(pattern => 
                message.includes(pattern)
            )
            
            if (isExtensionError) {
                this.suppressedErrors.add(args[0])
                return // Silently suppress
            }
            
            original.apply(console, args)
        }
    }

    suppressWindowErrors() {
        // Override window.onerror
        const originalOnError = window.onerror
        this.originalMethods.onError = originalOnError
        
        window.onerror = (message, source, lineno, colno, error) => {
            if (this.isExtensionRelated(message, source, error)) {
                return true // Suppress the error
            }
            return originalOnError ? originalOnError(message, source, lineno, colno, error) : false
        }

        // Override unhandled promise rejections
        const originalUnhandledRejection = window.onunhandledrejection
        this.originalMethods.onUnhandledRejection = originalUnhandledRejection
        
        window.onunhandledrejection = (event) => {
            if (this.isExtensionRelated(event.reason?.message, event.reason?.stack, event.reason)) {
                event.preventDefault()
                return true
            }
            return originalUnhandledRejection ? originalUnhandledRejection(event) : false
        }
    }

    interceptEventListeners() {
        const original = window.addEventListener
        this.originalMethods.addEventListener = original
        
        window.addEventListener = function(type, listener, options) {
            if (type === 'error' || type === 'unhandledrejection') {
                const wrapped = (event) => {
                    const error = event.error || event.reason
                    if (ExtensionSuppressor.prototype.isExtensionRelated(
                        error?.message, 
                        error?.stack, 
                        error
                    )) {
                        event.stopPropagation()
                        event.preventDefault()
                        return
                    }
                    if (typeof listener === 'function') {
                        listener(event)
                    }
                }
                return original.call(this, type, wrapped, options)
            }
            return original.call(this, type, listener, options)
        }
    }

    addProtectiveMeta() {
        const metaTags = [
            { name: 'no-password-suggestions', content: 'true' },
            { name: 'autocomplete', content: 'off' },
            { name: 'form-type', content: 'other' },
            { name: 'password-suggestions', content: 'false' },
            { name: 'autofill', content: 'false' },
            { name: 'data-form-type', content: 'other' },
            { name: 'data-lpignore', content: 'true' },
            { name: 'data-1p-ignore', content: 'true' },
            { name: 'data-bwignore', content: 'true' }
        ]
        
        metaTags.forEach(({ name, content }) => {
            if (!document.querySelector(`meta[name="${name}"]`)) {
                const meta = document.createElement('meta')
                meta.name = name
                meta.content = content
                document.head.appendChild(meta)
            }
        })
    }

    hideExtensionOverlays() {
        const style = document.createElement('style')
        style.id = 'extension-suppressor-styles'
        style.textContent = `
            /* Hide extension overlays and tooltips */
            [data-lastpass-root], 
            [data-1p-root], 
            [data-bw-root],
            [data-dashlane-root] { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            .lastpass-vault, 
            .onepassword-overlay, 
            .bitwarden-overlay,
            .dashlane-overlay,
            ._1PasswordPopover,
            ._1PasswordButton { 
                display: none !important; 
                visibility: hidden !important;
            }
            
            /* Prevent extension injection styles */
            input[data-lpignore], 
            input[data-1p-ignore], 
            input[data-bwignore] {
                background-image: none !important;
                background-position: initial !important;
                background-size: initial !important;
                background-repeat: initial !important;
            }
        `
        
        if (!document.getElementById('extension-suppressor-styles')) {
            document.head.appendChild(style)
        }
    }

    preventFormInterference() {
        // Add mutation observer to prevent extension DOM modifications
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Remove extension-injected elements
                            const extensionSelectors = [
                                '[data-lastpass-root]',
                                '[data-1p-root]',
                                '[data-bw-root]',
                                '.lastpass-vault',
                                '.onepassword-overlay',
                                '.bitwarden-overlay'
                            ]
                            
                            extensionSelectors.forEach(selector => {
                                const elements = node.querySelectorAll ? 
                                    node.querySelectorAll(selector) : []
                                elements.forEach(el => el.remove())
                                
                                if (node.matches && node.matches(selector)) {
                                    node.remove()
                                }
                            })
                        }
                    })
                })
            })
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['data-lastpass-root', 'data-1p-root', 'data-bw-root']
            })
        }
    }

    isExtensionRelated(message, source, error) {
        if (!message && !source && !error) return false
        
        const messageStr = String(message || '').toLowerCase()
        const sourceStr = String(source || '').toLowerCase()
        const stackStr = String(error?.stack || '').toLowerCase()
        
        const patterns = [
            'content_script',
            'chrome-extension',
            'moz-extension',
            'safari-extension',
            'lastpass',
            '1password',
            'bitwarden',
            'dashlane',
            'keeper',
            'roboform',
            "cannot read properties of undefined (reading 'control')",
            'shouldoffercompletionlistforfield',
            'elementwasfocused',
            'focusineventhandler',
            'processInputEvent'
        ]
        
        return patterns.some(pattern => 
            messageStr.includes(pattern) || 
            sourceStr.includes(pattern) || 
            stackStr.includes(pattern)
        )
    }

    restore() {
        if (!this.initialized) return
        
        // Restore original methods
        if (this.originalMethods.consoleError) {
            console.error = this.originalMethods.consoleError
        }
        if (this.originalMethods.onError) {
            window.onerror = this.originalMethods.onError
        }
        if (this.originalMethods.onUnhandledRejection) {
            window.onunhandledrejection = this.originalMethods.onUnhandledRejection
        }
        if (this.originalMethods.addEventListener) {
            window.addEventListener = this.originalMethods.addEventListener
        }
        
        // Remove styles
        const styles = document.getElementById('extension-suppressor-styles')
        if (styles) styles.remove()
        
        this.initialized = false
        console.debug('ExtensionSuppressor: Protection removed')
    }

    getStats() {
        return {
            initialized: this.initialized,
            suppressedErrorCount: this.suppressedErrors.size,
            suppressedErrors: Array.from(this.suppressedErrors).slice(0, 5) // Last 5
        }
    }
}

// Create singleton instance
const extensionSuppressor = new ExtensionSuppressor()

export default extensionSuppressor
export { ExtensionSuppressor }