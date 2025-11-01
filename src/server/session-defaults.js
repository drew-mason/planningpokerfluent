import { gs } from '@servicenow/glide'

export function setDefaultDealer() {
    // Set the dealer to the current user if not already set
    if (!current.dealer || current.dealer.nil()) {
        current.dealer = gs.getUserID()
    }
    
    // Ensure session_code is unique if not provided
    if (!current.session_code) {
        current.session_code = generateSessionCode()
    }
    
    // Set initial timestamps
    if (current.status.toString() === 'active' && !current.started_at) {
        current.started_at = new GlideDateTime()
    }
}

function generateSessionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}