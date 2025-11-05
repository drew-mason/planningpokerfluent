import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['planning_poker_voting_ajax'],
    name: 'PlanningPokerVotingAjax',
    description: 'AJAX processor for planning poker voting operations',
    script: `
var PlanningPokerVotingAjax = Class.create();
PlanningPokerVotingAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    // Cast or update a vote
    castVote: function() {
        var sessionId = this.getParameter('sysparm_session_id');
        var storyId = this.getParameter('sysparm_story_id');
        var voteValue = this.getParameter('sysparm_vote_value');
        var userId = gs.getUserID();

        gs.info('PlanningPokerVotingAjax.castVote: User ' + userId + ' voting ' + voteValue + ' on story ' + storyId);

        try {
            // Check if user already voted on this story
            var existingVote = new GlideRecord('x_1860782_msm_pl_0_vote');
            existingVote.addQuery('session', sessionId);
            existingVote.addQuery('story', storyId);
            existingVote.addQuery('voter', userId);
            existingVote.addQuery('is_current', true);
            existingVote.query();

            if (existingVote.next()) {
                // Update existing vote
                gs.info('PlanningPokerVotingAjax.castVote: Updating existing vote');
                
                // Mark old vote as not current
                existingVote.setValue('is_current', false);
                existingVote.update();

                // Create new vote with incremented version
                var newVote = new GlideRecord('x_1860782_msm_pl_0_vote');
                newVote.initialize();
                newVote.setValue('session', sessionId);
                newVote.setValue('story', storyId);
                newVote.setValue('voter', userId);
                newVote.setValue('vote_value', voteValue);
                newVote.setValue('version', parseInt(existingVote.getValue('version')) + 1);
                newVote.setValue('is_current', true);
                newVote.setValue('created_on', new GlideDateTime());
                
                var voteId = newVote.insert();
                
                if (voteId) {
                    gs.info('PlanningPokerVotingAjax.castVote: Vote updated successfully');
                    return JSON.stringify({ 
                        success: true, 
                        sys_id: voteId,
                        vote_value: voteValue,
                        version: newVote.getValue('version')
                    });
                }
            } else {
                // Create new vote
                gs.info('PlanningPokerVotingAjax.castVote: Creating new vote');
                
                var vote = new GlideRecord('x_1860782_msm_pl_0_vote');
                vote.initialize();
                vote.setValue('session', sessionId);
                vote.setValue('story', storyId);
                vote.setValue('voter', userId);
                vote.setValue('vote_value', voteValue);
                vote.setValue('version', 1);
                vote.setValue('is_current', true);
                vote.setValue('created_on', new GlideDateTime());
                
                var voteId = vote.insert();
                
                if (voteId) {
                    gs.info('PlanningPokerVotingAjax.castVote: Vote created successfully');
                    return JSON.stringify({ 
                        success: true, 
                        sys_id: voteId,
                        vote_value: voteValue,
                        version: 1
                    });
                }
            }

            gs.error('PlanningPokerVotingAjax.castVote: Failed to create/update vote');
            return JSON.stringify({ success: false, error: 'Failed to save vote' });

        } catch (error) {
            gs.error('PlanningPokerVotingAjax.castVote: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Get all votes for a story
    getStoryVotes: function() {
        var storyId = this.getParameter('sysparm_story_id');
        var includeHistory = this.getParameter('sysparm_include_history') === 'true';

        gs.info('PlanningPokerVotingAjax.getStoryVotes: Fetching votes for story ' + storyId);

        try {
            var gr = new GlideRecord('x_1860782_msm_pl_0_vote');
            gr.addQuery('story', storyId);
            
            if (!includeHistory) {
                gr.addQuery('is_current', true);
            }
            
            gr.orderBy('created_on');
            gr.query();

            var votes = [];
            while (gr.next()) {
                votes.push({
                    sys_id: gr.getValue('sys_id'),
                    voter: gr.getValue('voter'),
                    voter_name: gr.getDisplayValue('voter'),
                    vote_value: gr.getValue('vote_value'),
                    version: gr.getValue('version'),
                    is_current: gr.getValue('is_current'),
                    created_on: gr.getValue('created_on')
                });
            }

            gs.info('PlanningPokerVotingAjax.getStoryVotes: Found ' + votes.length + ' votes');
            return JSON.stringify(votes);

        } catch (error) {
            gs.error('PlanningPokerVotingAjax.getStoryVotes: Exception - ' + error);
            return JSON.stringify([]);
        }
    },

    // Get vote statistics for a story
    getVoteStats: function() {
        var storyId = this.getParameter('sysparm_story_id');

        gs.info('PlanningPokerVotingAjax.getVoteStats: Calculating stats for story ' + storyId);

        try {
            // Get all current votes
            var gr = new GlideRecord('x_1860782_msm_pl_0_vote');
            gr.addQuery('story', storyId);
            gr.addQuery('is_current', true);
            gr.query();

            var totalVotes = 0;
            var voteCounts = {};
            var numericVotes = [];

            while (gr.next()) {
                totalVotes++;
                var voteValue = gr.getValue('vote_value');
                
                // Count occurrences
                if (!voteCounts[voteValue]) {
                    voteCounts[voteValue] = 0;
                }
                voteCounts[voteValue]++;

                // Collect numeric values for statistical calculations
                var numeric = this._voteToNumber(voteValue);
                if (numeric !== null) {
                    numericVotes.push(numeric);
                }
            }

            // Calculate statistics
            var stats = {
                total_votes: totalVotes,
                vote_counts: voteCounts,
                consensus: false,
                consensus_value: null,
                average: null,
                median: null,
                min: null,
                max: null,
                range: null
            };

            // Check for consensus (all votes the same)
            var uniqueVotes = Object.keys(voteCounts);
            if (uniqueVotes.length === 1 && totalVotes > 0) {
                stats.consensus = true;
                stats.consensus_value = uniqueVotes[0];
            }

            // Calculate numeric statistics if we have numeric votes
            if (numericVotes.length > 0) {
                numericVotes.sort(function(a, b) { return a - b; });
                
                // Average
                var sum = 0;
                for (var i = 0; i < numericVotes.length; i++) {
                    sum += numericVotes[i];
                }
                stats.average = Math.round((sum / numericVotes.length) * 100) / 100;

                // Median
                var mid = Math.floor(numericVotes.length / 2);
                if (numericVotes.length % 2 === 0) {
                    stats.median = (numericVotes[mid - 1] + numericVotes[mid]) / 2;
                } else {
                    stats.median = numericVotes[mid];
                }

                // Min, Max, Range
                stats.min = numericVotes[0];
                stats.max = numericVotes[numericVotes.length - 1];
                stats.range = stats.max - stats.min;
            }

            gs.info('PlanningPokerVotingAjax.getVoteStats: Calculated stats - Total: ' + totalVotes + ', Consensus: ' + stats.consensus);
            return JSON.stringify(stats);

        } catch (error) {
            gs.error('PlanningPokerVotingAjax.getVoteStats: Exception - ' + error);
            return JSON.stringify({ total_votes: 0, vote_counts: {}, consensus: false });
        }
    },

    // Clear all votes for a story (for re-voting)
    clearStoryVotes: function() {
        var storyId = this.getParameter('sysparm_story_id');

        gs.info('PlanningPokerVotingAjax.clearStoryVotes: Clearing votes for story ' + storyId);

        try {
            var gr = new GlideRecord('x_1860782_msm_pl_0_vote');
            gr.addQuery('story', storyId);
            gr.deleteMultiple();

            gs.info('PlanningPokerVotingAjax.clearStoryVotes: Votes cleared successfully');
            return JSON.stringify({ success: true });

        } catch (error) {
            gs.error('PlanningPokerVotingAjax.clearStoryVotes: Exception - ' + error);
            return JSON.stringify({ success: false, error: error.toString() });
        }
    },

    // Helper: Convert vote value to number for calculations
    _voteToNumber: function(voteValue) {
        var numeric = parseFloat(voteValue);
        if (!isNaN(numeric)) {
            return numeric;
        }

        // Handle special values
        switch (voteValue.toLowerCase()) {
            case '?':
            case 'coffee':
            case '☕':
            case 'infinity':
            case '∞':
                return null;
            default:
                return null;
        }
    },

    type: 'PlanningPokerVotingAjax'
});
`
})
