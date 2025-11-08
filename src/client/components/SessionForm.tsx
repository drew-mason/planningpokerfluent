import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Dice6 } from 'lucide-react'
import {
    PlanningSession,
    SessionStatus,
    SESSION_STATUS_LABELS,
    getValue,
    getDisplayValue,
    validateSessionCode,
    sanitizeInput
} from '../types'
import { serviceUtils } from '../utils/serviceUtils'
import { GlassPanel, Button } from './ui'
import './SessionForm.css'

interface SessionFormProps {
    session?: PlanningSession | null
    onSubmit: (formData: Partial<PlanningSession>) => void
    onCancel: () => void
    isLoading?: boolean
}

interface FormData {
    name: string
    description: string
    status: SessionStatus
    session_code: string
    timebox_minutes: number
}

interface FormErrors {
    name?: string
    description?: string
    status?: string
    session_code?: string
    timebox_minutes?: string
}

/**
 * SessionForm - Modernized session creation/edit form
 *
 * Phase 3 Migration:
 * - Uses GlassPanel for form wrapper
 * - Tailwind form utilities
 * - Button component for actions
 * - Framer Motion animations for errors and modal
 * - Lucide icons
 * - Improved accessibility with ARIA
 * - Maintained all validation logic
 */
export default function SessionForm({ session, onSubmit, onCancel, isLoading = false }: SessionFormProps) {
    const isEditing = !!session

    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        status: 'pending',
        session_code: '',
        timebox_minutes: 30
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
        name: false,
        description: false,
        status: false,
        session_code: false,
        timebox_minutes: false
    })

    // Initialize form data
    useEffect(() => {
        if (session) {
            const name = getDisplayValue(session.name)
            const description = getDisplayValue(session.description)
            const status = getValue(session.status) as SessionStatus
            const sessionCode = getValue(session.session_code)
            const timeboxMinutes = Number(getValue(session.timebox_minutes)) || 30

            setFormData({
                name: name || '',
                description: description || '',
                status: status || 'pending',
                session_code: sessionCode || '',
                timebox_minutes: timeboxMinutes
            })
        } else {
            // Generate session code for new sessions
            setFormData(prev => ({
                ...prev,
                session_code: serviceUtils.generateSessionCode()
            }))
        }
    }, [session])

    // Validation
    const validateField = useCallback((field: keyof FormData, value: any): string | undefined => {
        switch (field) {
            case 'name':
                if (!value || !value.toString().trim()) {
                    return 'Session name is required'
                }
                if (value.toString().trim().length > 100) {
                    return 'Session name must be 100 characters or less'
                }
                break

            case 'description':
                if (value && value.toString().length > 1000) {
                    return 'Description must be 1000 characters or less'
                }
                break

            case 'session_code':
                if (!value || !value.toString().trim()) {
                    return 'Session code is required'
                }
                if (!validateSessionCode(value.toString().trim().toUpperCase())) {
                    return 'Session code must be 6 characters (letters and numbers only)'
                }
                break

            case 'timebox_minutes':
                const minutes = Number(value)
                if (isNaN(minutes) || minutes < 5) {
                    return 'Timebox must be at least 5 minutes'
                }
                if (minutes > 480) {
                    return 'Timebox must be 8 hours or less'
                }
                break
        }
        return undefined
    }, [])

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {}
        let isValid = true

        Object.keys(formData).forEach(key => {
            const field = key as keyof FormData
            const error = validateField(field, formData[field])
            if (error) {
                newErrors[field] = error
                isValid = false
            }
        })

        setErrors(newErrors)
        return isValid
    }, [formData, validateField])

    // Event handlers
    const handleChange = useCallback((field: keyof FormData, value: any) => {
        // Sanitize input
        let sanitizedValue = value
        if (field === 'name' || field === 'description') {
            sanitizedValue = sanitizeInput(value)
        } else if (field === 'session_code') {
            sanitizedValue = value.toString().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6)
        } else if (field === 'timebox_minutes') {
            sanitizedValue = Math.max(5, Math.min(480, Number(value) || 30))
        }

        setFormData(prev => ({ ...prev, [field]: sanitizedValue }))

        // Validate field if it's been touched
        if (touched[field]) {
            const error = validateField(field, sanitizedValue)
            setErrors(prev => ({ ...prev, [field]: error }))
        }
    }, [touched, validateField])

    const handleBlur = useCallback((field: keyof FormData) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        const error = validateField(field, formData[field])
        setErrors(prev => ({ ...prev, [field]: error }))
    }, [formData, validateField])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({
            name: true,
            description: true,
            status: true,
            session_code: true,
            timebox_minutes: true
        })

        if (validateForm()) {
            onSubmit(formData)
        }
    }, [formData, validateForm, onSubmit])

    const generateNewCode = useCallback(() => {
        const newCode = serviceUtils.generateSessionCode()
        handleChange('session_code', newCode)
    }, [handleChange])

    // Render helpers
    const getFieldError = (field: keyof FormData): string | undefined => {
        return touched[field] ? errors[field] : undefined
    }

    const hasError = (field: keyof FormData): boolean => {
        return !!(touched[field] && errors[field])
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && onCancel()}
            >
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <GlassPanel className="p-6">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-heading uppercase tracking-wider text-accent">
                                {isEditing ? 'Edit Planning Session' : 'Create New Planning Session'}
                            </h2>
                            <button
                                type="button"
                                className="rounded-lg p-1 hover:bg-accent-muted"
                                onClick={onCancel}
                                disabled={isLoading}
                                aria-label="Close form"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Session Name */}
                            <div className="mb-4">
                                <label htmlFor="session-name" className="mb-2 block text-sm font-medium">
                                    Session Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="session-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="Enter a descriptive name for your planning session"
                                    maxLength={100}
                                    disabled={isLoading}
                                    className={`w-full rounded-lg border ${hasError('name') ? 'border-red-500' : 'border-border'
                                        } bg-surface px-4 py-2 focus:outline-none focus:ring-2 ${hasError('name') ? 'focus:ring-red-500' : 'focus:ring-accent'
                                        }`}
                                    aria-describedby={hasError('name') ? 'name-error' : undefined}
                                    aria-invalid={hasError('name')}
                                />
                                <AnimatePresence>
                                    {getFieldError('name') && (
                                        <motion.div
                                            id="name-error"
                                            className="mt-1 text-sm text-red-500"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            role="alert"
                                        >
                                            {getFieldError('name')}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="mt-1 text-xs text-accent/60">
                                    {formData.name.length}/100 characters
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label htmlFor="session-description" className="mb-2 block text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    id="session-description"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    onBlur={() => handleBlur('description')}
                                    placeholder="Optional: Add details about this planning session"
                                    rows={4}
                                    maxLength={1000}
                                    disabled={isLoading}
                                    className={`w-full rounded-lg border ${hasError('description') ? 'border-red-500' : 'border-border'
                                        } bg-surface px-4 py-2 focus:outline-none focus:ring-2 ${hasError('description') ? 'focus:ring-red-500' : 'focus:ring-accent'
                                        }`}
                                    aria-describedby={hasError('description') ? 'description-error' : undefined}
                                    aria-invalid={hasError('description')}
                                />
                                <AnimatePresence>
                                    {getFieldError('description') && (
                                        <motion.div
                                            id="description-error"
                                            className="mt-1 text-sm text-red-500"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            role="alert"
                                        >
                                            {getFieldError('description')}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="mt-1 text-xs text-accent/60">
                                    {formData.description.length}/1000 characters
                                </div>
                            </div>

                            <div className="mb-4 grid gap-4 md:grid-cols-2">
                                {/* Session Code */}
                                <div>
                                    <label htmlFor="session-code" className="mb-2 block text-sm font-medium">
                                        Session Code <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="session-code"
                                            type="text"
                                            value={formData.session_code}
                                            onChange={(e) => handleChange('session_code', e.target.value)}
                                            onBlur={() => handleBlur('session_code')}
                                            placeholder="ABC123"
                                            maxLength={6}
                                            disabled={isLoading}
                                            className={`flex-1 rounded-lg border ${hasError('session_code') ? 'border-red-500' : 'border-border'
                                                } bg-surface px-4 py-2 text-center font-mono uppercase tracking-wider focus:outline-none focus:ring-2 ${hasError('session_code') ? 'focus:ring-red-500' : 'focus:ring-accent'
                                                }`}
                                            aria-describedby={hasError('session_code') ? 'code-error' : undefined}
                                            aria-invalid={hasError('session_code')}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="md"
                                            onClick={generateNewCode}
                                            disabled={isLoading}
                                            icon={<Dice6 className="h-4 w-4" />}
                                            title="Generate new code"
                                            aria-label="Generate new session code"
                                            soundEnabled={false}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {getFieldError('session_code') && (
                                            <motion.div
                                                id="code-error"
                                                className="mt-1 text-sm text-red-500"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                role="alert"
                                            >
                                                {getFieldError('session_code')}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="mt-1 text-xs text-accent/60">
                                        Share this code with team members to join the session
                                    </div>
                                </div>

                                {/* Timebox */}
                                <div>
                                    <label htmlFor="timebox-minutes" className="mb-2 block text-sm font-medium">
                                        Timebox (minutes)
                                    </label>
                                    <input
                                        id="timebox-minutes"
                                        type="number"
                                        min={5}
                                        max={480}
                                        value={formData.timebox_minutes}
                                        onChange={(e) => handleChange('timebox_minutes', e.target.value)}
                                        onBlur={() => handleBlur('timebox_minutes')}
                                        disabled={isLoading}
                                        className={`w-full rounded-lg border ${hasError('timebox_minutes') ? 'border-red-500' : 'border-border'
                                            } bg-surface px-4 py-2 focus:outline-none focus:ring-2 ${hasError('timebox_minutes') ? 'focus:ring-red-500' : 'focus:ring-accent'
                                            }`}
                                        aria-describedby={hasError('timebox_minutes') ? 'timebox-error' : undefined}
                                        aria-invalid={hasError('timebox_minutes')}
                                    />
                                    <AnimatePresence>
                                        {getFieldError('timebox_minutes') && (
                                            <motion.div
                                                id="timebox-error"
                                                className="mt-1 text-sm text-red-500"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                role="alert"
                                            >
                                                {getFieldError('timebox_minutes')}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label htmlFor="session-status" className="mb-2 block text-sm font-medium">
                                    Status
                                </label>
                                <select
                                    id="session-status"
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value as SessionStatus)}
                                    disabled={isLoading}
                                    className="w-full rounded-lg border border-border bg-surface px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    {Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
                                    loading={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Session' : 'Create Session')}
                                </Button>
                            </div>
                        </form>
                    </GlassPanel>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
