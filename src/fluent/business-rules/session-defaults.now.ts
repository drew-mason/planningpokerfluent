import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { setDefaultDealer } from '../../server/session-defaults.js'

BusinessRule({
    $id: Now.ID['session_defaults_br'],
    name: 'Set Session Defaults',
    table: 'x_902080_planpoker_planning_session',
    when: 'before',
    action: ['insert', 'update'],
    script: setDefaultDealer,
    order: 100,
    active: true,
    description: 'Sets default values for planning sessions including dealer and session code'
})