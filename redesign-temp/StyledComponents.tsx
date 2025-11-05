import styled from '@emotion/styled';
import { ThemeColors } from './theme.config';

interface ThemedProps {
  theme: ThemeColors;
  mode: 'dark' | 'light';
}

// Glass Card Component (adapts to theme)
export const GlassCard = styled.div<ThemedProps>`
  background: ${props => props.mode === 'dark' 
    ? props.theme.glassBg 
    : props.theme.glassBg};
  backdrop-filter: blur(${props => props.theme.glassBlur});
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.mode === 'dark'
      ? '0 12px 40px rgba(0, 217, 255, 0.2)'
      : '0 12px 40px rgba(0, 0, 0, 0.12)'};
    border-color: ${props => props.mode === 'dark'
      ? 'rgba(0, 217, 255, 0.3)'
      : 'rgba(99, 102, 241, 0.3)'};
  }
`;

// Neon Button (primary action)
export const NeonButton = styled.button<ThemedProps>`
  background: ${props => props.mode === 'dark'
    ? 'linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%)'
    : 'linear-gradient(135deg, #0066cc 0%, #6366f1 100%)'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.mode === 'dark' && `
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.1);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    ${props => props.mode === 'dark' && `
      box-shadow: 0 0 30px rgba(0, 217, 255, 0.6),
                  inset 0 0 30px rgba(255, 255, 255, 0.2);
    `}
    ${props => props.mode === 'light' && `
      box-shadow: 0 8px 24px rgba(0, 102, 204, 0.3);
    `}
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Ghost Button (secondary action)
export const GhostButton = styled.button<ThemedProps>`
  background: transparent;
  color: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 12px;
  padding: 10px 22px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  }
  
  &:hover {
    color: white;
    border-color: ${props => props.theme.primaryHover};
    
    &::before {
      width: 300%;
      height: 300%;
    }
  }
  
  & > span {
    position: relative;
    z-index: 1;
  }
`;

// Input with modern styling
export const ModernInput = styled.input<ThemedProps>`
  background: ${props => props.theme.surface};
  color: ${props => props.theme.textPrimary};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.mode === 'light' && `
    backdrop-filter: blur(8px);
  `}
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    ${props => props.mode === 'dark' && `
      box-shadow: 0 0 0 4px rgba(0, 217, 255, 0.1),
                  0 0 20px rgba(0, 217, 255, 0.2);
    `}
    ${props => props.mode === 'light' && `
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
    `}
  }
  
  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }
`;

// Badge component
export const StatusBadge = styled.span<ThemedProps & { status: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    const color = props.theme[props.status];
    return props.mode === 'dark' ? `
      background: ${color}22;
      color: ${color};
      border: 1px solid ${color}44;
      box-shadow: 0 0 10px ${color}33;
    ` : `
      background: ${color}18;
      color: ${color};
      border: 1px solid ${color}33;
    `;
  }}
`;

// Floating Action Button
export const FAB = styled.button<ThemedProps>`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.mode === 'dark'
    ? 'linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%)'
    : 'linear-gradient(135deg, #0066cc 0%, #6366f1 100%)'};
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: ${props => props.mode === 'dark'
    ? '0 8px 32px rgba(0, 217, 255, 0.4)'
    : '0 8px 32px rgba(0, 102, 204, 0.3)'};
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: ${props => props.mode === 'dark'
      ? '0 12px 40px rgba(0, 217, 255, 0.6)'
      : '0 12px 40px rgba(0, 102, 204, 0.4)'};
  }
  
  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

// Animated Card Grid
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

// Header with backdrop blur
export const GlassHeader = styled.header<ThemedProps>`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${props => props.theme.glassBg};
  backdrop-filter: blur(${props => props.theme.glassBlur});
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${props => props.mode === 'dark' && `
    box-shadow: 0 4px 20px rgba(0, 217, 255, 0.1);
  `}
`;

// Theme Toggle Switch
export const ThemeToggle = styled.button<ThemedProps>`
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  border-radius: 24px;
  width: 56px;
  height: 32px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.mode === 'dark'
      ? 'linear-gradient(135deg, #00d9ff 0%, #7b61ff 100%)'
      : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'};
    top: 2px;
    left: ${props => props.mode === 'dark' ? '26px' : '2px'};
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    ${props => props.mode === 'dark' && `
      box-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
    `}
  }
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

// Loading Spinner
export const Spinner = styled.div<ThemedProps>`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.border};
  border-top-color: ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  ${props => props.mode === 'dark' && `
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  `}
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
