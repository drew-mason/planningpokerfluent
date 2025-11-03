import { gs } from '@servicenow/glide'

export function testTableAccess() {
    gs.info('=== TESTING PLANNING POKER TABLE ACCESS ===')
    
    try {
        // Test 1: Check if table exists
        var grTable = new GlideRecord('sys_db_object');
        grTable.addQuery('name', 'x_902080_ppoker_session');
        grTable.query();
        
        if (grTable.next()) {
            gs.info('✅ Table x_902080_ppoker_session exists');
            gs.info('Table label: ' + grTable.label);
            gs.info('Table sys_id: ' + grTable.sys_id);
        } else {
            gs.error('❌ Table x_902080_ppoker_session does not exist');
            return;
        }
        
        // Test 2: Try to query records
        gs.info('=== TESTING RECORD QUERY ===')
        var gr = new GlideRecord('x_902080_ppoker_session');
        gr.setLimit(5);
        gr.query();
        
        gs.info('Query executed, found ' + gr.getRowCount() + ' records');
        
        var count = 0;
        while (gr.next() && count < 3) {
            count++;
            gs.info('Record ' + count + ':');
            gs.info('  sys_id: ' + gr.sys_id);
            gs.info('  name: ' + gr.name);
            gs.info('  status: ' + gr.status);
            gs.info('  session_code: ' + gr.session_code);
        }
        
        // Test 3: Check ACLs
        gs.info('=== TESTING ACL ACCESS ===')
        var currentUser = gs.getUser();
        gs.info('Current user: ' + currentUser.getName());
        gs.info('Current user ID: ' + currentUser.getID());
        
        // Test read access
        if (gr.canRead()) {
            gs.info('✅ Current user can read records');
        } else {
            gs.error('❌ Current user cannot read records');
        }
        
        // Test if we can create a test record
        gs.info('=== TESTING RECORD CREATION ===')
        var testGr = new GlideRecord('x_902080_ppoker_session');
        testGr.name = 'TEST_SESSION_' + new Date().getTime();
        testGr.description = 'Test session for access verification';
        testGr.session_code = 'TEST' + Math.floor(Math.random() * 1000);
        testGr.status = 'pending';
        
        var testId = testGr.insert();
        if (testId) {
            gs.info('✅ Test record created successfully: ' + testId);
            
            // Clean up test record
            testGr = new GlideRecord('x_902080_ppoker_session');
            if (testGr.get(testId)) {
                testGr.deleteRecord();
                gs.info('✅ Test record cleaned up');
            }
        } else {
            gs.error('❌ Failed to create test record');
        }
        
    } catch (error) {
        gs.error('❌ Error during table access test: ' + error);
    }
    
    gs.info('=== TABLE ACCESS TEST COMPLETE ===')
}