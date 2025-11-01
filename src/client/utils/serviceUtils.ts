// ServiceNow API Utilities
import { ServiceNowAPIError } from '../types'

// Extend Window interface for ServiceNow globals
declare global {
    interface Window {
        g_ck: string
        g_user: {
            userName: string
            userID: string
            firstName: string
            lastName: string
        }
    }
}

export class ServiceUtils {
    private static instance: ServiceUtils
    private baseURL = '/api/now/table'

    private constructor() {}

    static getInstance(): ServiceUtils {
        if (!ServiceUtils.instance) {
            ServiceUtils.instance = new ServiceUtils()
        }
        return ServiceUtils.instance
    }

    // Get standard headers for ServiceNow API calls
    getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Add CSRF token if available
        if (window.g_ck) {
            headers['X-UserToken'] = window.g_ck
        }

        return headers
    }

    // Build query parameters for API calls
    buildQueryParams(params: Record<string, any>): URLSearchParams {
        const searchParams = new URLSearchParams()
        
        // Always use display values for better UX
        searchParams.set('sysparm_display_value', 'all')
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.set(key, String(value))
            }
        })

        return searchParams
    }

    // Handle API responses with proper error handling
    async handleResponse<T>(response: Response): Promise<T> {
        let responseData: any

        try {
            responseData = await response.json()
        } catch (error) {
            throw new ServiceNowAPIError(
                'Invalid JSON response from server',
                response.status,
                { originalError: error }
            )
        }

        if (!response.ok) {
            const errorMessage = responseData?.error?.message || 
                                responseData?.error?.detail || 
                                `HTTP ${response.status} - ${response.statusText}`
            
            throw new ServiceNowAPIError(
                errorMessage,
                response.status,
                responseData
            )
        }

        return responseData
    }

    // Generic GET request
    async get<T>(tableName: string, params: Record<string, any> = {}): Promise<T> {
        const queryParams = this.buildQueryParams(params)
        const url = `${this.baseURL}/${tableName}?${queryParams.toString()}`

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        })

        return this.handleResponse<T>(response)
    }

    // Generic GET request for single record
    async getById<T>(tableName: string, sysId: string, params: Record<string, any> = {}): Promise<T> {
        const queryParams = this.buildQueryParams(params)
        const url = `${this.baseURL}/${tableName}/${sysId}?${queryParams.toString()}`

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        })

        return this.handleResponse<T>(response)
    }

    // Generic POST request
    async create<T>(tableName: string, data: Record<string, any>): Promise<T> {
        const url = `${this.baseURL}/${tableName}`

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        })

        return this.handleResponse<T>(response)
    }

    // Generic PATCH request
    async update<T>(tableName: string, sysId: string, data: Record<string, any>): Promise<T> {
        const url = `${this.baseURL}/${tableName}/${sysId}`

        const response = await fetch(url, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        })

        return this.handleResponse<T>(response)
    }

    // Generic DELETE request
    async delete(tableName: string, sysId: string): Promise<void> {
        const url = `${this.baseURL}/${tableName}/${sysId}`

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders()
        })

        if (!response.ok) {
            await this.handleResponse(response) // This will throw the appropriate error
        }
    }

    // Get current user information
    getCurrentUser() {
        return {
            userName: window.g_user?.userName || '',
            userID: window.g_user?.userID || '',
            firstName: window.g_user?.firstName || '',
            lastName: window.g_user?.lastName || '',
            displayName: window.g_user?.firstName && window.g_user?.lastName 
                ? `${window.g_user.firstName} ${window.g_user.lastName}`
                : window.g_user?.userName || 'Unknown User'
        }
    }

    // Generate unique session code
    generateSessionCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    // Validate session code format
    validateSessionCode(code: string): boolean {
        return /^[A-Z0-9]{6}$/.test(code)
    }

    // Sanitize user input
    sanitizeInput(input: string): string {
        return input?.trim?.()?.replace(/[<>\"'&]/g, '') || ''
    }

    // Build encoded query string for ServiceNow
    buildEncodedQuery(conditions: Record<string, any>): string {
        return Object.entries(conditions)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([field, value]) => {
                if (Array.isArray(value)) {
                    return `${field}IN${value.join(',')}`
                }
                return `${field}=${value}`
            })
            .join('^')
    }

    // Debounce function for reducing API calls
    debounce<T extends (...args: any[]) => any>(
        func: T, 
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout

        return (...args: Parameters<T>) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    // Retry mechanism for API calls
    async withRetry<T>(
        operation: () => Promise<T>, 
        maxRetries: number = 3, 
        delay: number = 1000
    ): Promise<T> {
        let lastError: Error

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation()
            } catch (error) {
                lastError = error as Error
                
                if (attempt === maxRetries) {
                    throw lastError
                }

                // Exponential backoff
                const waitTime = delay * Math.pow(2, attempt - 1)
                await new Promise(resolve => setTimeout(resolve, waitTime))
            }
        }

        throw lastError!
    }
}

// Singleton instance
export const serviceUtils = ServiceUtils.getInstance()

// Utility functions for common operations
export const formatApiError = (error: any): string => {
    if (error instanceof ServiceNowAPIError) {
        return error.message
    }
    
    if (error?.message) {
        return error.message
    }
    
    return 'An unexpected error occurred'
}

export const isNetworkError = (error: any): boolean => {
    return error instanceof TypeError && error.message?.includes('fetch')
}

export const handleAsyncOperation = async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void,
    onFinally?: () => void
): Promise<T | null> => {
    try {
        const result = await operation()
        onSuccess?.(result)
        return result
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onError?.(err)
        return null
    } finally {
        onFinally?.()
    }
}