import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['session_defaults_br'],
    name: 'Set Session Defaults',
    table: 'x_snc_msm_pp_session',
    when: 'before',
    action: ['insert', 'update'],
    script: `
        (function executeRule(current, previous) {
            // Set the dealer to the current user if not already set
            if (!current.dealer || current.dealer.nil()) {
                current.dealer = gs.getUserID();
            }
            
            // Generate session code if not provided
            if (!current.session_code) {
                current.session_code = generateSessionCode();
            }
            
            // Set initial timestamps based on status
            if (current.status.toString() === 'active' && !current.started_at) {
                current.started_at = new GlideDateTime();
            }
            
            if (current.status.toString() === 'completed' && !current.completed_at) {
                current.completed_at = new GlideDateTime();
            }
            
            // Initialize summary fields on insert
            if (current.isNewRecord()) {
                if (!current.total_stories) current.total_stories = 0;
                if (!current.completed_stories) current.completed_stories = 0;
                if (!current.consensus_rate) current.consensus_rate = 0;
                if (!current.timebox_minutes) current.timebox_minutes = 30;
            }
            
            function generateSessionCode() {
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var code = '';
                for (var i = 0; i < 6; i++) {
                    code += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return code;
            }
        })(current, previous);
    `,
    order: 100,
    active: true,
    description: 'Sets default values for planning sessions including dealer, session code, and summary fields'
})