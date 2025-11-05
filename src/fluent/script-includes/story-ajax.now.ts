import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['planning_poker_story_ajax'],
    name: 'PlanningPokerStoryAjax',
    description: 'AJAX processor for planning poker story management',
    script: `
var PlanningPokerStoryAjax = Class.create();
PlanningPokerStoryAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    // Get all stories for a session
    getSessionStories: function() {
        var sessionId = this.getParameter('sysparm_session_id');

        gs.info('PlanningPokerStoryAjax.getSessionStories: Fetching stories for session ' + sessionId);

        try {
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            gr.addQuery('session', sessionId);
            gr.orderBy('sequence_order');
            gr.query();

            var stories = [];
            while (gr.next()) {
                stories.push(this._serializeStory(gr));
            }

            gs.info('PlanningPokerStoryAjax.getSessionStories: Found ' + stories.length + ' stories');
            return JSON.stringify(stories);

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.getSessionStories: Exception - ' + error);
            return JSON.stringify([]);
        }
    },

    // Get a single story by sys_id
    getStory: function() {
        var storyId = this.getParameter('sysparm_story_id');

        gs.info('PlanningPokerStoryAjax.getStory: Fetching story ' + storyId);

        try {
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            if (gr.get(storyId)) {
                return JSON.stringify(this._serializeStory(gr));
            } else {
                gs.warn('PlanningPokerStoryAjax.getStory: Story not found - ' + storyId);
                return 'null';
            }
        } catch (error) {
            gs.error('PlanningPokerStoryAjax.getStory: Exception - ' + error);
            return 'null';
        }
    },

    // Create a new story
    addStory: function() {
        var sessionId = this.getParameter('sysparm_session_id');
        var storyData = JSON.parse(this.getParameter('sysparm_story_data'));

        gs.info('PlanningPokerStoryAjax.addStory: Creating new story for session ' + sessionId);

        try {
            // Get next sequence order if not provided
            var sequenceOrder = storyData.sequence_order;
            if (!sequenceOrder) {
                sequenceOrder = this._getNextSequenceOrder(sessionId);
            }

            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            gr.initialize();
            gr.setValue('session', sessionId);
            gr.setValue('story_title', storyData.story_title);
            gr.setValue('description', storyData.description || '');
            gr.setValue('sequence_order', sequenceOrder);
            gr.setValue('status', 'pending');
            gr.setValue('consensus_achieved', false);

            var storyId = gr.insert();

            if (storyId) {
                gs.info('PlanningPokerStoryAjax.addStory: Story created with sys_id ' + storyId);
                
                // Get and return the created story
                gr.get(storyId);
                return JSON.stringify({ 
                    success: true, 
                    story: this._serializeStory(gr)
                });
            } else {
                gs.error('PlanningPokerStoryAjax.addStory: Failed to create story');
                return JSON.stringify({ success: false, error: 'Failed to create story' });
            }

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.addStory: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Update an existing story
    updateStory: function() {
        var storyId = this.getParameter('sysparm_story_id');
        var updates = JSON.parse(this.getParameter('sysparm_updates'));

        gs.info('PlanningPokerStoryAjax.updateStory: Updating story ' + storyId);

        try {
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            if (!gr.get(storyId)) {
                gs.warn('PlanningPokerStoryAjax.updateStory: Story not found - ' + storyId);
                return JSON.stringify({ success: false, error: 'Story not found' });
            }

            // Update allowed fields
            if (updates.story_title !== undefined) {
                gr.setValue('story_title', updates.story_title);
            }
            if (updates.description !== undefined) {
                gr.setValue('description', updates.description);
            }
            if (updates.sequence_order !== undefined) {
                gr.setValue('sequence_order', updates.sequence_order);
            }
            if (updates.status !== undefined) {
                gr.setValue('status', updates.status);
                
                // Set timestamps based on status
                if (updates.status === 'voting' && !gr.getValue('voting_started')) {
                    gr.setValue('voting_started', new GlideDateTime());
                } else if (updates.status === 'completed') {
                    gr.setValue('completed_on', new GlideDateTime());
                }
            }
            if (updates.final_estimate !== undefined) {
                gr.setValue('final_estimate', updates.final_estimate);
            }
            if (updates.vote_summary !== undefined) {
                gr.setValue('vote_summary', updates.vote_summary);
            }
            if (updates.consensus_achieved !== undefined) {
                gr.setValue('consensus_achieved', updates.consensus_achieved);
            }

            gr.update();
            gs.info('PlanningPokerStoryAjax.updateStory: Story updated successfully');

            return JSON.stringify({ 
                success: true, 
                story: this._serializeStory(gr)
            });

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.updateStory: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Delete a story
    deleteStory: function() {
        var storyId = this.getParameter('sysparm_story_id');

        gs.info('PlanningPokerStoryAjax.deleteStory: Deleting story ' + storyId);

        try {
            // First delete all votes for this story
            var voteGr = new GlideRecord('x_snc_msm_pp_vote');
            voteGr.addQuery('story', storyId);
            voteGr.deleteMultiple();

            // Then delete the story
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            if (gr.get(storyId)) {
                gr.deleteRecord();
                gs.info('PlanningPokerStoryAjax.deleteStory: Story deleted successfully');
                return JSON.stringify({ success: true });
            } else {
                gs.warn('PlanningPokerStoryAjax.deleteStory: Story not found - ' + storyId);
                return JSON.stringify({ success: false, error: 'Story not found' });
            }

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.deleteStory: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Reorder stories in a session
    reorderStories: function() {
        var storyOrders = JSON.parse(this.getParameter('sysparm_story_orders'));

        gs.info('PlanningPokerStoryAjax.reorderStories: Reordering ' + storyOrders.length + ' stories');

        try {
            for (var i = 0; i < storyOrders.length; i++) {
                var item = storyOrders[i];
                var gr = new GlideRecord('x_snc_msm_pp_session_stories');
                if (gr.get(item.storyId)) {
                    gr.setValue('sequence_order', item.newOrder);
                    gr.update();
                }
            }

            gs.info('PlanningPokerStoryAjax.reorderStories: Stories reordered successfully');
            return JSON.stringify({ success: true });

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.reorderStories: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Start voting on a story
    startVoting: function() {
        var storyId = this.getParameter('sysparm_story_id');

        gs.info('PlanningPokerStoryAjax.startVoting: Starting voting for story ' + storyId);

        try {
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            if (!gr.get(storyId)) {
                return JSON.stringify({ success: false, error: 'Story not found' });
            }

            gr.setValue('status', 'voting');
            gr.setValue('voting_started', new GlideDateTime());
            gr.update();

            gs.info('PlanningPokerStoryAjax.startVoting: Voting started successfully');
            return JSON.stringify({ 
                success: true, 
                story: this._serializeStory(gr)
            });

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.startVoting: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Complete voting and set final estimate
    completeVoting: function() {
        var storyId = this.getParameter('sysparm_story_id');
        var finalEstimate = this.getParameter('sysparm_final_estimate');
        var voteSummary = this.getParameter('sysparm_vote_summary');

        gs.info('PlanningPokerStoryAjax.completeVoting: Completing voting for story ' + storyId);

        try {
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            if (!gr.get(storyId)) {
                return JSON.stringify({ success: false, error: 'Story not found' });
            }

            gr.setValue('status', 'completed');
            gr.setValue('final_estimate', finalEstimate);
            gr.setValue('vote_summary', voteSummary || '');
            gr.setValue('consensus_achieved', true);
            gr.setValue('completed_on', new GlideDateTime());
            gr.update();

            gs.info('PlanningPokerStoryAjax.completeVoting: Voting completed successfully');
            return JSON.stringify({ 
                success: true, 
                story: this._serializeStory(gr)
            });

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.completeVoting: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Reset a story (clear votes and status)
    resetStory: function() {
        var storyId = this.getParameter('sysparm_story_id');

        gs.info('PlanningPokerStoryAjax.resetStory: Resetting story ' + storyId);

        try {
            // Clear all votes
            var voteGr = new GlideRecord('x_snc_msm_pp_vote');
            voteGr.addQuery('story', storyId);
            voteGr.deleteMultiple();

            // Reset story
            var gr = new GlideRecord('x_snc_msm_pp_session_stories');
            if (!gr.get(storyId)) {
                return JSON.stringify({ success: false, error: 'Story not found' });
            }

            gr.setValue('status', 'pending');
            gr.setValue('final_estimate', '');
            gr.setValue('vote_summary', '');
            gr.setValue('consensus_achieved', false);
            gr.setValue('voting_started', '');
            gr.setValue('completed_on', '');
            gr.update();

            gs.info('PlanningPokerStoryAjax.resetStory: Story reset successfully');
            return JSON.stringify({ 
                success: true, 
                story: this._serializeStory(gr)
            });

        } catch (error) {
            gs.error('PlanningPokerStoryAjax.resetStory: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Helper: Serialize story record to JSON
    _serializeStory: function(gr) {
        return {
            sys_id: gr.getValue('sys_id'),
            session: gr.getValue('session'),
            story_title: gr.getValue('story_title'),
            description: gr.getValue('description'),
            sequence_order: gr.getValue('sequence_order'),
            status: gr.getValue('status'),
            final_estimate: gr.getValue('final_estimate'),
            vote_summary: gr.getValue('vote_summary'),
            consensus_achieved: gr.getValue('consensus_achieved'),
            voting_started: gr.getValue('voting_started'),
            completed_on: gr.getValue('completed_on'),
            sys_created_on: gr.getValue('sys_created_on'),
            sys_updated_on: gr.getValue('sys_updated_on')
        };
    },

    // Helper: Get next sequence order for a session
    _getNextSequenceOrder: function(sessionId) {
        var gr = new GlideAggregate('x_snc_msm_pp_session_stories');
        gr.addQuery('session', sessionId);
        gr.addAggregate('MAX', 'sequence_order');
        gr.query();

        if (gr.next()) {
            var maxOrder = gr.getAggregate('MAX', 'sequence_order');
            return parseInt(maxOrder || '0') + 1;
        }

        return 1;
    },

    type: 'PlanningPokerStoryAjax'
});
`
})
