// Simple aggressive extension error suppressor
// This must run as early as possible

(function() {
    'use strict';
    
    if (typeof window === 'undefined') return;
    
    // Override console.error to suppress extension-related errors
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = String(args[0] || '').toLowerCase();
        
        // Extension error patterns to suppress
        const suppressPatterns = [
            'content_script',
            'cannot read properties of undefined (reading \'control\')',
            'shouldoffercompletionlistforfield',
            'elementwasfocused',
            'focusineventhandler',
            'processInputEvent',
            'chrome-extension',
            'moz-extension',
            'lastpass',
            '1password',
            'bitwarden'
        ];
        
        const shouldSuppress = suppressPatterns.some(pattern => message.includes(pattern));
        
        if (!shouldSuppress) {
            originalConsoleError.apply(console, args);
        }
    };
    
    // Override window.onerror to suppress extension errors
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        const msgStr = String(message || '').toLowerCase();
        const srcStr = String(source || '').toLowerCase();
        
        const isExtensionError = msgStr.includes('content_script') ||
                                msgStr.includes('cannot read properties of undefined') ||
                                srcStr.includes('content_script') ||
                                srcStr.includes('chrome-extension') ||
                                srcStr.includes('moz-extension');
        
        if (isExtensionError) {
            return true; // Suppress the error
        }
        
        return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
    };
    
    // Override unhandled promise rejection handler
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = function(event) {
        const reason = event.reason;
        const message = String(reason?.message || reason || '').toLowerCase();
        
        const isExtensionError = message.includes('content_script') ||
                                message.includes('cannot read properties of undefined') ||
                                message.includes('chrome-extension') ||
                                message.includes('moz-extension');
        
        if (isExtensionError) {
            event.preventDefault();
            return true;
        }
        
        return originalUnhandledRejection ? originalUnhandledRejection(event) : false;
    };
    
    console.log('Extension error suppressor activated');
})();