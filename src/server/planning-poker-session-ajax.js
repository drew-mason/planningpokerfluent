/**
 * Planning Poker Session Management Script Include
 * Provides server-side data access for planning poker sessions
 */

var PlanningPokerSessionAjax = Class.create();
PlanningPokerSessionAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    getSessions: function(options) {
        gs.info('PlanningPokerSessionAjax.getSessions: Starting session query');

        var gr = new GlideRecord('x_902080_ppoker_session');
        gr.addEncodedQuery('ORDERBYDESCsys_created_on');

        if (options && options.limit) {
            gr.setLimit(options.limit);
        } else {
            gr.setLimit(50);
        }

        var results = [];
        gr.query();

        while (gr.next()) {
            results.push({
                sys_id: gr.getValue('sys_id'),
                name: gr.getValue('name'),
                description: gr.getValue('description'),
                status: gr.getValue('status'),
                session_code: gr.getValue('session_code'),
                dealer: gr.getValue('dealer'),
                total_stories: gr.getValue('total_stories'),
                completed_stories: gr.getValue('completed_stories'),
                consensus_rate: gr.getValue('consensus_rate'),
                started_at: gr.getValue('started_at'),
                completed_at: gr.getValue('completed_at'),
                timebox_minutes: gr.getValue('timebox_minutes'),
                sys_created_on: gr.getValue('sys_created_on'),
                sys_updated_on: gr.getValue('sys_updated_on')
            });
        }

        gs.info('PlanningPokerSessionAjax.getSessions: Found ' + results.length + ' sessions');
        return results;
    },

    getSession: function(sysId) {
        gs.info('PlanningPokerSessionAjax.getSession: Fetching session ' + sysId);

        var gr = new GlideRecord('x_902080_ppoker_session');
        if (gr.get(sysId)) {
            return {
                sys_id: gr.getValue('sys_id'),
                name: gr.getValue('name'),
                description: gr.getValue('description'),
                status: gr.getValue('status'),
                session_code: gr.getValue('session_code'),
                dealer: gr.getValue('dealer'),
                total_stories: gr.getValue('total_stories'),
                completed_stories: gr.getValue('completed_stories'),
                consensus_rate: gr.getValue('consensus_rate'),
                started_at: gr.getValue('started_at'),
                completed_at: gr.getValue('completed_at'),
                timebox_minutes: gr.getValue('timebox_minutes'),
                sys_created_on: gr.getValue('sys_created_on'),
                sys_updated_on: gr.getValue('sys_updated_on')
            };
        } else {
            gs.warn('PlanningPokerSessionAjax.getSession: Session not found - ' + sysId);
            return null;
        }
    },

    createSession: function(sessionData) {
        gs.info('PlanningPokerSessionAjax.createSession: Creating new session');

        var gr = new GlideRecord('x_902080_ppoker_session');

        // Set required fields
        gr.setValue('name', sessionData.name);
        gr.setValue('description', sessionData.description || '');
        gr.setValue('session_code', sessionData.session_code || this.generateSessionCode());
        gr.setValue('status', sessionData.status || 'pending');
        gr.setValue('dealer', sessionData.dealer || gs.getUserID());
        gr.setValue('total_stories', sessionData.total_stories || 0);
        gr.setValue('completed_stories', sessionData.completed_stories || 0);
        gr.setValue('consensus_rate', sessionData.consensus_rate || 0);
        gr.setValue('timebox_minutes', sessionData.timebox_minutes || 30);

        var sysId = gr.insert();

        if (sysId) {
            gs.info('PlanningPokerSessionAjax.createSession: Created session with sys_id ' + sysId);
            return this.getSession(sysId);
        } else {
            gs.error('PlanningPokerSessionAjax.createSession: Failed to create session');
            return null;
        }
    },

    updateSession: function(sysId, sessionData) {
        gs.info('PlanningPokerSessionAjax.updateSession: Updating session ' + sysId);

        var gr = new GlideRecord('x_902080_ppoker_session');
        if (!gr.get(sysId)) {
            gs.warn('PlanningPokerSessionAjax.updateSession: Session not found - ' + sysId);
            return null;
        }

        // Update fields if provided
        if (sessionData.name !== undefined) {
            gr.setValue('name', sessionData.name);
        }
        if (sessionData.description !== undefined) {
            gr.setValue('description', sessionData.description);
        }
        if (sessionData.status !== undefined) {
            gr.setValue('status', sessionData.status);
        }
        if (sessionData.timebox_minutes !== undefined) {
            gr.setValue('timebox_minutes', sessionData.timebox_minutes);
        }

        // Handle status transitions
        if (sessionData.status === 'active' && !gr.getValue('started_at')) {
            gr.setValue('started_at', new GlideDateTime().getValue());
        } else if (sessionData.status === 'completed' && !gr.getValue('completed_at')) {
            gr.setValue('completed_at', new GlideDateTime().getValue());
            // Calculate final stats
            this.completeSession(sysId);
        }

        if (gr.update()) {
            gs.info('PlanningPokerSessionAjax.updateSession: Updated session ' + sysId);
            return this.getSession(sysId);
        } else {
            gs.error('PlanningPokerSessionAjax.updateSession: Failed to update session ' + sysId);
            return null;
        }
    },

    deleteSession: function(sysId) {
        gs.info('PlanningPokerSessionAjax.deleteSession: Deleting session ' + sysId);

        var gr = new GlideRecord('x_902080_ppoker_session');
        if (!gr.get(sysId)) {
            gs.warn('PlanningPokerSessionAjax.deleteSession: Session not found - ' + sysId);
            return false;
        }

        // Check if session can be deleted
        if (gr.getValue('status') === 'active') {
            gs.warn('PlanningPokerSessionAjax.deleteSession: Cannot delete active session ' + sysId);
            return false;
        }

        if (gr.deleteRecord()) {
            gs.info('PlanningPokerSessionAjax.deleteSession: Deleted session ' + sysId);
            return true;
        } else {
            gs.error('PlanningPokerSessionAjax.deleteSession: Failed to delete session ' + sysId);
            return false;
        }
    },

    joinSession: function(sessionCode) {
        gs.info('PlanningPokerSessionAjax.joinSession: Joining session with code ' + sessionCode);

        // Find session by code
        var gr = new GlideRecord('x_902080_ppoker_session');
        gr.addQuery('session_code', sessionCode);
        gr.query();

        if (!gr.next()) {
            gs.warn('PlanningPokerSessionAjax.joinSession: Session not found for code ' + sessionCode);
            return null;
        }

        var sessionId = gr.getValue('sys_id');
        var userId = gs.getUserID();

        // Check if user is already a participant
        if (!this.checkParticipantExists(sessionId, userId)) {
            this.addParticipant(sessionId, userId);
        }

        return this.getSession(sessionId);
    },

    generateSessionCode: function() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    checkParticipantExists: function(sessionId, userId) {
        var gr = new GlideRecord('x_902080_ppoker_session_participant');
        gr.addQuery('session', sessionId);
        gr.addQuery('user', userId);
        gr.addNullQuery('left_at');
        gr.query();
        return gr.hasNext();
    },

    addParticipant: function(sessionId, userId, role) {
        role = role || 'participant';
        var gr = new GlideRecord('x_902080_ppoker_session_participant');
        gr.setValue('session', sessionId);
        gr.setValue('user', userId);
        gr.setValue('role', role);
        gr.setValue('joined_at', new GlideDateTime().getValue());
        return gr.insert();
    },

    completeSession: function(sessionId) {
        gs.info('PlanningPokerSessionAjax.completeSession: Completing session ' + sessionId);

        var gr = new GlideRecord('x_902080_ppoker_session');
        if (!gr.get(sessionId)) {
            return false;
        }

        // Get story statistics
        var storyGr = new GlideRecord('x_902080_ppoker_session_stories');
        storyGr.addQuery('session', sessionId);
        storyGr.query();

        var totalStories = 0;
        var completedStories = 0;
        var consensusStories = 0;

        while (storyGr.next()) {
            totalStories++;
            if (storyGr.getValue('status') === 'completed') {
                completedStories++;
            }
            if (storyGr.getValue('consensus_achieved') == 'true') {
                consensusStories++;
            }
        }

        var consensusRate = totalStories > 0 ? Math.round((consensusStories / totalStories) * 100) : 0;

        gr.setValue('total_stories', totalStories);
        gr.setValue('completed_stories', completedStories);
        gr.setValue('consensus_rate', consensusRate);
        gr.setValue('completed_at', new GlideDateTime().getValue());

        return gr.update();
    },

    type: 'PlanningPokerSessionAjax'
});