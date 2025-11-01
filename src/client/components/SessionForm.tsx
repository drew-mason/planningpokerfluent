import React, { useState, useEffect, useCallback } from 'react'
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
        <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="form-container">
                <div className="form-header">
                    <h2>{isEditing ? 'Edit Planning Session' : 'Create New Planning Session'}</h2>
                    <button 
                        type="button" 
                        className="close-button" 
                        onClick={onCancel}
                        disabled={isLoading}
                        aria-label="Close form"
                    >
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-body">
                        {/* Session Name */}
                        <div className={`form-group ${hasError('name') ? 'has-error' : ''}`}>
                            <label htmlFor="session-name" className="required">
                                Session Name
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
                                autoComplete="off"
                                data-no-autofill="true"
                                data-form-type="other"
                                aria-describedby={hasError('name') ? 'name-error' : undefined}
                                aria-invalid={hasError('name')}
                            />
                            {getFieldError('name') && (
                                <div id="name-error" className="field-error" role="alert">
                                    {getFieldError('name')}
                                </div>
                            )}
                            <div className="field-hint">
                                {formData.name.length}/100 characters
                            </div>
                        </div>

                        {/* Description */}
                        <div className={`form-group ${hasError('description') ? 'has-error' : ''}`}>
                            <label htmlFor="session-description">Description</label>
                            <textarea
                                id="session-description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                onBlur={() => handleBlur('description')}
                                placeholder="Optional: Add details about this planning session"
                                rows={4}
                                maxLength={1000}
                                disabled={isLoading}
                                autoComplete="off"
                                data-no-autofill="true"
                                data-form-type="other"
                                aria-describedby={hasError('description') ? 'description-error' : undefined}
                                aria-invalid={hasError('description')}
                            />
                            {getFieldError('description') && (
                                <div id="description-error" className="field-error" role="alert">
                                    {getFieldError('description')}
                                </div>
                            )}
                            <div className="field-hint">
                                {formData.description.length}/1000 characters
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Session Code */}
                            <div className={`form-group ${hasError('session_code') ? 'has-error' : ''}`}>
                                <label htmlFor="session-code" className="required">
                                    Session Code
                                </label>
                                <div className="input-group">
                                    <input
                                        id="session-code"
                                        type="text"
                                        value={formData.session_code}
                                        onChange={(e) => handleChange('session_code', e.target.value)}
                                        onBlur={() => handleBlur('session_code')}
                                        placeholder="ABC123"
                                        maxLength={6}
                                        className="session-code-input"
                                        disabled={isLoading}
                                        autoComplete="off"
                                        data-no-autofill="true"
                                        data-form-type="other"
                                        aria-describedby={hasError('session_code') ? 'code-error' : 'code-hint'}
                                        aria-invalid={hasError('session_code')}
                                    />
                                    <button
                                        type="button"
                                        className="generate-code-button"
                                        onClick={generateNewCode}
                                        disabled={isLoading}
                                        title="Generate new code"
                                        aria-label="Generate new session code"
                                    >
                                        🎲
                                    </button>
                                </div>
                                {getFieldError('session_code') && (
                                    <div id="code-error" className="field-error" role="alert">
                                        {getFieldError('session_code')}
                                    </div>
                                )}
                                <div id="code-hint" className="field-hint">
                                    Share this code with team members to join the session
                                </div>
                            </div>

                            {/* Timebox */}
                            <div className={`form-group ${hasError('timebox_minutes') ? 'has-error' : ''}`}>
                                <label htmlFor="timebox-minutes">Timebox (minutes)</label>
                                <input
                                    id="timebox-minutes"
                                    type="number"
                                    min={5}
                                    max={480}
                                    value={formData.timebox_minutes}
                                    onChange={(e) => handleChange('timebox_minutes', e.target.value)}
                                    onBlur={() => handleBlur('timebox_minutes')}
                                    disabled={isLoading}
                                    aria-describedby={hasError('timebox_minutes') ? 'timebox-error' : undefined}
                                    aria-invalid={hasError('timebox_minutes')}
                                />
                                {getFieldError('timebox_minutes') && (
                                    <div id="timebox-error" className="field-error" role="alert">
                                        {getFieldError('timebox_minutes')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label htmlFor="session-status">Status</label>
                            <select
                                id="session-status"
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value as SessionStatus)}
                                disabled={isLoading}
                                autoComplete="off"
                                data-no-autofill="true"
                                data-form-type="other"
                            >
                                {Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="secondary-button" 
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="primary-button"
                            disabled={isLoading || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner" aria-hidden="true"></span>
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                isEditing ? 'Update Session' : 'Create Session'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}