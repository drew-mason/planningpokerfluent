import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { GlassPanel } from './GlassPanel'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'stable'
  colorClass?: string
  delay?: number
}

/**
 * MetricCard - Animated metric display card
 *
 * Features:
 * - Lucide icon support
 * - Optional trend indicators
 * - Count-up animation for numbers
 * - Stagger animation delays
 * - Custom color classes
 *
 * Part of Phase 3 GUI migration
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  colorClass = 'text-accent',
  delay = 0
}) => {
  const trendIcons = {
    up: '↗️',
    down: '↘️',
    stable: '→'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <GlassPanel className="p-6 hover:bg-surface-darker/50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${colorClass}`} />
              <h3 className="text-sm font-medium text-text-muted">{label}</h3>
            </div>

            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
              className={`text-3xl font-bold ${colorClass}`}
            >
              {value}
            </motion.div>

            {subtitle && (
              <p className="text-sm text-text-muted mt-1">{subtitle}</p>
            )}
          </div>

          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2 }}
              className="text-2xl"
            >
              {trendIcons[trend]}
            </motion.div>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  )
}
