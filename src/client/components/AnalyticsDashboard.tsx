import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../services';
import { VelocityChart } from './VelocityChart';
import { ConsensusChart } from './ConsensusChart';
import './AnalyticsDashboard.css';

interface SessionMetrics {
  totalSessions: number;
  totalStories: number;
  averageVelocity: number;
  consensusRate: number;
  averageEstimation: number;
  participantEngagement: number;
}

interface VelocityData {
  sessionName: string;
  date: string;
  storyPoints: number;
  storiesCompleted: number;
}

interface ConsensusData {
  sessionId: string;
  sessionName: string;
  storyTitle: string;
  consensusAchieved: boolean;
  votingRounds: number;
  finalEstimate: number;
  variance: number;
  participantCount: number;
}

interface EstimationTrend {
  date: string;
  averageEstimate: number;
  complexity: 'Low' | 'Medium' | 'High';
  sessionCount: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [consensusData, setConsensusData] = useState<ConsensusData[]>([]);
  const [estimationTrends, setEstimationTrends] = useState<EstimationTrend[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load overall metrics
      const metricsData = await AnalyticsService.getSessionMetrics(selectedTimeRange);
      setMetrics(metricsData);

      // Load velocity data for charts
      const velocity = await AnalyticsService.getVelocityData(selectedTimeRange);
      setVelocityData(velocity);

      // Load consensus analysis
      const consensus = await AnalyticsService.getConsensusAnalysis(selectedTimeRange);
      setConsensusData(consensus);

      // Load estimation trends
      const trends = await AnalyticsService.getEstimationTrends(selectedTimeRange);
      setEstimationTrends(trends);

    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'csv') => {
    try {
      await AnalyticsService.exportReport(format, selectedTimeRange);
    } catch (err) {
      setError('Failed to export report');
      console.error('Export error:', err);
    }
  };

  const getConsensusRateColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  };

  const getVelocityTrend = () => {
    if (velocityData.length < 2) return 'stable';
    const recent = velocityData.slice(-3).reduce((sum, d) => sum + d.storyPoints, 0) / 3;
    const previous = velocityData.slice(-6, -3).reduce((sum, d) => sum + d.storyPoints, 0) / 3;
    
    if (recent > previous * 1.1) return 'increasing';
    if (recent < previous * 0.9) return 'decreasing';
    return 'stable';
  };

  if (isLoading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard error">
        <div className="error-message">
          <h3>Analytics Error</h3>
          <p>{error}</p>
          <button onClick={loadAnalyticsData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Planning Poker Analytics</h1>
        <div className="analytics-controls">
          <div className="time-range-selector">
            <label htmlFor="timeRange">Time Range:</label>
            <select
              id="timeRange"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div className="export-controls">
            <button 
              onClick={() => handleExportReport('pdf')}
              className="export-button pdf"
            >
              Export PDF
            </button>
            <button 
              onClick={() => handleExportReport('csv')}
              className="export-button csv"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon sessions"></div>
          <div className="metric-content">
            <h3>Total Sessions</h3>
            <div className="metric-value">{metrics?.totalSessions || 0}</div>
            <div className="metric-subtitle">Planning sessions conducted</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon stories"></div>
          <div className="metric-content">
            <h3>Stories Estimated</h3>
            <div className="metric-value">{metrics?.totalStories || 0}</div>
            <div className="metric-subtitle">User stories completed</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon velocity"></div>
          <div className="metric-content">
            <h3>Average Velocity</h3>
            <div className="metric-value">{metrics?.averageVelocity?.toFixed(1) || '0.0'}</div>
            <div className="metric-subtitle">
              Story points per session
              <span className={`trend ${getVelocityTrend()}`}>
                {getVelocityTrend() === 'increasing' && '↗️'}
                {getVelocityTrend() === 'decreasing' && '↘️'}
                {getVelocityTrend() === 'stable' && '→'}
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon consensus"></div>
          <div className="metric-content">
            <h3>Consensus Rate</h3>
            <div className="metric-value">
              <span className={getConsensusRateColor(metrics?.consensusRate || 0)}>
                {metrics?.consensusRate?.toFixed(1) || '0.0'}%
              </span>
            </div>
            <div className="metric-subtitle">First-round consensus achieved</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon estimation"></div>
          <div className="metric-content">
            <h3>Avg Estimation</h3>
            <div className="metric-value">{metrics?.averageEstimation?.toFixed(1) || '0.0'}</div>
            <div className="metric-subtitle">Story points per story</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon engagement"></div>
          <div className="metric-content">
            <h3>Participation</h3>
            <div className="metric-value">{metrics?.participantEngagement?.toFixed(1) || '0.0'}%</div>
            <div className="metric-subtitle">Average voting participation</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-container velocity-chart">
            <h3>Velocity Trend</h3>
            <VelocityChart data={velocityData} height={300} />
          </div>

          <div className="chart-container consensus-chart">
            <h3>Consensus Analysis</h3>
            <ConsensusChart data={consensusData} height={300} />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-container estimation-chart">
            <h3>Estimation Distribution</h3>
            <div className="chart-placeholder">
              <p>Estimation distribution chart will be rendered here</p>
              <small>Frequency of different story point values</small>
            </div>
          </div>

          <div className="chart-container complexity-chart">
            <h3>Story Complexity Trends</h3>
            <div className="chart-placeholder">
              <p>Complexity trend chart will be rendered here</p>
              <small>Low, Medium, High complexity stories over time</small>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="tables-section">
        <div className="table-container">
          <h3>Recent Sessions</h3>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Stories</th>
                  <th>Velocity</th>
                  <th>Consensus Rate</th>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                {velocityData.slice(0, 10).map((session, index) => (
                  <tr key={index}>
                    <td>{session.sessionName}</td>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>{session.storiesCompleted}</td>
                    <td>{session.storyPoints}</td>
                    <td>
                      <span className={getConsensusRateColor(75)}>75%</span>
                    </td>
                    <td>5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <h3>Consensus Breakdown</h3>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Story</th>
                  <th>Session</th>
                  <th>Consensus</th>
                  <th>Rounds</th>
                  <th>Final Estimate</th>
                  <th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {consensusData.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td>{item.storyTitle}</td>
                    <td>{item.sessionName}</td>
                    <td>
                      <span className={item.consensusAchieved ? 'success' : 'danger'}>
                        {item.consensusAchieved ? '✅ Yes' : '❌ No'}
                      </span>
                    </td>
                    <td>{item.votingRounds}</td>
                    <td>{item.finalEstimate}</td>
                    <td>{item.variance?.toFixed(1) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🎯 Estimation Accuracy</h4>
            <p>
              Your team achieves consensus on <strong>{metrics?.consensusRate?.toFixed(1)}%</strong> of stories 
              in the first round, indicating good alignment on story complexity.
            </p>
          </div>
          
          <div className="insight-card">
            <h4>📈 Velocity Trend</h4>
            <p>
              Average velocity is <strong>{metrics?.averageVelocity?.toFixed(1)} story points</strong> per session, 
              with a {getVelocityTrend()} trend over recent sessions.
            </p>
          </div>
          
          <div className="insight-card">
            <h4>👥 Team Engagement</h4>
            <p>
              Participation rate is <strong>{metrics?.participantEngagement?.toFixed(1)}%</strong>, 
              showing good team involvement in estimation sessions.
            </p>
          </div>
          
          <div className="insight-card">
            <h4>📊 Story Complexity</h4>
            <p>
              Average estimation is <strong>{metrics?.averageEstimation?.toFixed(1)} points</strong> per story, 
              suggesting balanced story sizing in your backlog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};