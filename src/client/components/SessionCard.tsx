import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import styled from '@emotion/styled';
import { ThemeColors } from '../theme/theme.config';

interface SessionCardProps {
  session: {
    sys_id: string;
    session_name: string;
    session_code: string;
    status: string;
    dealer?: {
      display_value: string;
    };
    participant_count?: number;
    created?: string;
  };
  onClick?: () => void;
}

interface CardContainerProps {
  theme: ThemeColors;
  mode: 'dark' | 'light';
}

const CardContainer = styled.div<CardContainerProps>`
  background: ${props => props.mode === 'dark' 
    ? props.theme.glassBg 
    : props.theme.glassBg};
  backdrop-filter: blur(${props => props.theme.glassBlur});
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Neon glow effect on hover for dark mode */
  ${props => props.mode === 'dark' && `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, #00d9ff, #7b61ff);
      border-radius: 16px;
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
    }
  `}
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    ${props => props.mode === 'dark' && `
      box-shadow: 0 12px 40px rgba(0, 217, 255, 0.3),
                  0 0 60px rgba(123, 97, 255, 0.2);
      border-color: rgba(0, 217, 255, 0.5);
      
      &::before {
        opacity: 0.3;
        animation: pulse 2s ease-in-out infinite;
      }
    `}
    ${props => props.mode === 'light' && `
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      background: rgba(255, 255, 255, 0.85);
    `}
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const SessionTitle = styled.h3<{ theme: ThemeColors }>`
  color: ${props => props.theme.textPrimary};
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const SessionCode = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  font-family: 'Courier New', monospace;
  
  ${props => props.mode === 'dark' ? `
    background: linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(123, 97, 255, 0.2));
    color: ${props.theme.primary};
    border: 1px solid rgba(0, 217, 255, 0.3);
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  ` : `
    background: rgba(0, 102, 204, 0.1);
    color: ${props.theme.primary};
    border: 1px solid rgba(0, 102, 204, 0.2);
  `}
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoLabel = styled.span<{ theme: ThemeColors }>`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  font-weight: 500;
`;

const InfoValue = styled.span<{ theme: ThemeColors }>`
  color: ${props => props.theme.textPrimary};
  font-size: 14px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ 
  theme: ThemeColors; 
  mode: 'dark' | 'light';
  status: string;
}>`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  
  ${props => {
    let color = props.theme.info;
    if (props.status === 'active') color = props.theme.success;
    if (props.status === 'completed') color = props.theme.textSecondary;
    if (props.status === 'cancelled') color = props.theme.error;
    
    return props.mode === 'dark' ? `
      background: ${color}22;
      color: ${color};
      border: 1px solid ${color}44;
      box-shadow: 0 0 15px ${color}33;
    ` : `
      background: ${color}18;
      color: ${color};
      border: 1px solid ${color}33;
    `;
  }}
`;

const ParticipantCount = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  
  ${props => props.mode === 'dark' && `
    background: rgba(0, 217, 255, 0.05);
    border-color: rgba(0, 217, 255, 0.2);
  `}
`;

const ParticipantIcon = styled.span<{ theme: ThemeColors }>`
  font-size: 16px;
  color: ${props => props.theme.primary};
`;

const CardFooter = styled.div<{ theme: ThemeColors }>`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid;
  border-color: ${props => props.theme.divider};
`;

const CreatedDate = styled.span<{ theme: ThemeColors }>`
  color: ${props => props.theme.textTertiary};
  font-size: 12px;
`;

export const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  const { theme, mode } = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <CardContainer 
      theme={theme} 
      mode={mode}
      onClick={onClick}
      className="fade-in"
    >
      <CardHeader>
        <div>
          <SessionTitle theme={theme}>
            {session.session_name || 'Untitled Session'}
          </SessionTitle>
          <SessionCode theme={theme} mode={mode}>
            {session.session_code}
          </SessionCode>
        </div>
        <StatusBadge theme={theme} mode={mode} status={session.status}>
          {session.status || 'draft'}
        </StatusBadge>
      </CardHeader>

      <CardBody>
        {session.dealer && (
          <InfoRow>
            <InfoLabel theme={theme}>Dealer:</InfoLabel>
            <InfoValue theme={theme}>
              {session.dealer.display_value}
            </InfoValue>
          </InfoRow>
        )}

        {session.participant_count !== undefined && (
          <ParticipantCount theme={theme} mode={mode}>
            <ParticipantIcon theme={theme}>👥</ParticipantIcon>
            <InfoValue theme={theme}>
              {session.participant_count} participant{session.participant_count !== 1 ? 's' : ''}
            </InfoValue>
          </ParticipantCount>
        )}
      </CardBody>

      <CardFooter theme={theme}>
        <CreatedDate theme={theme}>
          Created {formatDate(session.created)}
        </CreatedDate>
      </CardFooter>
    </CardContainer>
  );
};

export default SessionCard;
