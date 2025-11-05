import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import planningPokerPage from '../../client/index.html'

UiPage({
    $id: Now.ID['planning-poker-page'],
    endpoint: 'x_snc_msm_ppoker_app.do',
    description: 'MSM Planning Poker - Collaborative estimation for agile teams',
    category: 'general',
    html: planningPokerPage,
    direct: true,
    roles: [],
    public: false,
})
