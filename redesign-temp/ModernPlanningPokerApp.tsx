import React, { useState } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ModernHeader } from './ModernHeader';
import { SessionCard } from './SessionCard';
import { VotingDeck } from './VotingCard';
import { 
  NeonButton, 
  GhostButton, 
  GlassCard, 
  CardGrid,
  FAB,
  ModernInput,
  StatusBadge 
} from './StyledComponents';
import { useTheme } from './ThemeProvider';
import styled from '@emotion/styled';
import './modern-styles.css';

// Example container component
const AppContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
`;

const Section = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const SectionTitle = styled.h2<{ theme: any }>`
  color: ${props => props.theme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
`;

const DemoControls = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const InfoCard = styled(GlassCard)`
  margin-bottom: 24px;
`;

const InfoText = styled.p<{ theme: any }>`
  color: ${props => props.theme.textSecondary};
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
`;

// Main demo component
const ModernUIDemo: React.FC = () => {
  const { theme, mode } = useTheme();
  const [selectedVote, setSelectedVote] = useState<string | number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  // Example session data
  const exampleSessions = [
    {
      sys_id: '1',
      session_name: 'Sprint 24 Planning',
      session_code: 'ABC123',
      status: 'active',
      dealer: { display_value: 'John Doe' },
      participant_count: 8,
      created: '2025-11-01'
    },
    {
      sys_id: '2',
      session_name: 'Q4 Roadmap Estimation',
      session_code: 'XYZ789',
      status: 'draft',
      dealer: { display_value: 'Jane Smith' },
      participant_count: 5,
      created: '2025-11-02'
    },
    {
      sys_id: '3',
      session_name: 'Feature Refinement',
      session_code: 'DEF456',
      status: 'completed',
      dealer: { display_value: 'Bob Johnson' },
      participant_count: 12,
      created: '2025-10-28'
    }
  ];

  // Fibonacci voting values
  const votingValues = [1, 2, 3, 5, 8, 13, 21, '?'];

  return (
    <AppContainer>
      <ModernHeader
        title="Planning Poker"
        subtitle="Ultra Modern UI Demo"
        showThemeToggle={true}
        actions={
          <>
            <NeonButton theme={theme} mode={mode} onClick={() => alert('Create Session!')}>
              + New Session
            </NeonButton>
          </>
        }
      />

      <Section>
        <InfoCard theme={theme} mode={mode}>
          <SectionTitle theme={theme}>
            ✨ Welcome to Modern Planning Poker
          </SectionTitle>
          <InfoText theme={theme}>
            Experience the next generation of agile estimation with dark/neon mode and light/glassmorphism themes. 
            Toggle the theme in the header to see the transformation!
          </InfoText>
        </InfoCard>

        <SectionTitle theme={theme}>🔍 Search Sessions</SectionTitle>
        <ModernInput
          theme={theme}
          mode={mode}
          type="text"
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Section>

      <Section>
        <SectionTitle theme={theme}>📋 Active Sessions</SectionTitle>
        <CardGrid>
          {exampleSessions.map(session => (
            <SessionCard
              key={session.sys_id}
              session={session}
              onClick={() => alert(`Opening ${session.session_name}`)}
            />
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle theme={theme}>🎴 Voting Interface</SectionTitle>
        <GlassCard theme={theme} mode={mode}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: theme.textPrimary, 
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: 600
            }}>
              Story: Implement user authentication
            </h3>
            <InfoText theme={theme}>
              Cast your vote by selecting a card below
            </InfoText>
          </div>
          
          <VotingDeck
            values={votingValues}
            selectedValue={selectedVote}
            onVote={(value) => {
              setSelectedVote(value);
              console.log('Voted:', value);
            }}
            isRevealed={false}
            disabled={false}
          />

          {selectedVote && (
            <div style={{ 
              marginTop: '24px', 
              display: 'flex', 
              gap: '12px',
              justifyContent: 'center'
            }}>
              <NeonButton 
                theme={theme} 
                mode={mode}
                onClick={() => alert(`Submitted vote: ${selectedVote}`)}
              >
                Submit Vote
              </NeonButton>
              <GhostButton
                theme={theme}
                mode={mode}
                onClick={() => setSelectedVote(undefined)}
              >
                <span>Clear</span>
              </GhostButton>
            </div>
          )}
        </GlassCard>
      </Section>

      <Section>
        <SectionTitle theme={theme}>🎨 UI Components Showcase</SectionTitle>
        
        <DemoControls>
          <NeonButton theme={theme} mode={mode}>
            Primary Action
          </NeonButton>
          <GhostButton theme={theme} mode={mode}>
            <span>Secondary Action</span>
          </GhostButton>
          <NeonButton theme={theme} mode={mode} disabled>
            Disabled Button
          </NeonButton>
        </DemoControls>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <StatusBadge theme={theme} mode={mode} status="success">
            Success
          </StatusBadge>
          <StatusBadge theme={theme} mode={mode} status="warning">
            Warning
          </StatusBadge>
          <StatusBadge theme={theme} mode={mode} status="error">
            Error
          </StatusBadge>
          <StatusBadge theme={theme} mode={mode} status="info">
            Info
          </StatusBadge>
        </div>

        <GlassCard theme={theme} mode={mode} className="hover-lift">
          <SectionTitle theme={theme}>Interactive Glass Card</SectionTitle>
          <InfoText theme={theme}>
            Hover over this card to see the smooth lift animation and glow effects. 
            The glassmorphism effect adapts beautifully to both light and dark themes.
          </InfoText>
        </GlassCard>
      </Section>

      <FAB 
        theme={theme} 
        mode={mode}
        onClick={() => alert('Quick Action!')}
        title="Quick Action"
      >
        +
      </FAB>
    </AppContainer>
  );
};

// Root app with theme provider
export const ModernPlanningPokerApp: React.FC = () => {
  return (
    <ThemeProvider defaultMode="dark">
      <ModernUIDemo />
    </ThemeProvider>
  );
};

export default ModernPlanningPokerApp;
