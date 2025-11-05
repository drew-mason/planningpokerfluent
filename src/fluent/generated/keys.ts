import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '7cd03c545a70406fb942c0149de6c513'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '7f9914375e7c428082cbe8f4561f94fb'
                    }
                    planning_poker_session_ajax: {
                        table: 'sys_script_include'
                        id: 'e1abd0e573904e20a7f2e952047d3286'
                    }
                    planning_poker_story_ajax: {
                        table: 'sys_script_include'
                        id: '4747ac0dc5d74ced98ba0e3b5718fe3b'
                    }
                    planning_poker_voting_ajax: {
                        table: 'sys_script_include'
                        id: 'e408b328822d444396deb2982cc5a74e'
                    }
                    'planning-poker-page': {
                        table: 'sys_ui_page'
                        id: '2945ae40b4364f2f846ce6b0a2f07f60'
                    }
                    session_defaults_br: {
                        table: 'sys_script'
                        id: 'cc0019200b4046a491420c6d9d02ba85'
                    }
                    'src_server_planning-poker-session-ajax_js': {
                        table: 'sys_module'
                        id: '4253755231d143b38b77afab68eeba28'
                    }
                    'src_server_session-defaults_js': {
                        table: 'sys_module'
                        id: 'cbc110352721498a8e9233b35b80e588'
                    }
                    'src_server_syslog-debug_js': {
                        table: 'sys_module'
                        id: '6f1eda70562e410d8e5e14f4c14cbd87'
                    }
                    'x_902080_planpoker/main': {
                        table: 'sys_ux_lib_asset'
                        id: '98287bc2178a420197fbf607b855ff08'
                        deleted: true
                    }
                    'x_902080_planpoker/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: '243b012df7ae4a5d817f492dbf6ebced'
                        deleted: true
                    }
                    'x_902080_ppoker/main': {
                        table: 'sys_ux_lib_asset'
                        id: '32916e3fb34b4414a2f68ecf4404aaef'
                    }
                    'x_902080_ppoker/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'd941f9600f594e0e9de81e0162929c60'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '009e0ced111042c7a055935e0096a7f7'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'voter'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '01772f1136454c91a73cb4e910c786d8'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0386923ad5504819bc32564062db8d43'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'voting'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '053430625aef41ec94c620cd6757cf1a'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '05f430ed216148dc8e700bec75321c8f'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0839056c6ee34f6fa72ba3923d8fa150'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0aaa5804d5c54049be505a323b006062'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b34cfa075a346948d95be397b400ece'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0df2dba89fac42c99607973ea309c3c9'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0e813de60a0748ef93eb0d5398956e55'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'completed_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1052b47f7cf7454e8f973d1c307eace7'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'session_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '107c65d27a094fc0b8aacdcf44e83c87'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '11e66b74e32c42679b292fad1f7b1ad3'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'status'
                            value: 'active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '12bc6f5cb3774ffab9336895e3dc8cc5'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '14782e84d96f41edaecf224de6beb6b6'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'created_on'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '1658a8f1f11b434b96b83b29e9fd341b'
                        key: {
                            name: 'x_902080_ppoker_session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18dd2233a74c469db60f43c6c13b9693'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '194d7e12a9224b82ae425e6b8ef6beba'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'total_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '19af059418134890b25ce840cf1e9c22'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'dealer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19c57849e07b40f0825da7c1f2b71d91'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'consensus_achieved'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19c9c517f89545f39e80b2a12e82b845'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'total_stories'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1c1c31a1a4e14d6db06a3c57834247a4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '1cf62033b36b4459a2afeda874b4dff3'
                        key: {
                            name: 'x_902080_ppoker_session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '205fcdcc130643f7b95c169f289dc8b8'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'vote_value'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '211eea0196564c99b1cd8fed3c7ad843'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'final_estimate'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '24051502c7db42bdb9f76269e4c123f3'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'status'
                            value: 'cancelled'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '245fd776484c4669ae9382b251cc6c37'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'voting_started'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26956fc8082e45d8b6b0111f59ecdfc2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '26bdbbc9a6124b71902d80575b2c7839'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'voter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '26cc78f37d0f43429d9e237b0ace1dad'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '27dff4ba5d0f4e049c270b4de4d227dc'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2826e7300c1b4282b8c72c763c269c15'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'timebox_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '28529291371e421ca173057776484d8d'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '29cfe386351f43b4b69ed51a039e50a1'
                        key: {
                            name: 'x_902080_ppoker_vote'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2c9d2314bbd84d349a6b1ff8c0fd5dc1'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2df3d2d05f0143f6bdd096cb28733062'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'status'
                            value: 'cancelled'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2e138483612a4c78bb7bf1fbb2d554ef'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            value: 'observer'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f83271e4ba841bca271ae93508e40b2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            value: 'dealer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '320d5e6b3aa2443bac31b062eccdbce7'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '3289a53c84574c1ba5f60530b52d8dd3'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '33a1e054928943409162e0604aff31aa'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '34181737f36c4dd5bae69ea1dd7ea22a'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'sequence_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '36d9ee71f41f49a9bd3b301a95d0518c'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '3749fed1737943a38df55cce1502eb7c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '38055a0f9ecb4197ba787fe686a82406'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '387b3520d6bc49f6a9429925d0c59322'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'skipped'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '38b369c2b0184789a14224ca9a8340ac'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'dealer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '38f8ef11df6041a096309f3f2d1a0d2c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'is_current'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3ac84197078149cf8e5d75b706a6c1f4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            value: 'participant'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3ac9bebaffb6461a81c6a3da975452bd'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3bcdb2231dbc4b05b67980887438a514'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'consensus_achieved'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3c56434ee0814e15854c81ee5dad55fa'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d1920557ba840779f2d179d33d78bd1'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'vote_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3d310d4a2b064968a7d32b84f1d6f921'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3dfc18d984b943548bdc1fc2165702be'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3f8efec123234a888e7f096e6134e2d8'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'completed_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '41f1ed305d5443eab8bc91de67ee6899'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'version'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '42b8d8333c28460ba0b3490bfd96802e'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '42d5c8c0b1004aeab61fff23897f822d'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'session_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '43cb1a708d8c42c4a514e892ab131948'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '47165b43aa39414ba4ef7db39908f1d6'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '49561f3dc5b64f16992030872203cd92'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4b3e97c7c3774322b9d93c22539b84eb'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4b8606e369f94abdac713af5c5f90cb6'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4d5e1f456d9242509b994d62c2a2b572'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'created_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4d8c8e0e12914f59aa6a373fc79935e4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'final_estimate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4f28dac66df24463b9e95cb9317176b1'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'consensus_achieved'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '501e35911f3b4cdabf3b07d7bba43daf'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'created_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5097a9fdf6c84f589823357d0127b6f9'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '51e7dd908ff6444a9e5fc044948aa8eb'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'is_current'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5245c1aceaaf46d98a3531296bc12d6f'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '52c62f84da27406eb931648a40bc9e53'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '53b216761e274a89950ab736eb7ee6f0'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '53c0912f10f9453cb3aa56dc3871f59d'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '546ff86efb9e4f34b3c550aed2115e36'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'sequence_order'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '5493fb4b1bea40d6ac8f33821d95ec6b'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '54dafdb4d963491fbd7ee9f156bca2b9'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '54e1bed5f92148319ae113080c8ef2e4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'voting_started'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '568e424d8ef24b858b91447edc0d15d7'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '5971380836ad45aa8517a6399a02c799'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '59cf5fd84ca54b33a7e9b7029c61b85f'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5a6682cbf1c54aaab8f079aa73a29898'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'completed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5aba95f2a2874be29a31650c704a8c66'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5b1f9e483af34001abfb8b43dbddb4e1'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'session_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5b5fbba9af954a18bbcf299fb22ab480'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'story_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5f2a30077d274bb094de28f2c65b83df'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '605ce9be9dd44fb2abcbd65d717251d7'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'left_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '61d46796f4f74ecd95d8303221d579cc'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'story_title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '62238efb544a4a85960689889dc703af'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'version'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '627e4424c6664f1cb9fac6525593bf50'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '62f4622726a04510b837f63289cb3b23'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'dealer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '64dbdd6af98d45d9bbe8e181399814eb'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'left_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '658182e6f7344b8c941724ca7ab7def2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'final_estimate'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '670b3c8a9524437da460a7aa9c9ae7cb'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'consensus_rate'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '677e127cde7345dab703db0fa35c5ebd'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '67e19f5a0a784288910fddfa88977980'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '67ecda91ad414daa9787da1fe0818115'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'voter'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '699caf1d9e564dcda938c5a380d95e8d'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6a4f15114dbd441a9ef7c3bd4a299c17'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6abfcc59e14d45eca5c61f5fab273c5a'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'left_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6b76149c10d0487d9a4486b3c5c43b68'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e7503019e2949b58e5f2ea5701cd331'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'total_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6fbd1e9799f74581b21cc32d61846d2d'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'consensus_achieved'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7234a276f79d4c5bbd01d2dd167694f0'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'vote_value'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '736bb09e7a454c8581e2781632bf6b2c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7452143f152b4413b07592be8d3345b1'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '748facfc741d4560940e126e9e55bf6b'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74a968a365e049f5be32b63a91309ba4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'story_title'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '74d5d01c3d8c41089beabe45a8a45813'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74e53e3556c341e79f61b3d634669043'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76bf62d554d440318ca4bbcedb6c1308'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '76ea0672508c4f9b88987dbe3dce447d'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                            value: 'voting'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '79178f6c29a64b66ade97b3cdab9abb8'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'role'
                            value: 'observer'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7bd20cada6f04327bf4dc8a2ea7829cd'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '7bd7cdd950f44dcb8d439916feede1dd'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7ca2ca333214470d97f16fe4cafecc22'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d50fb40426c4a07b163dbc037112533'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e0245a55cee4a679af33c0cbee8ceac'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'total_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e165f38c3f24fd2b036369e1b11944e'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'timebox_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e9fca2037014a2485f8323867268a6d'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'story'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '7ef80fb1419d44d9bd87a72d9c09ce43'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '822080d36948400992d6872e4dc8bbf4'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '82342ca6cc034464bb15f3bdf7cde292'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '83e59b1300e5426dab048e9b7afdddfc'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'active'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8593b7c47f704739b30411862ec5b6fc'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'is_current'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '85f8420ea4474d58bdd673531a6208eb'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '863cf94c59fd460687de0d175889108b'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'consensus_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '864b02158c154d7c8c5ef95eb8ea0525'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'sequence_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8696a2c3707f4a3bac99ebbcb9f17112'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '876b7c7a19cc46a7a03e119ba730bccc'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'consensus_rate'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '88776c29a7de4fabb043a86dd9b1a8fa'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'voter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '89308fbd73f34fd28a31881a7366e00b'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '89ccd81810cd4e25b86eaac2f1e4eed0'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8c5c6d91b80a404abb3a6dcb81db52ef'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8eb95eed068f4bb4a29ad5aed2a99e98'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'completed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8ed5ef1217e04e4c8e06d57b6f1b4dca'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'created_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9006aa724af3489fa86dd0f60941c6b2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '90330d9b936e48c0ae34bfc83fa5f960'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '932e76dd6c924317a73a1f5a74be0143'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '936a6188f1474ab498ad2744923fe798'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'completed_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '944c65ef1da74dd3bb5f198cf875df52'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '94aed87149834785ad23e13e57010d0c'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '95dc661db7264f69aed0916129b54654'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9826f43b48c84683b3644d42ab978d38'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'session_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9a203059cece4b6cbd677144da49771d'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'final_estimate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9afb75d22f4a4f55a5eba324ea392dd2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'completed_stories'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9b46cf5298174d00a75d932b8af50741'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9c851dcb06184dc78e9db9c553bcaba0'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'role'
                            value: 'dealer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9cd0ad4f04e946bfa7e5a01b42fdadb6'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'version'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9d200d3fa69744c99f924bf50579c2a6'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9ff421c5e2df4da58d3ef1ef371a90f6'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'revealed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a083d3c51da744a58555b53bf4265978'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'is_current'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a0e9629d1602415c91538549e45eec8c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a2f7d697a94245218784bc4dbc8610a6'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'vote_summary'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4523073f46c4a1686befc59dad27259'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a516fb180d494d94b81f65fe8f62fee1'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a53900def6174e83ba26f93e2250be73'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'voting_started'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a5cad1ce47794ea08f5b88f1def0601e'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a7749ad3c9584103bf6d03bdd27a3a72'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ab57d77267094a09b9735b2a6e13646d'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'consensus_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ac2a57bb2d75462d824e7a84b8403655'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ad51793552a14e79834369608e383659'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ae78393b83824e25a8b3a731c0eeff05'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'session_code'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'afd5a1418a8a4b9b99bef09e948a309b'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'consensus_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b06946c2bd28462cbefb58ca44b5cd06'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b081954a16c74aa09f32a28810b65c5e'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'joined_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b08d2b1532374e3fa16022e985fff1b5'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'vote_summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b0f0b66813644e6b964ea76a7f6756b4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'status'
                            value: 'active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b2c9df495a724affac190afe50bce2f7'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'timebox_minutes'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b8d5eb79c0c24b5395902e3c2d59b645'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'voter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb5cb91f523b447991d74e558867fd63'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'dealer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb8839317b93406c8ac9bdf6355fb3fc'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb90eb32e2294d619494477e7848e839'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc8822d81cd1481d8f8d3e44ab622271'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'completed_stories'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bcabb7f00fb4404dac72c4026c21ae5f'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bd433d108db44b7893d1bf5c1afa2712'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'created_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'be95c57a04514b99b2e9d9140af57a3f'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'voting_started'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c08ebca773c04e13994780d838816be5'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'consensus_rate'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c0ce6b3b80f14543bfbf03d3818d55b3'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'sequence_order'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c0ed8c0d989646fc854b0e567a601589'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'role'
                            value: 'participant'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c180392ef3ba434392daa8b2a4f264b7'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'vote_value'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c313ceb1a8aa45db8c3abae1c0e79aaf'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'joined_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c32b4039598640898ec0f6193113cfb2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3b55083ae1d45fd9db0e6d566630462'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'joined_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c4516f6a7ee64a7b8507b6c4f9fc598e'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'vote_summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c50af3ae176d4586b410b30eedc0e392'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'timebox_minutes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c560a7f9fc744b1c800377c05d73bd94'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c5aca261df5c4b04915bb3f9446e9736'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c626b7877b9142dfa9f4f22a288cfa57'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'vote_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c63de8f58f5a4148a88c1aec6c35c959'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'dealer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c721c0e06ffa48759308f48d9e274805'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c820adff042043df8f9f3ba01f1e3c88'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'is_current'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c8fb018259f946688ec2180092369eef'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'story'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c99a4941fa40408f9f2533ff52d47cd5'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c9cf709a119e4037bd6225168d188562'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ce634870dd7e4326ada8cf4093b07a4d'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cf0e448417e34c4298ddcf7ed82501d7'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'dealer'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'cf885f459711430f8a5f97b7cb6f988f'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cfce758b421c4c878d4fa9b104205141'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'story_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd1d4b0ed449f4edfa674471eaf7441b5'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd37f4734bdc94178bb1be64c3564669c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'name'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'd55c61b927aa44cba8013947c9eb895c'
                        key: {
                            name: 'x_902080_ppoker_vote'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd588ef6caf43463cae32b750a4d8ec01'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'story'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd6c7353f264d479b80fb945e1d723013'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'completed_stories'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd7f2b91b9d434dbf9c33f3ddb27f59e9'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'total_stories'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd94895b0f4d1480eadb756ab3894bb8d'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'joined_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'da537eb7cb064eb69e04d4cc0881304f'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'da71ec7a8962447d8935a44683101ffd'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dbe631ba2427461ba2be61d3a4b87e7b'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'left_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'de4aa6224e46413fa216876c57c6ddd2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de93e87e57cd4259a60994070f63c7cb'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df38e1e78d254872bba65ea0ddb4a2bb'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e34b1da5de1242339b1d3c84f7fd3eb5'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'vote_summary'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e4dabbd04c514985b2bd856fdbfecc84'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e578d7b8922547d182353b939445e266'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e5f59f009c404a57b63c8b2a0e098f35'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'cancelled'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e6de2799932746b2bb902dd41b3e7b15'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'is_current'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e714ba5ed4394c398918d767fcd830eb'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'total_stories'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ea0d48e14b1741f09021c96a93de5c5e'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'vote_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eab4a3f5e93747c098b8b096d428f27e'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ee3a256c01cc45d786477c5733918d8f'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                            value: 'skipped'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f273c73ef0a34721b5cf9b3136f03c5d'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'timebox_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f2c4f28e79f646c9b95522258f98d6f8'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f3c4c74094d94aa0b362711779ffc648'
                        key: {
                            name: 'x_902080_ppoker_session'
                            element: 'started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f479c358ce11418fac38cdac710c925e'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'created_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f54fe0ddd1f64002ad5c6065a5beb7d4'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'timebox_minutes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f5a761e00d304ca587928c59ac96fe51'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f767f0860b7b4ba9a6aa42bfdeb9e8e7'
                        key: {
                            name: 'x_902080_ppoker_session_participant'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f9295bbcf2f5497396619a39854cf6bb'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'completed_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f96ef79faa9a41c0b96816fcc245b702'
                        key: {
                            name: 'x_902080_ppoker_vote'
                            element: 'voter'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fc5e6c8b2abb40098ca2f4c47c9d802c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'session_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fc91a61c0bf641ba872e4c5faad18f7d'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fe84e291703c401c800ef0b521995329'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_vote'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fe8cead63a24409c9c2dea28bada5a78'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'completed_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'ff74fd1ec883433aa2141eaf4781f590'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ff9a49bde90b4f3884048d641911355c'
                        key: {
                            name: 'x_902080_ppoker_session_stories'
                            element: 'status'
                            value: 'revealed'
                        }
                    },
                ]
            }
        }
    }
}
