import { gs } from '@servicenow/glide'

export function querySyslogForPlanningPoker() {
    gs.info('=== PLANNING POKER APPLICATION DEBUG LOGS ===')

    // Query syslog table for planning poker related entries
    var gr = new GlideRecord('syslog')
    gr.addQuery('source', 'CONTAINS', 'x_902080_planpoker')
    gr.addQuery('sys_created_on', '>=', gs.daysAgo(1)) // Last 24 hours
    gr.orderByDesc('sys_created_on')
    gr.setLimit(50)

    gr.query()

    gs.info('Total planning poker log entries found: ' + gr.getRowCount())

    var count = 0
    while (gr.next()) {
        count++
        gs.info('--- Log Entry #' + count + ' ---')
        gs.info('Created: ' + gr.sys_created_on.getDisplayValue())
        gs.info('Level: ' + gr.level.getDisplayValue())
        gs.info('Source: ' + gr.source)
        gs.info('Message: ' + gr.message)

        // Check for specific error patterns
        var message = gr.message.toString()
        if (message.includes('error') || message.includes('Error') || message.includes('ERROR')) {
            gs.warn('POTENTIAL ERROR DETECTED: ' + message)
        }
        if (message.includes('voting') || message.includes('Voting')) {
            gs.info('VOTING-RELATED LOG: ' + message)
        }
        if (message.includes('session') || message.includes('Session')) {
            gs.info('SESSION-RELATED LOG: ' + message)
        }
        if (message.includes('blank') || message.includes('Blank')) {
            gs.warn('BLANK SCREEN RELATED: ' + message)
        }
    }

    // Check for JavaScript errors in the last hour
    gs.info('=== CHECKING FOR JAVASCRIPT ERRORS (Last Hour) ===')
    var jsErrorGr = new GlideRecord('syslog')
    jsErrorGr.addQuery('level', 'error')
    jsErrorGr.addQuery('source', 'CONTAINS', 'javascript')
    jsErrorGr.addQuery('sys_created_on', '>=', gs.hoursAgo(1))
    jsErrorGr.orderByDesc('sys_created_on')
    jsErrorGr.query()

    gs.info('JavaScript errors found: ' + jsErrorGr.getRowCount())
    while (jsErrorGr.next()) {
        gs.error('JS Error: ' + jsErrorGr.message)
    }

    // Check for any REST API calls related to planning poker
    gs.info('=== CHECKING REST API LOGS ===')
    var restLogGr = new GlideRecord('syslog')
    restLogGr.addQuery('source', 'CONTAINS', 'REST')
    restLogGr.addQuery('message', 'CONTAINS', 'x_902080_planpoker')
    restLogGr.addQuery('sys_created_on', '>=', gs.hoursAgo(1))
    restLogGr.orderByDesc('sys_created_on')
    restLogGr.query()

    gs.info('REST API calls found: ' + restLogGr.getRowCount())
    while (restLogGr.next()) {
        gs.info('REST Call: ' + restLogGr.message)
    }

    // Check for any authentication issues
    gs.info('=== CHECKING AUTHENTICATION LOGS ===')
    var authLogGr = new GlideRecord('syslog')
    authLogGr.addQuery('message', 'CONTAINS', 'g_ck')
    authLogGr.addQuery('sys_created_on', '>=', gs.hoursAgo(1))
    authLogGr.orderByDesc('sys_created_on')
    authLogGr.query()

    gs.info('Authentication-related logs found: ' + authLogGr.getRowCount())
    while (authLogGr.next()) {
        gs.warn('AUTH ISSUE: ' + authLogGr.message)
    }

    gs.info('=== DEBUG QUERY COMPLETE ===')
}