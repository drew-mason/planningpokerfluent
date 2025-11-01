/**
 * ServiceNow Client-Side Data Service
 * 
 * Uses ServiceNow client-side APIs available in the browser context.
 * Falls back to REST API when native client APIs are not available.
 */

declare global {
    interface Window {
        // ServiceNow client-side APIs available in browser
        g_user: {
            userName: string;
            userID: string;
            firstName: string;
            lastName: string;
        };
        g_ck: string; // CSRF token
        NOW: any; // ServiceNow client API namespace
        GlideAjax: any; // Client-side Ajax API
    }
}

export class ServiceNowNativeService {
    private static instance: ServiceNowNativeService;
    private baseURL = '/api/now/table';

    private constructor() {}

    static getInstance(): ServiceNowNativeService {
        if (!ServiceNowNativeService.instance) {
            ServiceNowNativeService.instance = new ServiceNowNativeService();
        }
        return ServiceNowNativeService.instance;
    }

    /**
     * Get standard headers for ServiceNow API calls
     */
    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // Add CSRF token if available
        if (typeof window !== 'undefined' && window.g_ck) {
            headers['X-UserToken'] = window.g_ck;
        }

        return headers;
    }

    /**
     * Query records using ServiceNow REST API with proper authentication
     */
    async query(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        try {
            console.log(`ServiceNowNativeService.query: Querying ${tableName} with REST API`);
            
            const params = new URLSearchParams();
            params.set('sysparm_display_value', 'all');
            params.set('sysparm_exclude_reference_link', 'true');
            
            // Apply limit
            if (options.limit) {
                params.set('sysparm_limit', options.limit.toString());
            }
            
            // Apply fields
            if (options.fields && options.fields.length > 0) {
                params.set('sysparm_fields', options.fields.join(','));
            }
            
            // Build query string for filters and ordering
            let queryString = '';
            
            if (options.filters) {
                const filterParts = Object.entries(options.filters)
                    .filter(([_, value]) => value !== undefined && value !== null)
                    .map(([field, value]) => {
                        if (value === null) {
                            return `${field}ISEMPTY`;
                        }
                        if (Array.isArray(value)) {
                            return `${field}IN${value.join(',')}`;
                        }
                        return `${field}=${value}`;
                    });
                
                queryString = filterParts.join('^');
            }
            
            // Apply ordering
            if (options.orderBy) {
                if (options.orderBy.startsWith('ORDERBY')) {
                    queryString = queryString ? `${queryString}^${options.orderBy}` : options.orderBy;
                } else {
                    queryString = queryString ? `${queryString}^ORDERBY${options.orderBy}` : `ORDERBY${options.orderBy}`;
                }
            }
            
            if (queryString) {
                params.set('sysparm_query', queryString);
            }
            
            const url = `${this.baseURL}/${tableName}?${params.toString()}`;
            console.log(`ServiceNowNativeService.query: Request URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`ServiceNowNativeService.query: Retrieved ${data.result?.length || 0} records`);
            
            return data.result || [];
            
        } catch (error) {
            console.error('ServiceNowNativeService.query: Error with REST API query:', error);
            throw error;
        }
    }

    /**
     * Get a single record by sys_id using REST API
     */
    async getById(tableName: string, sysId: string): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.getById: Fetching ${tableName} record ${sysId}`);
            
            const params = new URLSearchParams();
            params.set('sysparm_display_value', 'all');
            params.set('sysparm_exclude_reference_link', 'true');
            
            const url = `${this.baseURL}/${tableName}/${sysId}?${params.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Record not found: ${sysId}`);
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('ServiceNowNativeService.getById: Record found:', data.result);
            
            return data.result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.getById: Error:', error);
            throw error;
        }
    }

    /**
     * Create a record using REST API
     */
    async create(tableName: string, data: Record<string, any>): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.create: Creating ${tableName} record:`, data);
            
            const url = `${this.baseURL}/${tableName}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('ServiceNowNativeService.create: Record created:', result.result);
            
            return result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.create: Error:', error);
            throw error;
        }
    }

    /**
     * Update a record using REST API
     */
    async update(tableName: string, sysId: string, data: Record<string, any>): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.update: Updating ${tableName} record ${sysId}:`, data);
            
            const url = `${this.baseURL}/${tableName}/${sysId}`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('ServiceNowNativeService.update: Record updated successfully');
            
            return result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.update: Error:', error);
            throw error;
        }
    }

    /**
     * Delete a record using REST API
     */
    async delete(tableName: string, sysId: string): Promise<void> {
        try {
            console.log(`ServiceNowNativeService.delete: Deleting ${tableName} record ${sysId}`);
            
            const url = `${this.baseURL}/${tableName}/${sysId}`;
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log('ServiceNowNativeService.delete: Record deleted successfully');
            
        } catch (error) {
            console.error('ServiceNowNativeService.delete: Error:', error);
            throw error;
        }
    }

    /**
     * Check if we're running in ServiceNow context
     */
    isNativeAPIAvailable(): boolean {
        return typeof window !== 'undefined' && 
               typeof window.g_user !== 'undefined' &&
               typeof window.g_ck !== 'undefined';
    }

    /**
     * Get current user information
     */
    getCurrentUser() {
        if (typeof window !== 'undefined' && window.g_user) {
            return {
                userName: window.g_user.userName || '',
                userID: window.g_user.userID || '',
                firstName: window.g_user.firstName || '',
                lastName: window.g_user.lastName || '',
                displayName: window.g_user.firstName && window.g_user.lastName 
                    ? `${window.g_user.firstName} ${window.g_user.lastName}`
                    : window.g_user.userName || 'Unknown User'
            };
        }
        return {
            userName: '',
            userID: '',
            firstName: '',
            lastName: '',
            displayName: 'Unknown User'
        };
    }
}

export const nativeService = ServiceNowNativeService.getInstance();