import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['update_vote_count_br'],
    name: 'Update Vote Count',
    table: 'x_902080_ppoker_vote',
    when: 'after',
    action: ['insert', 'update', 'delete'],
    script: `
        (function executeRule(current, previous) {
            var storyId = current.story.toString();
            
            // Don't process if story is not set
            if (!storyId) {
                return;
            }
            
            gs.info('UpdateVoteCount: Recalculating vote count for story ' + storyId);
            
            try {
                // Count current votes for this story
                var voteCount = 0;
                var gr = new GlideAggregate('x_902080_ppoker_vote');
                gr.addQuery('story', storyId);
                gr.addQuery('is_current', true);
                gr.addAggregate('COUNT');
                gr.query();
                
                if (gr.next()) {
                    voteCount = parseInt(gr.getAggregate('COUNT'));
                }
                
                // Get total participants in the session
                var story = new GlideRecord('x_902080_ppoker_session_stories');
                if (story.get(storyId)) {
                    var sessionId = story.getValue('session');
                    
                    // Count active participants (not left)
                    var participantCount = 0;
                    var participantGr = new GlideAggregate('x_902080_ppoker_session_participant');
                    participantGr.addQuery('session', sessionId);
                    participantGr.addNullQuery('left_at');
                    participantGr.addAggregate('COUNT');
                    participantGr.query();
                    
                    if (participantGr.next()) {
                        participantCount = parseInt(participantGr.getAggregate('COUNT'));
                    }
                    
                    // Build vote summary
                    var voteSummary = voteCount + ' of ' + participantCount + ' participants voted';
                    
                    // Update story record (use setWorkflow to prevent recursion)
                    story.setWorkflow(false);
                    
                    // Only update vote_summary, don't modify other fields
                    story.setValue('vote_summary', voteSummary);
                    
                    // Auto-reveal if everyone has voted and status is voting
                    if (participantCount > 0 && 
                        voteCount >= participantCount && 
                        story.getValue('status') === 'voting') {
                        story.setValue('status', 'revealed');
                        gs.info('UpdateVoteCount: Auto-revealing story ' + storyId + ' - all participants voted');
                    }
                    
                    story.update();
                    
                    gs.info('UpdateVoteCount: Updated story vote count - ' + voteSummary);
                }
            } catch (error) {
                gs.error('UpdateVoteCount: Error updating vote count - ' + error);
            }
        })(current, previous);
    `,
    order: 200,
    active: true,
    description: 'Updates vote count and summary on stories when votes are cast, updated, or removed'
})
