/**
 * ServiceNow Native Client API Service
 * 
 * Uses ServiceNow's actual client-side native APIs that are available in the browser.
 * These are different from server-side GlideRecord but are still "native" ServiceNow APIs.
 */

declare global {
    interface Window {
        // ServiceNow client-side native APIs
        g_user: {
            userName: string;
            userID: string;
            firstName: string;
            lastName: string;
        };
        g_ck: string; // CSRF token
        // ServiceNow client utilities
        GlideAjax: any;
        g_form: any;
        NOW: any;
        // ServiceNow client-side data APIs
        GlideLRUCache: any;
        GlideClientScriptLoader: any;
    }
}

export class ServiceNowNativeService {
    private static instance: ServiceNowNativeService;

    private constructor() {}

    static getInstance(): ServiceNowNativeService {
        if (!ServiceNowNativeService.instance) {
            ServiceNowNativeService.instance = new ServiceNowNativeService();
        }
        return ServiceNowNativeService.instance;
    }

    /**
     * Use ServiceNow's native client-side data access patterns
     * This uses GlideAjax to call server-side Script Includes
     */
    async query(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        try {
            console.log(`ServiceNowNativeService.query: Using GlideAjax for ${tableName}`);
            
            // For planning poker sessions, use the Script Include
            if (tableName === 'x_1860782_msm_pl_0_session') {
                return await this.querySessionsViaAjax(options);
            }
            
            // For other tables, fall back to REST API
            return await this.queryWithRESTAPI(tableName, options);
            
        } catch (error) {
            console.error('ServiceNowNativeService.query: Error with query:', error);
            throw error;
        }
    }

    /**
     * Query planning poker sessions using GlideAjax
     */
    private async querySessionsViaAjax(options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                console.log('ServiceNowNativeService.querySessionsViaAjax: Calling PlanningPokerSessionAjax.getSessions');
                
                const ajax = new window.GlideAjax('PlanningPokerSessionAjax');
                ajax.addParam('sysparm_name', 'getSessions');
                ajax.addParam('sysparm_options', JSON.stringify(options));
                
                ajax.getXML((response: any) => {
                    try {
                        const answer = response.responseXML.documentElement.getAttribute('answer');
                        const sessions = JSON.parse(answer);
                        console.log(`ServiceNowNativeService.querySessionsViaAjax: Retrieved ${sessions.length} sessions`);
                        resolve(sessions);
                    } catch (parseError) {
                        console.error('ServiceNowNativeService.querySessionsViaAjax: Failed to parse response:', parseError);
                        reject(parseError);
                    }
                });
                
            } catch (error) {
                console.error('ServiceNowNativeService.querySessionsViaAjax: Error:', error);
                reject(error);
            }
        });
    }

    /**
     * Fallback REST API method (kept as backup)
     */
    private async queryWithRESTAPI(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        try {
            console.log(`ServiceNowNativeService.queryWithRESTAPI: Using REST API for ${tableName}`);
            
            const params = new URLSearchParams();
            params.set('sysparm_display_value', 'all');
            params.set('sysparm_exclude_reference_link', 'true');
            
            if (options.limit) {
                params.set('sysparm_limit', options.limit.toString());
            }
            
            if (options.fields && options.fields.length > 0) {
                params.set('sysparm_fields', options.fields.join(','));
            }
            
            // Simplify query building - try without complex ordering first
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
            
            // Try simple ordering without ORDERBY prefix first
            if (options.orderBy && !options.filters) { // Only add ordering if no filters
                if (options.orderBy.startsWith('ORDERBY')) {
                    queryString = options.orderBy;
                } else {
                    queryString = `ORDERBY${options.orderBy}`;
                }
            }
            
            if (queryString) {
                params.set('sysparm_query', queryString);
                console.log(`ServiceNowNativeService.queryWithRESTAPI: Using query: ${queryString}`);
            } else {
                console.log('ServiceNowNativeService.queryWithRESTAPI: No query parameters, fetching all records');
            }
            
            const url = `/api/now/table/${tableName}?${params.toString()}`;
            console.log(`ServiceNowNativeService.queryWithRESTAPI: Request URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                console.error(`ServiceNowNativeService.queryWithRESTAPI: HTTP ${response.status}: ${response.statusText}`);
                
                try {
                    const errorData = await response.json();
                    console.error('ServiceNowNativeService.queryWithRESTAPI: Error response:', errorData);
                    
                    // Check if it's a table not found error - return empty array instead of throwing
                    if (response.status === 404 || response.status === 500) {
                        if (errorData.error && (
                            errorData.error.message.includes('Invalid table') ||
                            errorData.error.message.includes('Exception while executing request')
                        )) {
                            console.warn(`ServiceNowNativeService.queryWithRESTAPI: Table ${tableName} might not exist or has configuration issues - returning empty array`);
                            return [];
                        }
                    }
                } catch (jsonError) {
                    console.error('ServiceNowNativeService.queryWithRESTAPI: Could not parse error response');
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`ServiceNowNativeService.queryWithRESTAPI: Retrieved ${data.result?.length || 0} records`);
            
            if (data.result && data.result.length > 0) {
                console.log('ServiceNowNativeService.queryWithRESTAPI: Sample record:', data.result[0]);
            }
            
            return data.result || [];
            
        } catch (error) {
            console.error('ServiceNowNativeService.queryWithRESTAPI: Error:', error);
            throw error;
        }
    }

    /**
     * Get standard headers for ServiceNow API calls
     */
    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (typeof window !== 'undefined' && window.g_ck) {
            headers['X-UserToken'] = window.g_ck;
        }

        return headers;
    }

    /**
     * Get a single record by sys_id
     */
    async getById(tableName: string, sysId: string, fields?: string[]): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.getById: Fetching ${tableName} record ${sysId}`);
            
            // For planning poker sessions, use GlideAjax
            if (tableName === 'x_1860782_msm_pl_0_session') {
                return await this.getSessionByIdViaAjax(sysId);
            }
            
            // For other tables, use REST API
            return await this.getByIdWithRESTAPI(tableName, sysId, fields);
            
        } catch (error) {
            console.error('ServiceNowNativeService.getById: Error:', error);
            throw error;
        }
    }

    /**
     * Get session by ID using GlideAjax
     */
    private async getSessionByIdViaAjax(sysId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                console.log(`ServiceNowNativeService.getSessionByIdViaAjax: Fetching session ${sysId}`);
                
                const ajax = new window.GlideAjax('PlanningPokerSessionAjax');
                ajax.addParam('sysparm_name', 'getSession');
                ajax.addParam('sysparm_sys_id', sysId);
                
                ajax.getXML((response: any) => {
                    try {
                        const answer = response.responseXML.documentElement.getAttribute('answer');
                        const session = JSON.parse(answer);
                        console.log('ServiceNowNativeService.getSessionByIdViaAjax: Session found:', session);
                        resolve(session);
                    } catch (parseError) {
                        console.error('ServiceNowNativeService.getSessionByIdViaAjax: Failed to parse response:', parseError);
                        reject(parseError);
                    }
                });
                
            } catch (error) {
                console.error('ServiceNowNativeService.getSessionByIdViaAjax: Error:', error);
                reject(error);
            }
        });
    }

    /**
     * Fallback getById with REST API
     */
    private async getByIdWithRESTAPI(tableName: string, sysId: string, fields?: string[]): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.getByIdWithRESTAPI: Fetching ${tableName} record ${sysId}`);
            
            const params = new URLSearchParams();
            params.set('sysparm_display_value', 'all');
            params.set('sysparm_exclude_reference_link', 'true');
            
            if (fields && fields.length > 0) {
                params.set('sysparm_fields', fields.join(','));
                console.log(`ServiceNowNativeService.getByIdWithRESTAPI: Requesting fields: ${fields.join(',')}`);
            }
            
            const url = `/api/now/table/${tableName}/${sysId}?${params.toString()}`;
            
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
            console.log('ServiceNowNativeService.getByIdWithRESTAPI: Record found:', data.result);
            
            return data.result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.getByIdWithRESTAPI: Error:', error);
            throw error;
        }
    }

    /**
     * Create a record
     */
    async create(tableName: string, data: Record<string, any>): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.create: Creating ${tableName} record:`, data);
            
            // For planning poker sessions, use GlideAjax
            if (tableName === 'x_1860782_msm_pl_0_session') {
                return await this.createSessionViaAjax(data);
            }
            
            // For other tables, use REST API
            return await this.createWithRESTAPI(tableName, data);
            
        } catch (error) {
            console.error('ServiceNowNativeService.create: Error:', error);
            throw error;
        }
    }

    /**
     * Create session using GlideAjax
     */
    private async createSessionViaAjax(data: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                console.log('ServiceNowNativeService.createSessionViaAjax: Creating session:', data);
                
                const ajax = new window.GlideAjax('PlanningPokerSessionAjax');
                ajax.addParam('sysparm_name', 'createSession');
                ajax.addParam('sysparm_session_data', JSON.stringify(data));
                
                ajax.getXML((response: any) => {
                    try {
                        const answer = response.responseXML.documentElement.getAttribute('answer');
                        const session = JSON.parse(answer);
                        console.log('ServiceNowNativeService.createSessionViaAjax: Session created:', session);
                        resolve({ result: session });
                    } catch (parseError) {
                        console.error('ServiceNowNativeService.createSessionViaAjax: Failed to parse response:', parseError);
                        reject(parseError);
                    }
                });
                
            } catch (error) {
                console.error('ServiceNowNativeService.createSessionViaAjax: Error:', error);
                reject(error);
            }
        });
    }

    /**
     * Fallback create with REST API
     */
    private async createWithRESTAPI(tableName: string, data: Record<string, any>): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.createWithRESTAPI: Creating ${tableName} record:`, data);
            
            const url = `/api/now/table/${tableName}`;
            
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
            console.log('ServiceNowNativeService.createWithRESTAPI: Record created:', result.result);
            
            return result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.createWithRESTAPI: Error:', error);
            throw error;
        }
    }

    /**
     * Update a record
     */
    async update(tableName: string, sysId: string, data: Record<string, any>): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.update: Updating ${tableName} record ${sysId}:`, data);
            
            const url = `/api/now/table/${tableName}/${sysId}`;
            
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
     * Delete a record
     */
    async delete(tableName: string, sysId: string): Promise<void> {
        try {
            console.log(`ServiceNowNativeService.delete: Deleting ${tableName} record ${sysId}`);
            
            const url = `/api/now/table/${tableName}/${sysId}`;
            
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