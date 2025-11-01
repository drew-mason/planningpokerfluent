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
                    'planning-poker-page': {
                        table: 'sys_ui_page'
                        id: '2945ae40b4364f2f846ce6b0a2f07f60'
                    }
                    session_defaults_br: {
                        table: 'sys_script'
                        id: 'cc0019200b4046a491420c6d9d02ba85'
                    }
                    'src_server_session-defaults_js': {
                        table: 'sys_module'
                        id: 'cbc110352721498a8e9233b35b80e588'
                    }
                    'x_902080_planpoker/main': {
                        table: 'sys_ux_lib_asset'
                        id: '98287bc2178a420197fbf607b855ff08'
                    }
                    'x_902080_planpoker/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: '243b012df7ae4a5d817f492dbf6ebced'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '009e0ced111042c7a055935e0096a7f7'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'voter'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0386923ad5504819bc32564062db8d43'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'voting'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '053430625aef41ec94c620cd6757cf1a'
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
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0aaa5804d5c54049be505a323b006062'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            language: 'en'
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
                        id: '1052b47f7cf7454e8f973d1c307eace7'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'session_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '12bc6f5cb3774ffab9336895e3dc8cc5'
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
                        table: 'sys_documentation'
                        id: '194d7e12a9224b82ae425e6b8ef6beba'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'total_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19c9c517f89545f39e80b2a12e82b845'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'total_stories'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1c1c31a1a4e14d6db06a3c57834247a4'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '205fcdcc130643f7b95c169f289dc8b8'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'vote_value'
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
                        table: 'sys_dictionary'
                        id: '26956fc8082e45d8b6b0111f59ecdfc2'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '27dff4ba5d0f4e049c270b4de4d227dc'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '28529291371e421ca173057776484d8d'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2e138483612a4c78bb7bf1fbb2d554ef'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            value: 'observer'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f83271e4ba841bca271ae93508e40b2'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            value: 'dealer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '320d5e6b3aa2443bac31b062eccdbce7'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '3289a53c84574c1ba5f60530b52d8dd3'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '33a1e054928943409162e0604aff31aa'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '3749fed1737943a38df55cce1502eb7c'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'skipped'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '38b369c2b0184789a14224ca9a8340ac'
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
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            value: 'participant'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3ac9bebaffb6461a81c6a3da975452bd'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3bcdb2231dbc4b05b67980887438a514'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'consensus_achieved'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d1920557ba840779f2d179d33d78bd1'
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
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3f8efec123234a888e7f096e6134e2d8'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'completed_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '41f1ed305d5443eab8bc91de67ee6899'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'version'
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
                        table: 'sys_documentation'
                        id: '4d8c8e0e12914f59aa6a373fc79935e4'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'final_estimate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4f28dac66df24463b9e95cb9317176b1'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'consensus_achieved'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '501e35911f3b4cdabf3b07d7bba43daf'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'created_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '51e7dd908ff6444a9e5fc044948aa8eb'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'is_current'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '53b216761e274a89950ab736eb7ee6f0'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '5493fb4b1bea40d6ac8f33821d95ec6b'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'voting_started'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '568e424d8ef24b858b91447edc0d15d7'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5a6682cbf1c54aaab8f079aa73a29898'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'completed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5aba95f2a2874be29a31650c704a8c66'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'story_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5f2a30077d274bb094de28f2c65b83df'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '605ce9be9dd44fb2abcbd65d717251d7'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'left_at'
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
                        table: 'sys_dictionary'
                        id: '658182e6f7344b8c941724ca7ab7def2'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'final_estimate'
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
                        id: '6a4f15114dbd441a9ef7c3bd4a299c17'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6abfcc59e14d45eca5c61f5fab273c5a'
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
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '748facfc741d4560940e126e9e55bf6b'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74a968a365e049f5be32b63a91309ba4'
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
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76bf62d554d440318ca4bbcedb6c1308'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7bd20cada6f04327bf4dc8a2ea7829cd'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7ca2ca333214470d97f16fe4cafecc22'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e165f38c3f24fd2b036369e1b11944e'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'timebox_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e9fca2037014a2485f8323867268a6d'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'story'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '7ef80fb1419d44d9bd87a72d9c09ce43'
                        key: {
                            name: 'x_902080_planpoker_vote'
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
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '863cf94c59fd460687de0d175889108b'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'consensus_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '864b02158c154d7c8c5ef95eb8ea0525'
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
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'consensus_rate'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '88776c29a7de4fabb043a86dd9b1a8fa'
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
                        table: 'sys_dictionary'
                        id: '8c5c6d91b80a404abb3a6dcb81db52ef'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'role'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '90330d9b936e48c0ae34bfc83fa5f960'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '932e76dd6c924317a73a1f5a74be0143'
                        key: {
                            name: 'x_902080_planpoker_session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '936a6188f1474ab498ad2744923fe798'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'completed_stories'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9afb75d22f4a4f55a5eba324ea392dd2'
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
                        id: '9ff421c5e2df4da58d3ef1ef371a90f6'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'revealed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a083d3c51da744a58555b53bf4265978'
                        key: {
                            name: 'x_902080_planpoker_vote'
                            element: 'is_current'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a0e9629d1602415c91538549e45eec8c'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a2f7d697a94245218784bc4dbc8610a6'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'vote_summary'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a516fb180d494d94b81f65fe8f62fee1'
                        key: {
                            name: 'x_902080_planpoker_session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a53900def6174e83ba26f93e2250be73'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'voting_started'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a5cad1ce47794ea08f5b88f1def0601e'
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
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'description'
                            language: 'en'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'sequence_order'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c32b4039598640898ec0f6193113cfb2'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3b55083ae1d45fd9db0e6d566630462'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'joined_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c4516f6a7ee64a7b8507b6c4f9fc598e'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'vote_summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c560a7f9fc744b1c800377c05d73bd94'
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c5aca261df5c4b04915bb3f9446e9736'
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
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'dealer'
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
                        id: 'd37f4734bdc94178bb1be64c3564669c'
                        deleted: true
                        key: {
                            name: 'x_902080_planpoker_planning_session'
                            element: 'name'
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
                        key: {
                            name: 'x_902080_planpoker_session_participant'
                            element: 'joined_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'de4aa6224e46413fa216876c57c6ddd2'
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df38e1e78d254872bba65ea0ddb4a2bb'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e5f59f009c404a57b63c8b2a0e098f35'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'status'
                            value: 'cancelled'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eab4a3f5e93747c098b8b096d428f27e'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'started_at'
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
                        table: 'sys_dictionary'
                        id: 'f479c358ce11418fac38cdac710c925e'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fc5e6c8b2abb40098ca2f4c47c9d802c'
                        key: {
                            name: 'x_902080_planpoker_session'
                            element: 'session_code'
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
                        key: {
                            name: 'x_902080_planpoker_session_stories'
                        }
                    },
                ]
            }
        }
    }
}
