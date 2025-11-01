/**
 * Planning Poker Utility Functions
 * Pure utility functions that don't depend on REST APIs
 */

export class PlanningPokerUtils {
    // Generate unique session code
    static generateSessionCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    // Validate session code format
    static validateSessionCode(code: string): boolean {
        return /^[A-Z0-9]{6}$/.test(code)
    }

    // Sanitize user input
    static sanitizeInput(input: string): string {
        return input?.trim?.()?.replace(/[<>\"'&]/g, '') || ''
    }
}