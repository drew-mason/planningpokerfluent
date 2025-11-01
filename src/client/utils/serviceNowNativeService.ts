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
     * This uses the same patterns that ServiceNow's own UI uses for data operations
     */
    async query(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                console.log(`ServiceNowNativeService.query: Using ServiceNow native client API for ${tableName}`);
                
                // Use ServiceNow's native client-side Ajax patterns
                if (typeof window.GlideAjax !== 'undefined') {
                    console.log('ServiceNowNativeService.query: Using GlideAjax for native data access');
                    
                    // Create a direct table query using ServiceNow's client APIs
                    // This mimics how ServiceNow's own list views work
                    const ajax = new window.GlideAjax('TableAPIProcessor');
                    ajax.addParam('sysparm_name', 'getRecords');
                    ajax.addParam('table', tableName);
                    
                    // Build query parameters
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
                    
                    if (options.orderBy) {
                        if (options.orderBy.startsWith('ORDERBY')) {
                            queryString = queryString ? `${queryString}^${options.orderBy}` : options.orderBy;
                        } else {
                            queryString = queryString ? `${queryString}^ORDERBY${options.orderBy}` : `ORDERBY${options.orderBy}`;
                        }
                    }
                    
                    if (queryString) {
                        ajax.addParam('sysparm_query', queryString);
                    }
                    
                    if (options.limit) {
                        ajax.addParam('sysparm_limit', options.limit.toString());
                    }
                    
                    if (options.fields && options.fields.length > 0) {
                        ajax.addParam('sysparm_fields', options.fields.join(','));
                    }
                    
                    ajax.getXML((response: any) => {
                        try {
                            const result = response.responseXML;
                            const records: any[] = [];
                            
                            // Parse the XML response (ServiceNow's native format)
                            const items = result.getElementsByTagName('item');
                            for (let i = 0; i < items.length; i++) {
                                const item = items[i];
                                const record: any = {};
                                
                                // Extract field values from XML
                                const children = item.childNodes;
                                for (let j = 0; j < children.length; j++) {
                                    const child = children[j];
                                    if (child.nodeName && child.textContent) {
                                        record[child.nodeName] = child.textContent;
                                    }
                                }
                                
                                records.push(record);
                            }
                            
                            console.log(`ServiceNowNativeService.query: Native API retrieved ${records.length} records`);
                            resolve(records);
                        } catch (parseError) {
                            console.error('ServiceNowNativeService.query: Error parsing native response:', parseError);
                            reject(parseError);
                        }
                    });
                    
                    return;
                }
                
                // Fallback to standard REST API if native APIs not available
                console.log('ServiceNowNativeService.query: GlideAjax not available, using REST API fallback');
                this.queryWithRESTAPI(tableName, options).then(resolve).catch(reject);
                
            } catch (error) {
                console.error('ServiceNowNativeService.query: Error with native query:', error);
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
            
            const url = `/api/now/table/${tableName}?${params.toString()}`;
            console.log(`ServiceNowNativeService.queryWithRESTAPI: Request URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`ServiceNowNativeService.queryWithRESTAPI: Retrieved ${data.result?.length || 0} records`);
            
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
    async getById(tableName: string, sysId: string): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.getById: Fetching ${tableName} record ${sysId}`);
            
            const params = new URLSearchParams();
            params.set('sysparm_display_value', 'all');
            params.set('sysparm_exclude_reference_link', 'true');
            
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
            console.log('ServiceNowNativeService.getById: Record found:', data.result);
            
            return data.result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.getById: Error:', error);
            throw error;
        }
    }

    /**
     * Create a record
     */
    async create(tableName: string, data: Record<string, any>): Promise<any> {
        try {
            console.log(`ServiceNowNativeService.create: Creating ${tableName} record:`, data);
            
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
            console.log('ServiceNowNativeService.create: Record created:', result.result);
            
            return result;
            
        } catch (error) {
            console.error('ServiceNowNativeService.create: Error:', error);
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