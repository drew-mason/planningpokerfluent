// Ultra-aggressive extension suppressor that runs in the page context
// This must be injected as early as possible to catch extension errors

const EXTENSION_SUPPRESSOR = `
(function() {
    'use strict';
    
    // Store original methods immediately
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;
    
    // Extension error patterns
    const suppressPatterns = [
        'content_script',
        'cannot read properties of undefined',
        'control',
        'shouldoffercompletionlistforfield',
        'elementwasfocused',
        'focusineventhandler',
        'processinputevent',
        'uncaught typeerror',
        'chrome-extension',
        'moz-extension',
        'lastpass',
        '1password',
        'bitwarden',
        'dashlane'
    ];
    
    function shouldSuppress(message) {
        const msg = String(message || '').toLowerCase();
        return suppressPatterns.some(pattern => msg.includes(pattern));
    }
    
    // Override console methods
    console.error = function(...args) {
        if (!shouldSuppress(args[0])) {
            originalConsoleError.apply(console, args);
        }
    };
    
    console.warn = function(...args) {
        if (!shouldSuppress(args[0])) {
            originalConsoleWarn.apply(console, args);
        }
    };
    
    // Override window error handlers
    window.onerror = function(message, source, lineno, colno, error) {
        const msgStr = String(message || '').toLowerCase();
        const srcStr = String(source || '').toLowerCase();
        
        if (shouldSuppress(msgStr) || shouldSuppress(srcStr)) {
            return true; // Suppress
        }
        return false;
    };
    
    window.onunhandledrejection = function(event) {
        const reason = String(event.reason || '').toLowerCase();
        if (shouldSuppress(reason)) {
            event.preventDefault();
            return true;
        }
        return false;
    };
    
    // Intercept addEventListener calls to prevent extension error listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'error' || type === 'unhandledrejection') {
            const wrappedListener = function(event) {
                const error = event.error || event.reason || event.message;
                if (shouldSuppress(error)) {
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                if (typeof listener === 'function') {
                    listener.call(this, event);
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Monitor for extension DOM injections and remove them
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Remove extension-specific elements
                        const extensionSelectors = [
                            '[data-lastpass-root]',
                            '[data-1p-root]',
                            '[data-bw-root]',
                            '.lastpass-vault',
                            '.onepassword-overlay',
                            '.bitwarden-overlay'
                        ];
                        
                        extensionSelectors.forEach(function(selector) {
                            try {
                                if (node.matches && node.matches(selector)) {
                                    node.remove();
                                }
                                if (node.querySelectorAll) {
                                    const elements = node.querySelectorAll(selector);
                                    elements.forEach(function(el) { el.remove(); });
                                }
                            } catch (e) {
                                // Ignore selector errors
                            }
                        });
                    }
                });
            });
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
    }
    
    console.log('🛡️ Ultra-aggressive extension suppressor activated');
})();
`;

// Inject the suppressor immediately
if (typeof document !== 'undefined') {
    const script = document.createElement('script');
    script.textContent = EXTENSION_SUPPRESSOR;
    script.type = 'text/javascript';
    
    // Inject at the very beginning of head
    if (document.head) {
        document.head.insertBefore(script, document.head.firstChild);
    } else {
        // If head doesn't exist yet, wait for it
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeName === 'HEAD') {
                            node.insertBefore(script, node.firstChild);
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        observer.observe(document, { childList: true, subtree: true });
    }
}

export { EXTENSION_SUPPRESSOR };