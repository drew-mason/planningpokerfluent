/**
 * ServiceNow Native Data Service using GlideRecord
 * 
 * This uses internal ServiceNow APIs instead of REST APIs to bypass ACL issues.
 * Should work with standard table permissions instead of REST-specific ACLs.
 */

declare global {
    interface Window {
        // ServiceNow native APIs
        GlideRecord: any;
        GlideFilter: any;
        gs: any;
        g_user: {
            userName: string;
            userID: string;
            firstName: string;
            lastName: string;
        };
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
     * Query records using GlideRecord (native ServiceNow API)
     */
    async query(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                console.log(`ServiceNowNativeService.query: Querying ${tableName} with native GlideRecord`);
                
                // Check if GlideRecord is available
                if (typeof window.GlideRecord === 'undefined') {
                    console.error('GlideRecord not available - falling back to REST API might be needed');
                    reject(new Error('GlideRecord not available in this context'));
                    return;
                }

                const gr = new window.GlideRecord(tableName);
                
                // Apply filters
                if (options.filters) {
                    Object.entries(options.filters).forEach(([field, value]) => {
                        gr.addQuery(field, value);
                    });
                }

                // Apply ordering
                if (options.orderBy) {
                    if (options.orderBy.startsWith('ORDERBY')) {
                        // Handle ServiceNow-style ordering
                        const orderField = options.orderBy.replace(/^ORDERBY(DESC)?/, '');
                        const isDesc = options.orderBy.includes('DESC');
                        if (isDesc) {
                            gr.orderByDesc(orderField);
                        } else {
                            gr.orderBy(orderField);
                        }
                    } else {
                        gr.orderBy(options.orderBy);
                    }
                }

                // Apply limit
                if (options.limit) {
                    gr.setLimit(options.limit);
                }

                console.log(`ServiceNowNativeService.query: Executing query on ${tableName}`);
                
                gr.query((result: any) => {
                    const records: any[] = [];
                    
                    while (result.next()) {
                        const record: any = {};
                        
                        // Get all fields or specified fields
                        const fieldsToGet = options.fields || [
                            'sys_id', 'name', 'description', 'status', 'session_code',
                            'dealer', 'total_stories', 'completed_stories', 'consensus_rate',
                            'started_at', 'completed_at', 'timebox_minutes', 'sys_created_on', 'sys_updated_on'
                        ];
                        
                        fieldsToGet.forEach(field => {
                            try {
                                record[field] = result.getValue(field) || result.getDisplayValue(field);
                            } catch (e) {
                                // Field might not exist, skip it
                            }
                        });
                        
                        records.push(record);
                    }
                    
                    console.log(`ServiceNowNativeService.query: Retrieved ${records.length} records`);
                    resolve(records);
                });
                
            } catch (error) {
                console.error('ServiceNowNativeService.query: Error with native query:', error);
                reject(error);
            }
        });
    }

    /**
     * Get a single record by sys_id using GlideRecord
     */
    async getById(tableName: string, sysId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                console.log(`ServiceNowNativeService.getById: Fetching ${tableName} record ${sysId}`);
                
                if (typeof window.GlideRecord === 'undefined') {
                    reject(new Error('GlideRecord not available in this context'));
                    return;
                }

                const gr = new window.GlideRecord(tableName);
                gr.get(sysId, (result: any) => {
                    if (result.isValid()) {
                        const record: any = {};
                        
                        // Get all available fields
                        const fields = [
                            'sys_id', 'name', 'description', 'status', 'session_code',
                            'dealer', 'total_stories', 'completed_stories', 'consensus_rate',
                            'started_at', 'completed_at', 'timebox_minutes', 'sys_created_on', 'sys_updated_on'
                        ];
                        
                        fields.forEach(field => {
                            try {
                                record[field] = result.getValue(field) || result.getDisplayValue(field);
                            } catch (e) {
                                // Field might not exist
                            }
                        });
                        
                        console.log('ServiceNowNativeService.getById: Record found:', record);
                        resolve(record);
                    } else {
                        reject(new Error(`Record not found: ${sysId}`));
                    }
                });
                
            } catch (error) {
                console.error('ServiceNowNativeService.getById: Error:', error);
                reject(error);
            }
        });
    }

    /**
     * Create a record using GlideRecord
     */
    async create(tableName: string, data: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                console.log(`ServiceNowNativeService.create: Creating ${tableName} record:`, data);
                
                if (typeof window.GlideRecord === 'undefined') {
                    reject(new Error('GlideRecord not available in this context'));
                    return;
                }

                const gr = new window.GlideRecord(tableName);
                gr.initialize();
                
                // Set field values
                Object.entries(data).forEach(([field, value]) => {
                    gr.setValue(field, value);
                });

                gr.insert((result: any) => {
                    if (result) {
                        console.log('ServiceNowNativeService.create: Record created with sys_id:', result);
                        resolve({ result: { sys_id: result } });
                    } else {
                        reject(new Error('Failed to create record'));
                    }
                });
                
            } catch (error) {
                console.error('ServiceNowNativeService.create: Error:', error);
                reject(error);
            }
        });
    }

    /**
     * Check if native ServiceNow APIs are available
     */
    isNativeAPIAvailable(): boolean {
        return typeof window !== 'undefined' && 
               typeof window.GlideRecord !== 'undefined';
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