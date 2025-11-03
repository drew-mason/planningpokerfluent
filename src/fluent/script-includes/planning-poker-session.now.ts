import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['planning_poker_session_ajax'],
    name: 'PlanningPokerSessionAjax',
    description: 'Server-side data access for planning poker sessions',
    script: `
var PlanningPokerSessionAjax = Class.create();
PlanningPokerSessionAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    getSessions: function() {
        gs.info('PlanningPokerSessionAjax.getSessions: Starting session query');

        var gr = new GlideRecord('x_902080_ppoker_session');
        gr.addEncodedQuery('ORDERBYDESCsys_created_on');
        gr.setLimit(50);

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
        return JSON.stringify(results);
    },

    getSession: function() {
        var sysId = this.getParameter('sysparm_sys_id');
        gs.info('PlanningPokerSessionAjax.getSession: Fetching session ' + sysId);

        var gr = new GlideRecord('x_902080_ppoker_session');
        if (gr.get(sysId)) {
            var result = {
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
            return JSON.stringify(result);
        } else {
            gs.warn('PlanningPokerSessionAjax.getSession: Session not found - ' + sysId);
            return 'null';
        }
    },

    createSession: function() {
        var sessionData = JSON.parse(this.getParameter('sysparm_session_data'));
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
            return this.getSessionById(sysId);
        } else {
            gs.error('PlanningPokerSessionAjax.createSession: Failed to create session');
            return 'null';
        }
    },

    getSessionById: function(sysId) {
        var gr = new GlideRecord('x_902080_ppoker_session');
        if (gr.get(sysId)) {
            var result = {
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
            return JSON.stringify(result);
        }
        return 'null';
    },

    generateSessionCode: function() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var code = '';
        for (var i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    type: 'PlanningPokerSessionAjax'
});
`
})