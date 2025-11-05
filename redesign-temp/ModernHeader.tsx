import React from 'react';
import { useTheme } from './ThemeProvider';
import styled from '@emotion/styled';
import { ThemeColors } from './theme.config';

interface ModernHeaderProps {
  title?: string;
  subtitle?: string;
  showThemeToggle?: boolean;
  actions?: React.ReactNode;
}

interface HeaderContainerProps {
  theme: ThemeColors;
  mode: 'dark' | 'light';
}

const HeaderContainer = styled.header<HeaderContainerProps>`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${props => props.theme.glassBg};
  backdrop-filter: blur(${props => props.theme.glassBlur});
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 20px 32px;
  
  ${props => props.mode === 'dark' && `
    box-shadow: 0 4px 24px rgba(0, 217, 255, 0.08),
                inset 0 -1px 0 rgba(0, 217, 255, 0.1);
  `}
  
  ${props => props.mode === 'light' && `
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  `}
  
  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeaderTitle = styled.h1<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  
  ${props => props.mode === 'dark' ? `
    background: linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
  ` : `
    background: linear-gradient(135deg, #0066cc 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const HeaderSubtitle = styled.p<{ theme: ThemeColors }>`
  margin: 0;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  font-weight: 500;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const ThemeToggle = styled.button<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  position: relative;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  border-radius: 24px;
  width: 56px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    ${props => props.mode === 'dark' && `
      box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
    `}
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.mode === 'dark' ? '26px' : '2px'};
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    ${props => props.mode === 'dark' ? `
      background: linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%);
      box-shadow: 0 0 15px rgba(0, 217, 255, 0.6),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2);
    ` : `
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.1);
    `}
  }
  
  &::after {
    content: '${props => props.mode === 'dark' ? '🌙' : '☀️'}';
    position: absolute;
    font-size: 14px;
    top: 50%;
    left: ${props => props.mode === 'dark' ? '8px' : '32px'};
    transform: translateY(-50%);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`;

const IconButton = styled.button<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${props => props.theme.surfaceHover};
    border-color: ${props => props.theme.primary};
    transform: scale(1.05);
    
    ${props => props.mode === 'dark' && `
      box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
    `}
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  
  ${props => props.mode === 'dark' && `
    filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.5));
  `}
`;

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title = 'Planning Poker',
  subtitle,
  showThemeToggle = true,
  actions
}) => {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <HeaderContainer theme={theme} mode={mode}>
      <HeaderContent>
        <HeaderLeft>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo theme={theme} mode={mode}>
              🎴
            </Logo>
            <div>
              <HeaderTitle theme={theme} mode={mode}>
                {title}
              </HeaderTitle>
              {subtitle && (
                <HeaderSubtitle theme={theme}>
                  {subtitle}
                </HeaderSubtitle>
              )}
            </div>
          </div>
        </HeaderLeft>

        <HeaderRight>
          {actions && (
            <ActionGroup>
              {actions}
            </ActionGroup>
          )}
          
          {showThemeToggle && (
            <ThemeToggle
              theme={theme}
              mode={mode}
              onClick={toggleTheme}
              aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            />
          )}
        </HeaderRight>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default ModernHeader;
