import React from 'react';
import { GlassPanel } from './ui/GlassPanel';
import './ConsensusChart.css';

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

interface ConsensusChartProps {
  data: ConsensusData[];
  height?: number;
}

export const ConsensusChart: React.FC<ConsensusChartProps> = ({ 
  data, 
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="consensus-chart empty" style={{ height }}>
        <div className="empty-state">
          <p>No consensus data available</p>
          <small>Complete some voting sessions to see consensus analysis</small>
        </div>
      </div>
    );
  }

  // Calculate consensus statistics
  const totalStories = data.length;
  const consensusStories = data.filter(d => d.consensusAchieved).length;
  const consensusRate = (consensusStories / totalStories) * 100;
  
  // Group by voting rounds
  const roundsData = data.reduce((acc, item) => {
    const rounds = item.votingRounds;
    if (!acc[rounds]) {
      acc[rounds] = { count: 0, consensus: 0 };
    }
    acc[rounds].count++;
    if (item.consensusAchieved) {
      acc[rounds].consensus++;
    }
    return acc;
  }, {} as Record<number, { count: number; consensus: number }>);

  const maxRounds = Math.max(...Object.keys(roundsData).map(Number));
  const maxCount = Math.max(...Object.values(roundsData).map(d => d.count));

  // Calculate average variance for stories without consensus
  const noConsensusStories = data.filter(d => !d.consensusAchieved);
  const avgVariance = noConsensusStories.length > 0 
    ? noConsensusStories.reduce((sum, d) => sum + d.variance, 0) / noConsensusStories.length 
    : 0;

  return (
    <GlassPanel>
      <div className="consensus-chart" style={{ height }}>
      {/* Summary Cards */}
      <div className="consensus-summary">
        <div className="summary-card consensus-rate">
          <div className="summary-value">{consensusRate.toFixed(1)}%</div>
          <div className="summary-label">Consensus Rate</div>
        </div>
        <div className="summary-card avg-rounds">
          <div className="summary-value">
            {(data.reduce((sum, d) => sum + d.votingRounds, 0) / data.length).toFixed(1)}
          </div>
          <div className="summary-label">Avg Rounds</div>
        </div>
        <div className="summary-card variance">
          <div className="summary-value">{avgVariance.toFixed(1)}</div>
          <div className="summary-label">Avg Variance</div>
        </div>
      </div>

      {/* Consensus by Rounds Chart */}
      <div className="rounds-chart">
        <h4>Consensus by Voting Rounds</h4>
        <div className="chart-container">
          <div className="y-axis">
            <div className="y-axis-label top">{maxCount}</div>
            <div className="y-axis-label middle">{Math.round(maxCount / 2)}</div>
            <div className="y-axis-label bottom">0</div>
          </div>
          
          <div className="chart-area">
            <div className="chart-grid">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid-line" style={{ 
                  bottom: `${(i * 20)}%` 
                }}></div>
              ))}
            </div>
            
            <div className="chart-bars">
              {[...Array(maxRounds)].map((_, index) => {
                const round = index + 1;
                const roundData = roundsData[round] || { count: 0, consensus: 0 };
                const totalHeight = (roundData.count / maxCount) * 100;
                const consensusHeight = (roundData.consensus / maxCount) * 100;
                const noConsensusHeight = totalHeight - consensusHeight;

                return (
                  <div key={round} className="bar-group">
                    <div className="bar-container">
                      <div 
                        className="bar no-consensus"
                        style={{ height: `${noConsensusHeight}%` }}
                        title={`${roundData.count - roundData.consensus} stories without consensus`}
                      ></div>
                      <div 
                        className="bar consensus"
                        style={{ height: `${consensusHeight}%` }}
                        title={`${roundData.consensus} stories with consensus`}
                      ></div>
                    </div>
                    <div className="bar-label">Round {round}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color consensus"></div>
            <span>Consensus Achieved</span>
          </div>
          <div className="legend-item">
            <div className="legend-color no-consensus"></div>
            <span>No Consensus</span>
          </div>
        </div>
      </div>

      {/* Consensus Rate Gauge */}
      <div className="consensus-gauge">
        <h4>Consensus Health</h4>
        <div className="gauge-container">
          <div className="gauge">
            <div 
              className="gauge-fill"
              style={{ 
                transform: `rotate(${(consensusRate / 100) * 180 - 90}deg)` 
              }}
            ></div>
            <div className="gauge-center">
              <div className="gauge-value">{consensusRate.toFixed(0)}%</div>
              <div className="gauge-label">Consensus</div>
            </div>
          </div>
          <div className="gauge-scale">
            <span className="scale-low">0%</span>
            <span className="scale-mid">50%</span>
            <span className="scale-high">100%</span>
          </div>
        </div>
        
        <div className="consensus-insights">
          {consensusRate >= 80 && (
            <div className="insight excellent">
              🎯 <strong>Excellent!</strong> High consensus rate indicates strong team alignment
            </div>
          )}
          {consensusRate >= 60 && consensusRate < 80 && (
            <div className="insight good">
              👍 <strong>Good!</strong> Decent consensus rate with room for improvement
            </div>
          )}
          {consensusRate < 60 && (
            <div className="insight needs-improvement">
              🤔 <strong>Consider:</strong> Story breakdown or estimation training to improve alignment
            </div>
          )}
        </div>
      </div>

      {/* Recent Stories Analysis */}
      <div className="recent-stories">
        <h4>Recent Consensus Analysis</h4>
        <div className="stories-list">
          {data.slice(0, 5).map((story, index) => (
            <div key={index} className={`story-item ${story.consensusAchieved ? 'consensus' : 'no-consensus'}`}>
              <div className="story-info">
                <div className="story-title">{story.storyTitle}</div>
                <div className="story-session">{story.sessionName}</div>
              </div>
              <div className="story-metrics">
                <div className="metric">
                  <span className="metric-label">Rounds:</span>
                  <span className="metric-value">{story.votingRounds}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Estimate:</span>
                  <span className="metric-value">{story.finalEstimate}</span>
                </div>
                {!story.consensusAchieved && (
                  <div className="metric">
                    <span className="metric-label">Variance:</span>
                    <span className="metric-value">{story.variance.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="story-status">
                {story.consensusAchieved ? (
                  <span className="status-badge success">✅ Consensus</span>
                ) : (
                  <span className="status-badge warning">⚠️ No Consensus</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </GlassPanel>
  );
};