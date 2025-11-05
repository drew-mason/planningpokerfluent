import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import styled from '@emotion/styled';
import { ThemeColors } from './theme.config';
import { keyframes } from '@emotion/react';

interface VotingCardProps {
  value: string | number;
  isSelected?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const flipIn = keyframes`
  from {
    transform: rotateY(-90deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotateY(0) scale(1);
    opacity: 1;
  }
`;

const flipReveal = keyframes`
  0% {
    transform: rotateY(0);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.4),
                0 0 40px rgba(0, 217, 255, 0.2),
                inset 0 0 20px rgba(0, 217, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 217, 255, 0.6),
                0 0 60px rgba(0, 217, 255, 0.3),
                inset 0 0 30px rgba(0, 217, 255, 0.2);
  }
`;

interface CardProps {
  theme: ThemeColors;
  mode: 'dark' | 'light';
  isSelected: boolean;
  isRevealed: boolean;
  disabled: boolean;
}

const Card = styled.div<CardProps>`
  position: relative;
  width: 100px;
  height: 140px;
  border-radius: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: ${flipIn} 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  ${props => !props.disabled && `
    &:hover {
      transform: translateY(-12px) scale(1.05);
    }
    
    &:active {
      transform: translateY(-6px) scale(0.98);
    }
  `}
  
  ${props => props.isRevealed && `
    animation: ${flipReveal} 0.6s ease-in-out;
  `}
  
  ${props => props.disabled && `
    opacity: 0.5;
  `}
`;

const CardFront = styled.div<CardProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  
  ${props => props.mode === 'dark' ? `
    background: ${props.isSelected 
      ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.3), rgba(123, 97, 255, 0.3))'
      : props.theme.glassBg};
    backdrop-filter: blur(${props.theme.glassBlur});
    border: 2px solid ${props.isSelected 
      ? 'rgba(0, 217, 255, 0.6)' 
      : props.theme.border};
    
    ${props.isSelected ? `
      animation: ${glowPulse} 2s ease-in-out infinite;
    ` : ''}
  ` : `
    background: ${props.isSelected
      ? 'linear-gradient(135deg, rgba(0, 102, 204, 0.15), rgba(99, 102, 241, 0.15))'
      : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(10px);
    border: 2px solid ${props.isSelected
      ? props.theme.primary
      : props.theme.border};
    box-shadow: ${props.isSelected
      ? '0 8px 32px rgba(0, 102, 204, 0.2)'
      : '0 4px 16px rgba(0, 0, 0, 0.05)'};
  `}
`;

const CardValue = styled.span<{ theme: ThemeColors; mode: 'dark' | 'light'; isSelected: boolean }>`
  font-size: 48px;
  font-weight: 800;
  
  ${props => props.mode === 'dark' ? `
    background: ${props.isSelected
      ? 'linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%)'
      : 'linear-gradient(135deg, #b0b0c0 0%, #808090 100%)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    ${props.isSelected ? `
      filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.8));
    ` : ''}
  ` : `
    color: ${props.isSelected ? props.theme.primary : props.theme.textPrimary};
  `}
`;

const SelectionIndicator = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  animation: ${flipIn} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  ${props => props.mode === 'dark' ? `
    background: linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%);
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
  ` : `
    background: linear-gradient(135deg, #0066cc 0%, #6366f1 100%);
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
  `}
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CardLabel = styled.span<{ theme: ThemeColors }>`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const VotingCard: React.FC<VotingCardProps> = ({
  value,
  isSelected = false,
  isRevealed = false,
  onClick,
  disabled = false
}) => {
  const { theme, mode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContainer>
      <Card
        theme={theme}
        mode={mode}
        isSelected={isSelected}
        isRevealed={isRevealed}
        disabled={disabled}
        onClick={!disabled ? onClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardFront
          theme={theme}
          mode={mode}
          isSelected={isSelected}
          isRevealed={isRevealed}
          disabled={disabled}
        >
          <CardValue theme={theme} mode={mode} isSelected={isSelected}>
            {value}
          </CardValue>
          {isSelected && (
            <SelectionIndicator theme={theme} mode={mode}>
              ✓
            </SelectionIndicator>
          )}
        </CardFront>
      </Card>
      {isHovered && !disabled && (
        <CardLabel theme={theme} className="fade-in">
          {isSelected ? 'Selected' : 'Click to vote'}
        </CardLabel>
      )}
    </CardContainer>
  );
};

// Voting deck component with all cards
interface VotingDeckProps {
  values: (string | number)[];
  selectedValue?: string | number;
  onVote: (value: string | number) => void;
  isRevealed?: boolean;
  disabled?: boolean;
}

const DeckContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 24px;
  
  @media (max-width: 768px) {
    gap: 12px;
    padding: 16px;
  }
`;

export const VotingDeck: React.FC<VotingDeckProps> = ({
  values,
  selectedValue,
  onVote,
  isRevealed = false,
  disabled = false
}) => {
  return (
    <DeckContainer>
      {values.map((value, index) => (
        <VotingCard
          key={`${value}-${index}`}
          value={value}
          isSelected={selectedValue === value}
          isRevealed={isRevealed}
          onClick={() => onVote(value)}
          disabled={disabled}
        />
      ))}
    </DeckContainer>
  );
};

export default VotingCard;
