import React, { useState, useEffect } from 'react'
import { PlanningSession } from '../types'
import './SessionForm.css'

interface SessionFormProps {
    session?: PlanningSession | null
    onSubmit: (formData: Partial<PlanningSession>) => void
    onCancel: () => void
}

export default function SessionForm({ session, onSubmit, onCancel }: SessionFormProps) {
    const isEditing = !!session

    // Initialize form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'draft',
        session_code: '',
    })

    // Load session data if editing
    useEffect(() => {
        if (session) {
            // Extract primitive values from potential objects
            const name = typeof session.name === 'object' ? session.name.value : session.name
            const description = typeof session.description === 'object' ? session.description.value : session.description
            const status = typeof session.status === 'object' ? session.status.value : session.status
            const sessionCode = typeof session.session_code === 'object' ? session.session_code.value : session.session_code

            setFormData({
                name: name || '',
                description: description || '',
                status: status || 'draft',
                session_code: sessionCode || '',
            })
        } else {
            // Generate session code for new sessions
            setFormData(prev => ({
                ...prev,
                session_code: generateSessionCode()
            }))
        }
    }, [session])

    const generateSessionCode = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>{isEditing ? 'Edit Planning Session' : 'Create New Planning Session'}</h2>
                    <button type="button" className="close-button" onClick={onCancel}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Session Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            placeholder="Enter a descriptive name for your planning session"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            maxLength={1000}
                            placeholder="Optional: Add details about this planning session"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="session_code">Session Code</label>
                            <input
                                type="text"
                                id="session_code"
                                name="session_code"
                                value={formData.session_code}
                                onChange={handleChange}
                                maxLength={10}
                                placeholder="Auto-generated code"
                                className="session-code-input"
                            />
                            <small className="help-text">
                                Share this code with team members to join the session
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            {isEditing ? 'Update Session' : 'Create Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}