import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['update_session_summary_br'],
    name: 'Update Session Summary',
    table: 'x_snc_msm_pp_session_stories',
    when: 'after',
    action: ['insert', 'update', 'delete'],
    script: `
        (function executeRule(current, previous) {
            var sessionId = current.session.toString();
            
            // Don't process if session is not set
            if (!sessionId) {
                return;
            }
            
            gs.info('UpdateSessionSummary: Recalculating summary for session ' + sessionId);
            
            try {
                // Use GlideAggregate to count stories by status
                var storyStats = {
                    total: 0,
                    pending: 0,
                    voting: 0,
                    revealed: 0,
                    completed: 0,
                    skipped: 0,
                    consensus: 0
                };
                
                var gr = new GlideRecord('x_snc_msm_pp_session_stories');
                gr.addQuery('session', sessionId);
                gr.query();
                
                while (gr.next()) {
                    storyStats.total++;
                    var status = gr.getValue('status');
                    
                    if (status === 'pending') storyStats.pending++;
                    else if (status === 'voting') storyStats.voting++;
                    else if (status === 'revealed') storyStats.revealed++;
                    else if (status === 'completed') storyStats.completed++;
                    else if (status === 'skipped') storyStats.skipped++;
                    
                    if (gr.getValue('consensus_achieved') === 'true') {
                        storyStats.consensus++;
                    }
                }
                
                // Calculate consensus rate
                var consensusRate = storyStats.total > 0 
                    ? Math.round((storyStats.consensus / storyStats.total) * 100) 
                    : 0;
                
                // Update session record
                var session = new GlideRecord('x_snc_msm_pp_session');
                if (session.get(sessionId)) {
                    session.setValue('total_stories', storyStats.total);
                    session.setValue('completed_stories', storyStats.completed);
                    session.setValue('consensus_rate', consensusRate);
                    
                    // Auto-complete session if all stories are done
                    if (storyStats.total > 0 && 
                        (storyStats.completed + storyStats.skipped) === storyStats.total &&
                        session.getValue('status') === 'active') {
                        session.setValue('status', 'completed');
                        session.setValue('completed_at', new GlideDateTime());
                        gs.info('UpdateSessionSummary: Auto-completing session ' + sessionId);
                    }
                    
                    session.update();
                    gs.info('UpdateSessionSummary: Updated session summary - Total: ' + storyStats.total + 
                           ', Completed: ' + storyStats.completed + 
                           ', Consensus: ' + consensusRate + '%');
                }
            } catch (error) {
                gs.error('UpdateSessionSummary: Error updating session summary - ' + error);
            }
        })(current, previous);
    `,
    order: 200,
    active: true,
    description: 'Updates session summary fields (total stories, completed stories, consensus rate) when stories change'
})
