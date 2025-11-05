// AnalyticsService - Data processing and analytics for Planning Poker sessions

export interface SessionMetrics {
  totalSessions: number;
  totalStories: number;
  averageVelocity: number;
  consensusRate: number;
  averageEstimation: number;
  participantEngagement: number;
}

export interface VelocityData {
  sessionName: string;
  date: string;
  storyPoints: number;
  storiesCompleted: number;
  sessionId: string;
}

export interface ConsensusData {
  sessionId: string;
  sessionName: string;
  storyTitle: string;
  consensusAchieved: boolean;
  votingRounds: number;
  finalEstimate: number;
  variance: number;
  participantCount: number;
}

export interface EstimationTrend {
  date: string;
  averageEstimate: number;
  complexity: 'Low' | 'Medium' | 'High';
  sessionCount: number;
  storyCount: number;
}

export interface ParticipantAnalytics {
  userId: string;
  userName: string;
  totalVotes: number;
  consensusRate: number;
  averageEstimate: number;
  participationRate: number;
  accuracyScore: number;
}

export class AnalyticsService {
  private static readonly API_BASE = '/api/x_snc_msm_pp';

  /**
   * Get comprehensive session metrics for the specified time range
   */
  static async getSessionMetrics(timeRange: '7d' | '30d' | '90d' | 'all'): Promise<SessionMetrics> {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(2020); // Far back date
          break;
      }

      // Fetch sessions and voting data
      const sessions = await this.getSessionsInRange(startDate, endDate);
      const votingData = await this.getVotingDataForSessions(sessions.map(s => s.sys_id));
      
      // Calculate metrics
      const totalSessions = sessions.length;
      const totalStories = this.calculateTotalStories(sessions);
      const averageVelocity = this.calculateAverageVelocity(sessions);
      const consensusRate = this.calculateConsensusRate(votingData);
      const averageEstimation = this.calculateAverageEstimation(votingData);
      const participantEngagement = this.calculateParticipantEngagement(votingData);

      return {
        totalSessions,
        totalStories,
        averageVelocity,
        consensusRate,
        averageEstimation,
        participantEngagement
      };
    } catch (error) {
      console.error('Error fetching session metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  /**
   * Get velocity data for charting over time
   */
  static async getVelocityData(timeRange: '7d' | '30d' | '90d' | 'all'): Promise<VelocityData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(2020);
          break;
      }

      const sessions = await this.getSessionsInRange(startDate, endDate);
      
      return sessions.map(session => ({
        sessionName: session.name || 'Unnamed Session',
        date: session.sys_created_on,
        storyPoints: this.calculateSessionVelocity(session),
        storiesCompleted: this.getCompletedStoryCount(session),
        sessionId: session.sys_id
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    } catch (error) {
      console.error('Error fetching velocity data:', error);
      return this.getMockVelocityData();
    }
  }

  /**
   * Get consensus analysis data
   */
  static async getConsensusAnalysis(timeRange: '7d' | '30d' | '90d' | 'all'): Promise<ConsensusData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(2020);
          break;
      }

      const sessions = await this.getSessionsInRange(startDate, endDate);
      const consensusData: ConsensusData[] = [];

      for (const session of sessions) {
        const stories = await this.getStoriesForSession(session.sys_id);
        const votingData = await this.getVotingDataForSession(session.sys_id);

        for (const story of stories) {
          const storyVotes = votingData.filter(v => v.story_id === story.sys_id);
          const consensus = this.analyzeConsensusForStory(storyVotes);
          
          consensusData.push({
            sessionId: session.sys_id,
            sessionName: session.name || 'Unnamed Session',
            storyTitle: story.title || 'Untitled Story',
            consensusAchieved: consensus.achieved,
            votingRounds: consensus.rounds,
            finalEstimate: consensus.finalEstimate,
            variance: consensus.variance,
            participantCount: consensus.participantCount
          });
        }
      }

      return consensusData.sort((a, b) => 
        new Date(b.sessionId).getTime() - new Date(a.sessionId).getTime()
      );
      
    } catch (error) {
      console.error('Error fetching consensus analysis:', error);
      return this.getMockConsensusData();
    }
  }

  /**
   * Get estimation trends over time
   */
  static async getEstimationTrends(timeRange: '7d' | '30d' | '90d' | 'all'): Promise<EstimationTrend[]> {
    try {
      const velocityData = await this.getVelocityData(timeRange);
      const trends: EstimationTrend[] = [];

      // Group data by week or month depending on time range
      const groupBy = timeRange === '7d' ? 'day' : timeRange === '30d' ? 'week' : 'month';
      const grouped = this.groupDataByPeriod(velocityData, groupBy);

      for (const [period, data] of Object.entries(grouped)) {
        const averageEstimate = data.reduce((sum, d) => sum + d.storyPoints, 0) / data.length;
        const storyCount = data.reduce((sum, d) => sum + d.storiesCompleted, 0);
        
        trends.push({
          date: period,
          averageEstimate,
          complexity: this.categorizeComplexity(averageEstimate),
          sessionCount: data.length,
          storyCount
        });
      }

      return trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    } catch (error) {
      console.error('Error fetching estimation trends:', error);
      return this.getMockEstimationTrends();
    }
  }

  /**
   * Export analytics report in specified format
   */
  static async exportReport(format: 'pdf' | 'csv', timeRange: '7d' | '30d' | '90d' | 'all'): Promise<void> {
    try {
      const metrics = await this.getSessionMetrics(timeRange);
      const velocityData = await this.getVelocityData(timeRange);
      const consensusData = await this.getConsensusAnalysis(timeRange);

      if (format === 'csv') {
        await this.exportCSV(metrics, velocityData, consensusData, timeRange);
      } else if (format === 'pdf') {
        await this.exportPDF(metrics, velocityData, consensusData, timeRange);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }

  /**
   * Get participant analytics
   */
  static async getParticipantAnalytics(timeRange: '7d' | '30d' | '90d' | 'all'): Promise<ParticipantAnalytics[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(2020);
          break;
      }

      const votingData = await this.getAllVotingDataInRange(startDate, endDate);
      const participantMap = new Map<string, any>();

      for (const vote of votingData) {
        const userId = vote.participant_id;
        if (!participantMap.has(userId)) {
          participantMap.set(userId, {
            userId,
            userName: vote.participant_name || 'Unknown User',
            votes: [],
            sessions: new Set(),
            consensusVotes: 0
          });
        }

        const participant = participantMap.get(userId);
        participant.votes.push(vote);
        participant.sessions.add(vote.session_id);
        
        if (vote.consensus_achieved) {
          participant.consensusVotes++;
        }
      }

      const analytics: ParticipantAnalytics[] = [];
      
      for (const [userId, data] of participantMap.entries()) {
        const totalVotes = data.votes.length;
        const consensusRate = totalVotes > 0 ? (data.consensusVotes / totalVotes) * 100 : 0;
        const averageEstimate = data.votes.reduce((sum: number, v: any) => sum + (v.estimate || 0), 0) / totalVotes;
        const participationRate = this.calculateParticipationRate(data.sessions.size, totalVotes);
        const accuracyScore = this.calculateAccuracyScore(data.votes);

        analytics.push({
          userId,
          userName: data.userName,
          totalVotes,
          consensusRate,
          averageEstimate,
          participationRate,
          accuracyScore
        });
      }

      return analytics.sort((a, b) => b.totalVotes - a.totalVotes);
      
    } catch (error) {
      console.error('Error fetching participant analytics:', error);
      return [];
    }
  }

  // Private helper methods

  private static async getSessionsInRange(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return this.getMockSessions();
    }
  }

  private static async getVotingDataForSessions(sessionIds: string[]): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/votes?session_ids=${sessionIds.join(',')}`);
      if (!response.ok) throw new Error('Failed to fetch voting data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching voting data:', error);
      return [];
    }
  }

  private static async getVotingDataForSession(sessionId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/votes?session_id=${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch voting data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching voting data for session:', error);
      return [];
    }
  }

  private static async getStoriesForSession(sessionId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/stories?session_id=${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch stories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  private static async getAllVotingDataInRange(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/votes?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch voting data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all voting data:', error);
      return [];
    }
  }

  private static calculateTotalStories(sessions: any[]): number {
    return sessions.reduce((total, session) => total + (session.story_count || 0), 0);
  }

  private static calculateAverageVelocity(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    const totalVelocity = sessions.reduce((sum, session) => sum + this.calculateSessionVelocity(session), 0);
    return totalVelocity / sessions.length;
  }

  private static calculateSessionVelocity(session: any): number {
    return session.total_story_points || session.velocity || 0;
  }

  private static getCompletedStoryCount(session: any): number {
    return session.completed_stories || session.story_count || 0;
  }

  private static calculateConsensusRate(votingData: any[]): number {
    if (votingData.length === 0) return 0;
    const consensusVotes = votingData.filter(vote => vote.consensus_achieved).length;
    return (consensusVotes / votingData.length) * 100;
  }

  private static calculateAverageEstimation(votingData: any[]): number {
    if (votingData.length === 0) return 0;
    const totalEstimates = votingData.reduce((sum, vote) => sum + (vote.estimate || 0), 0);
    return totalEstimates / votingData.length;
  }

  private static calculateParticipantEngagement(votingData: any[]): number {
    // Calculate based on voting participation vs. expected participation
    if (votingData.length === 0) return 0;
    
    const sessionParticipants = new Map();
    votingData.forEach(vote => {
      const sessionId = vote.session_id;
      if (!sessionParticipants.has(sessionId)) {
        sessionParticipants.set(sessionId, new Set());
      }
      sessionParticipants.get(sessionId).add(vote.participant_id);
    });

    // Calculate average participation rate
    let totalEngagement = 0;
    for (const participants of sessionParticipants.values()) {
      const expectedVotes = participants.size * 5; // Assume 5 stories per session on average
      const actualVotes = votingData.filter(v => participants.has(v.participant_id)).length;
      totalEngagement += Math.min((actualVotes / expectedVotes) * 100, 100);
    }

    return sessionParticipants.size > 0 ? totalEngagement / sessionParticipants.size : 0;
  }

  private static analyzeConsensusForStory(storyVotes: any[]): any {
    if (storyVotes.length === 0) {
      return {
        achieved: false,
        rounds: 0,
        finalEstimate: 0,
        variance: 0,
        participantCount: 0
      };
    }

    // Group votes by round
    const rounds = storyVotes.reduce((acc, vote) => {
      const round = vote.voting_round || 1;
      if (!acc[round]) acc[round] = [];
      acc[round].push(vote.estimate);
      return acc;
    }, {});

    const roundKeys = Object.keys(rounds).map(r => parseInt(r)).sort();
    const finalRound = Math.max(...roundKeys);
    const finalEstimates = rounds[finalRound] || [];
    
    const consensusAchieved = this.checkConsensus(finalEstimates);
    const variance = this.calculateVariance(finalEstimates);
    const finalEstimate = finalEstimates.length > 0 ? Math.round(finalEstimates.reduce((sum: number, est: number) => sum + est, 0) / finalEstimates.length) : 0;

    return {
      achieved: consensusAchieved,
      rounds: finalRound,
      finalEstimate,
      variance,
      participantCount: finalEstimates.length
    };
  }

  private static checkConsensus(estimates: number[]): boolean {
    if (estimates.length === 0) return false;
    const uniqueEstimates = new Set(estimates);
    return uniqueEstimates.size === 1 || this.calculateVariance(estimates) < 2;
  }

  private static calculateVariance(estimates: number[]): number {
    if (estimates.length === 0) return 0;
    const mean = estimates.reduce((sum, est) => sum + est, 0) / estimates.length;
    const variance = estimates.reduce((sum, est) => sum + Math.pow(est - mean, 2), 0) / estimates.length;
    return Math.sqrt(variance);
  }

  private static groupDataByPeriod(data: VelocityData[], period: 'day' | 'week' | 'month'): Record<string, VelocityData[]> {
    return data.reduce((acc, item) => {
      const date = new Date(item.date);
      let key: string;

      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, VelocityData[]>);
  }

  private static categorizeComplexity(averageEstimate: number): 'Low' | 'Medium' | 'High' {
    if (averageEstimate <= 3) return 'Low';
    if (averageEstimate <= 8) return 'Medium';
    return 'High';
  }

  private static calculateParticipationRate(sessionCount: number, voteCount: number): number {
    // Estimate expected votes per session (assume 5 stories average)
    const expectedVotes = sessionCount * 5;
    return expectedVotes > 0 ? Math.min((voteCount / expectedVotes) * 100, 100) : 0;
  }

  private static calculateAccuracyScore(votes: any[]): number {
    // Calculate based on how often the participant's estimate matches final consensus
    if (votes.length === 0) return 0;
    
    const accurateVotes = votes.filter(vote => 
      vote.consensus_achieved && Math.abs(vote.estimate - vote.final_estimate) <= 1
    ).length;
    
    return (accurateVotes / votes.length) * 100;
  }

  private static async exportCSV(metrics: SessionMetrics, velocityData: VelocityData[], consensusData: ConsensusData[], timeRange: string): Promise<void> {
    const csvContent = [
      // Headers
      ['Planning Poker Analytics Report'],
      [`Time Range: ${timeRange.toUpperCase()}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['SUMMARY METRICS'],
      ['Metric', 'Value'],
      ['Total Sessions', metrics.totalSessions.toString()],
      ['Total Stories', metrics.totalStories.toString()],
      ['Average Velocity', metrics.averageVelocity.toFixed(1)],
      ['Consensus Rate', `${metrics.consensusRate.toFixed(1)}%`],
      ['Average Estimation', metrics.averageEstimation.toFixed(1)],
      ['Participant Engagement', `${metrics.participantEngagement.toFixed(1)}%`],
      [],
      ['VELOCITY DATA'],
      ['Session', 'Date', 'Story Points', 'Stories Completed'],
      ...velocityData.map(v => [v.sessionName, v.date, v.storyPoints.toString(), v.storiesCompleted.toString()]),
      [],
      ['CONSENSUS ANALYSIS'],
      ['Session', 'Story', 'Consensus', 'Rounds', 'Final Estimate', 'Variance'],
      ...consensusData.map(c => [
        c.sessionName, 
        c.storyTitle, 
        c.consensusAchieved ? 'Yes' : 'No', 
        c.votingRounds.toString(), 
        c.finalEstimate.toString(), 
        c.variance.toFixed(1)
      ])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning-poker-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private static async exportPDF(metrics: SessionMetrics, velocityData: VelocityData[], consensusData: ConsensusData[], timeRange: string): Promise<void> {
    // For now, create a simple PDF export using the browser's print functionality
    // In a real implementation, you would use a PDF library like jsPDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>Planning Poker Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .metric { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .metric h3 { margin: 0 0 10px 0; color: #333; }
            .metric .value { font-size: 24px; font-weight: bold; color: #007bff; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f8f9fa; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Planning Poker Analytics Report</h1>
            <p>Time Range: ${timeRange.toUpperCase()} | Generated: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Summary Metrics</h2>
            <div class="metrics">
              <div class="metric">
                <h3>Total Sessions</h3>
                <div class="value">${metrics.totalSessions}</div>
              </div>
              <div class="metric">
                <h3>Total Stories</h3>
                <div class="value">${metrics.totalStories}</div>
              </div>
              <div class="metric">
                <h3>Average Velocity</h3>
                <div class="value">${metrics.averageVelocity.toFixed(1)}</div>
              </div>
              <div class="metric">
                <h3>Consensus Rate</h3>
                <div class="value">${metrics.consensusRate.toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Recent Sessions</h2>
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Story Points</th>
                  <th>Stories Completed</th>
                </tr>
              </thead>
              <tbody>
                ${velocityData.slice(0, 10).map(v => `
                  <tr>
                    <td>${v.sessionName}</td>
                    <td>${new Date(v.date).toLocaleDateString()}</td>
                    <td>${v.storyPoints}</td>
                    <td>${v.storiesCompleted}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }

  // Mock data methods for fallback when API is not available
  private static getDefaultMetrics(): SessionMetrics {
    return {
      totalSessions: 0,
      totalStories: 0,
      averageVelocity: 0,
      consensusRate: 0,
      averageEstimation: 0,
      participantEngagement: 0
    };
  }

  private static getMockSessions(): any[] {
    return [
      { sys_id: '1', name: 'Sprint 24 Planning', sys_created_on: '2025-10-01', total_story_points: 34, story_count: 8 },
      { sys_id: '2', name: 'Epic Estimation', sys_created_on: '2025-10-15', total_story_points: 55, story_count: 12 },
      { sys_id: '3', name: 'Backlog Refinement', sys_created_on: '2025-10-20', total_story_points: 21, story_count: 6 }
    ];
  }

  private static getMockVelocityData(): VelocityData[] {
    return [
      { sessionName: 'Sprint 24 Planning', date: '2025-10-01', storyPoints: 34, storiesCompleted: 8, sessionId: '1' },
      { sessionName: 'Epic Estimation', date: '2025-10-15', storyPoints: 55, storiesCompleted: 12, sessionId: '2' },
      { sessionName: 'Backlog Refinement', date: '2025-10-20', storyPoints: 21, storiesCompleted: 6, sessionId: '3' }
    ];
  }

  private static getMockConsensusData(): ConsensusData[] {
    return [
      {
        sessionId: '1', sessionName: 'Sprint 24 Planning', storyTitle: 'User Authentication',
        consensusAchieved: true, votingRounds: 1, finalEstimate: 5, variance: 0, participantCount: 6
      },
      {
        sessionId: '1', sessionName: 'Sprint 24 Planning', storyTitle: 'Dashboard UI',
        consensusAchieved: false, votingRounds: 2, finalEstimate: 8, variance: 2.3, participantCount: 6
      }
    ];
  }

  private static getMockEstimationTrends(): EstimationTrend[] {
    return [
      { date: '2025-10-01', averageEstimate: 4.2, complexity: 'Medium', sessionCount: 1, storyCount: 8 },
      { date: '2025-10-08', averageEstimate: 6.1, complexity: 'Medium', sessionCount: 2, storyCount: 15 },
      { date: '2025-10-15', averageEstimate: 3.8, complexity: 'Low', sessionCount: 1, storyCount: 6 }
    ];
  }
}