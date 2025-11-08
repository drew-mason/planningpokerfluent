import React from 'react'
import { motion } from 'framer-motion'
import { useSound } from '../../providers/SoundProvider'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
  loading?: boolean
  soundEnabled?: boolean
}

/**
 * Button - Reusable button component with sound effects and animations
 *
 * Features:
 * - Four variants: primary (voltron-button), secondary, ghost, danger
 * - Three sizes: sm, md, lg
 * - Optional icon support
 * - Loading state with spinner
 * - Sound effects on click (opt-out with soundEnabled={false})
 * - Framer Motion hover/tap animations
 *
 * Part of Phase 3 GUI migration
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  onClick,
  disabled = false,
  loading = false,
  soundEnabled = true,
  ...props
}) => {
  const { play } = useSound()

  const baseClasses = 'rounded-lg font-medium transition-all flex items-center gap-2 justify-center disabled:opacity-60 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'voltron-button',
    secondary: 'border border-accent text-accent hover:bg-accent-muted',
    ghost: 'hover:bg-accent-muted text-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      if (soundEnabled) {
        play('cardSelect')
      }
      onClick?.(e)
    }
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  )
}
