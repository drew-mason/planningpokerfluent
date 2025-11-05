import React from 'react';
import { useTheme } from './ThemeProvider';
import styled from '@emotion/styled';
import { ThemeColors } from './theme.config';
import { GlassCard } from './StyledComponents';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface StatsGridProps {
  stats: AnalyticsCardProps[];
}

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled(GlassCard)<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.mode === 'dark'
      ? 'linear-gradient(180deg, #00d9ff 0%, #7b61ff 100%)'
      : 'linear-gradient(180deg, #0066cc 0%, #6366f1 100%)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatIcon = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  
  ${props => props.mode === 'dark' ? `
    background: linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(123, 97, 255, 0.2));
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  ` : `
    background: rgba(0, 102, 204, 0.1);
  `}
`;

const StatTitle = styled.div<{ theme: ThemeColors }>`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatValue = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 8px;
  
  ${props => props.mode === 'dark' ? `
    background: linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  ` : `
    color: ${props.theme.textPrimary};
  `}
`;

const StatSubtitle = styled.div<{ theme: ThemeColors }>`
  color: ${props => props.theme.textTertiary};
  font-size: 12px;
  font-weight: 500;
`;

const TrendBadge = styled.div<{ 
  theme: ThemeColors; 
  mode: 'dark' | 'light';
  trend: 'up' | 'down' | 'neutral';
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  margin-top: 8px;
  
  ${props => {
    const isUp = props.trend === 'up';
    const isDown = props.trend === 'down';
    const color = isUp ? props.theme.success : isDown ? props.theme.error : props.theme.textSecondary;
    
    return props.mode === 'dark' ? `
      background: ${color}22;
      color: ${color};
      border: 1px solid ${color}44;
    ` : `
      background: ${color}18;
      color: ${color};
      border: 1px solid ${color}33;
    `;
  }}
`;

const ChartContainer = styled(GlassCard)<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  min-height: 300px;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3<{ theme: ThemeColors }>`
  color: ${props => props.theme.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
`;

const Bar = styled.div<{ 
  theme: ThemeColors; 
  mode: 'dark' | 'light';
  height: number;
}>`
  flex: 1;
  height: ${props => props.height}%;
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  
  ${props => props.mode === 'dark' ? `
    background: linear-gradient(180deg, #00d9ff 0%, #7b61ff 100%);
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.4);
  ` : `
    background: linear-gradient(180deg, #0066cc 0%, #6366f1 100%);
  `}
  
  &:hover {
    transform: scaleY(1.05);
    ${props => props.mode === 'dark' && `
      box-shadow: 0 0 30px rgba(0, 217, 255, 0.6);
    `}
  }
`;

const BarLabel = styled.div<{ theme: ThemeColors }>`
  text-align: center;
  margin-top: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: 600;
`;

const BarValue = styled.div<{ theme: ThemeColors }>`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.theme.textPrimary};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`;

// Analytics Card Component
export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue
}) => {
  const { theme, mode } = useTheme();

  return (
    <StatCard theme={theme} mode={mode} className="fade-in">
      <StatHeader>
        <div style={{ flex: 1 }}>
          <StatTitle theme={theme}>{title}</StatTitle>
          <StatValue theme={theme} mode={mode}>{value}</StatValue>
          {subtitle && <StatSubtitle theme={theme}>{subtitle}</StatSubtitle>}
          {trend && trendValue && (
            <TrendBadge theme={theme} mode={mode} trend={trend}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </TrendBadge>
          )}
        </div>
        {icon && (
          <StatIcon theme={theme} mode={mode}>
            {icon}
          </StatIcon>
        )}
      </StatHeader>
    </StatCard>
  );
};

// Stats Grid Component
export const AnalyticsStatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <StatsGrid>
      {stats.map((stat, index) => (
        <AnalyticsCard key={index} {...stat} />
      ))}
    </StatsGrid>
  );
};

// Simple Bar Chart Component
interface BarChartData {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  title: string;
  data: BarChartData[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ title, data }) => {
  const { theme, mode } = useTheme();
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <ChartContainer theme={theme} mode={mode}>
      <ChartTitle theme={theme}>{title}</ChartTitle>
      <BarChart>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Bar 
              theme={theme} 
              mode={mode}
              height={(item.value / maxValue) * 100}
              className="scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BarValue theme={theme}>{item.value}</BarValue>
            </Bar>
            <BarLabel theme={theme}>{item.label}</BarLabel>
          </div>
        ))}
      </BarChart>
    </ChartContainer>
  );
};

// Complete Analytics Dashboard
export const AnalyticsDashboard: React.FC = () => {
  const exampleStats: AnalyticsCardProps[] = [
    {
      title: 'Total Sessions',
      value: '42',
      subtitle: 'All time',
      icon: '🎴',
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: 'Active Now',
      value: '8',
      subtitle: 'In progress',
      icon: '⚡',
      trend: 'up',
      trendValue: '+3'
    },
    {
      title: 'Avg Participants',
      value: '7.5',
      subtitle: 'Per session',
      icon: '👥',
      trend: 'neutral',
      trendValue: '±0'
    },
    {
      title: 'Stories Estimated',
      value: '284',
      subtitle: 'This month',
      icon: '✅',
      trend: 'up',
      trendValue: '+18%'
    }
  ];

  const votingDistribution: BarChartData[] = [
    { label: '1', value: 12 },
    { label: '2', value: 24 },
    { label: '3', value: 38 },
    { label: '5', value: 45 },
    { label: '8', value: 32 },
    { label: '13', value: 18 },
    { label: '21', value: 8 }
  ];

  return (
    <DashboardContainer>
      <AnalyticsStatsGrid stats={exampleStats} />
      <SimpleBarChart 
        title="📊 Voting Distribution"
        data={votingDistribution}
      />
    </DashboardContainer>
  );
};

export default AnalyticsDashboard;
