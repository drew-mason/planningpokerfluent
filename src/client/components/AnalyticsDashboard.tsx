import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Award, FileText, BarChart2, Target, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnalyticsService } from '../services';
import { VelocityChart } from './VelocityChart';
import { ConsensusChart } from './ConsensusChart';
import { GlassPanel } from './ui/GlassPanel';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { MetricCard } from './ui/MetricCard';
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
      toast.success(`Exporting ${format.toUpperCase()} report...`);
    } catch (err) {
      toast.error('Failed to export report');
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
      <div className="min-h-screen flex items-center justify-center">
        <GlassPanel className="flex flex-col items-center gap-4 p-8">
          <LoadingSpinner size="lg" />
          <h3 className="text-xl font-semibold text-text">Loading Analytics...</h3>
          <p className="text-text-muted">Analyzing session data</p>
        </GlassPanel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassPanel className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="text-6xl">⚠️</div>
          <h3 className="text-xl font-semibold text-text">Analytics Error</h3>
          <p className="text-text-muted">{error}</p>
          <Button variant="primary" onClick={loadAnalyticsData}>
            Retry
          </Button>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <GlassPanel>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text">Planning Poker Analytics</h1>
            <p className="text-text-muted mt-1">Track your team's estimation performance</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              id="timeRange"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="bg-surface border border-accent/30 rounded-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleExportReport('csv')}
            >
              Export
            </Button>
          </div>
        </div>
      </GlassPanel>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          icon={BarChart2}
          label="Total Sessions"
          value={metrics?.totalSessions || 0}
          subtitle="Planning sessions conducted"
          colorClass="text-blue-400"
          delay={0}
        />

        <MetricCard
          icon={FileText}
          label="Stories Estimated"
          value={metrics?.totalStories || 0}
          subtitle="User stories completed"
          colorClass="text-green-400"
          delay={0.05}
        />

        <MetricCard
          icon={TrendingUp}
          label="Average Velocity"
          value={metrics?.averageVelocity?.toFixed(1) || '0.0'}
          subtitle="Story points per session"
          trend={getVelocityTrend() === 'increasing' ? 'up' : getVelocityTrend() === 'decreasing' ? 'down' : 'stable'}
          colorClass="text-purple-400"
          delay={0.1}
        />

        <MetricCard
          icon={Target}
          label="Consensus Rate"
          value={`${metrics?.consensusRate?.toFixed(1) || '0.0'}%`}
          subtitle="First-round consensus achieved"
          colorClass="text-yellow-400"
          delay={0.15}
        />

        <MetricCard
          icon={Award}
          label="Avg Estimation"
          value={metrics?.averageEstimation?.toFixed(1) || '0.0'}
          subtitle="Story points per story"
          colorClass="text-orange-400"
          delay={0.2}
        />

        <MetricCard
          icon={Users}
          label="Participation"
          value={`${metrics?.participantEngagement?.toFixed(1) || '0.0'}%`}
          subtitle="Average voting participation"
          colorClass="text-pink-400"
          delay={0.25}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Velocity Trend</h3>
          <VelocityChart data={velocityData} height={300} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Consensus Analysis</h3>
          <ConsensusChart data={consensusData} height={300} />
        </div>
      </div>
    </div>
  );
};