/**
 * Browser Extension Compatibility Fix
 * Prevents browser extensions from interfering with React form fields
 * This module provides utilities to handle browser extension conflicts
 */

// Utility to detect extension-related errors
export const isExtensionError = (error) => {
    if (!error || !error.message) return false
    
    const errorMessage = error.message.toLowerCase()
    return (
        errorMessage.includes("cannot read properties of undefined (reading 'control')") ||
        errorMessage.includes('content_script') ||
        errorMessage.includes('shouldoffercompletionlistforfield') ||
        errorMessage.includes('elementwasfocused') ||
        errorMessage.includes('focusineventhandler')
    )
}

// Enhanced form field attributes for extension protection
export const getExtensionProtectionAttributes = () => ({
    autoComplete: "off",
    autoCapitalize: "off",
    autoCorrect: "off",
    spellCheck: false,
    "data-no-autofill": "true",
    "data-form-type": "other",
    "data-extension-protected": "true",
    "data-lpignore": "true", // LastPass
    "data-1p-ignore": "true", // 1Password
    "data-bwignore": "true",  // Bitwarden
})

// Utility to enhance existing form field props
export const addExtensionProtection = (props) => ({
    ...props,
    ...getExtensionProtectionAttributes()
})

// Error message formatter for extension errors
export const formatExtensionError = (error) => {
    if (isExtensionError(error)) {
        return "Browser extension interference detected. This doesn't affect the application functionality."
    }
    return error.message || 'An error occurred'
}

// Console error suppression for extension-related errors
export const suppressExtensionErrors = () => {
    const originalConsoleError = console.error
    console.error = (...args) => {
        const message = args.join(' ')
        if (isExtensionError({ message })) {
            console.debug('Suppressed extension error:', message)
            return
        }
        originalConsoleError.apply(console, args)
    }
}