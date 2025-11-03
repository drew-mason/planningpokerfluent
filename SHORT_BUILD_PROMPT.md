ServiceNow Planning Poker Application

Create a collaborative story estimation tool for agile teams.

APPLICATION FLOW:
1. User opens app and chooses to create session or join existing
2. Creating generates unique 6-char code (ABC123) and makes user facilitator
3. Facilitator adds user stories to estimate
4. Team members join by entering session code
5. Facilitator starts session when ready
6. Each story displayed with planning poker cards (1,2,3,5,8,13,21,34,55,89,?)
7. Participants vote privately, then cards reveal simultaneously
8. System calculates consensus (estimates within 20% of average)
9. If consensus, story gets final estimate; if not, team discusses and re-votes
10. Process repeats for each story; facilitator can add more stories
11. Session tracks progress and consensus rate

TABLES:
- Planning Sessions: session details, status, metadata
- Session Stories: user stories within sessions
- Session Participants: team members in sessions
- Planning Votes: individual votes from participants