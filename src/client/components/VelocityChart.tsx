import React from 'react';
import { GlassPanel } from './ui/GlassPanel';
import './VelocityChart.css';

interface VelocityData {
  sessionName: string;
  date: string;
  storyPoints: number;
  storiesCompleted: number;
}

interface VelocityChartProps {
  data: VelocityData[];
  height?: number;
}

export const VelocityChart: React.FC<VelocityChartProps> = ({ 
  data, 
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="velocity-chart empty" style={{ height }}>
        <div className="empty-state">
          <p>No velocity data available</p>
          <small>Complete some planning sessions to see velocity trends</small>
        </div>
      </div>
    );
  }

  const maxStoryPoints = Math.max(...data.map(d => d.storyPoints));
  const maxStories = Math.max(...data.map(d => d.storiesCompleted));
  const chartHeight = height - 80; // Leave space for labels

  return (
    <GlassPanel>
      <div className="velocity-chart" style={{ height }}>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color story-points"></div>
          <span>Story Points</span>
        </div>
        <div className="legend-item">
          <div className="legend-color stories-completed"></div>
          <span>Stories Completed</span>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="y-axis">
          <div className="y-axis-label top">{maxStoryPoints}</div>
          <div className="y-axis-label middle">{Math.round(maxStoryPoints / 2)}</div>
          <div className="y-axis-label bottom">0</div>
        </div>
        
        <div className="chart-area">
          <div className="chart-grid">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid-line" style={{ 
                bottom: `${(i * 25)}%` 
              }}></div>
            ))}
          </div>
          
          <div className="chart-bars">
            {data.map((item, index) => {
              const storyPointsHeight = (item.storyPoints / maxStoryPoints) * chartHeight;
              const storiesHeight = (item.storiesCompleted / maxStories) * chartHeight;
              
              return (
                <div key={index} className="bar-group">
                  <div className="bar-container">
                    <div 
                      className="bar story-points"
                      style={{ height: `${storyPointsHeight}px` }}
                      title={`${item.storyPoints} story points`}
                    >
                      <div className="bar-value">{item.storyPoints}</div>
                    </div>
                    <div 
                      className="bar stories-completed"
                      style={{ height: `${storiesHeight}px` }}
                      title={`${item.storiesCompleted} stories`}
                    >
                      <div className="bar-value">{item.storiesCompleted}</div>
                    </div>
                  </div>
                  <div className="bar-label">
                    <div className="session-name">{item.sessionName}</div>
                    <div className="session-date">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="chart-insights">
        <div className="insight">
          <strong>Avg Velocity:</strong> {
            (data.reduce((sum, d) => sum + d.storyPoints, 0) / data.length).toFixed(1)
          } points
        </div>
        <div className="insight">
          <strong>Total Stories:</strong> {
            data.reduce((sum, d) => sum + d.storiesCompleted, 0)
          }
        </div>
        <div className="insight">
          <strong>Trend:</strong> {
            (() => {
              if (data.length < 2) return 'Stable';
              const recent = data.slice(-2)[1].storyPoints;
              const previous = data.slice(-2)[0].storyPoints;
              if (recent > previous * 1.1) return '📈 Increasing';
              if (recent < previous * 0.9) return '📉 Decreasing';
              return '➡️ Stable';
            })()
          }
        </div>
      </div>
    </div>
    </GlassPanel>
  );
};