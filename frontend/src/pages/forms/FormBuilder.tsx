import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'radio';
  required: boolean;
  value: string | boolean;
  options?: string[];
  placeholder?: string;
  aiSuggestion?: string;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  oshaForm: string;
  fields: FormField[];
}

const FormBuilder: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // Mock OSHA 301 form template
  const oshaTemplates: Record<string, FormTemplate> = {
    '3': {
      id: '3',
      name: 'OSHA 301 Incident Report',
      description: 'Detailed incident report for individual cases',
      oshaForm: 'OSHA 301',
      fields: [
        {
          id: 'case_number',
          label: 'Case Number',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'e.g., 2024-001'
        },
        {
          id: 'employee_name',
          label: 'Employee Name',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'Full name of injured employee'
        },
        {
          id: 'job_title',
          label: 'Job Title',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'Employee\'s regular job title'
        },
        {
          id: 'injury_date',
          label: 'Date of Injury or Illness',
          type: 'date',
          required: true,
          value: '',
        },
        {
          id: 'time_of_incident',
          label: 'Time Incident Began',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'e.g., 2:30 PM'
        },
        {
          id: 'injury_location',
          label: 'Where did the incident occur?',
          type: 'textarea',
          required: true,
          value: '',
          placeholder: 'Specific location where injury/illness occurred'
        },
        {
          id: 'description_of_injury',
          label: 'Describe the injury or illness',
          type: 'textarea',
          required: true,
          value: '',
          placeholder: 'Detailed description of what happened'
        },
        {
          id: 'body_part_affected',
          label: 'Body part(s) affected',
          type: 'select',
          required: true,
          value: '',
          options: [
            'Head', 'Eye(s)', 'Neck', 'Shoulder', 'Arm/Elbow', 'Hand/Wrist/Fingers',
            'Back', 'Chest', 'Abdomen', 'Hip', 'Leg/Knee', 'Foot/Toe', 'Multiple body parts', 'Other'
          ]
        },
        {
          id: 'object_substance',
          label: 'Object/substance that directly injured the employee',
          type: 'textarea',
          required: false,
          value: '',
          placeholder: 'e.g., machinery, chemical, tool, etc.'
        },
        {
          id: 'death',
          label: 'Did the employee die?',
          type: 'radio',
          required: true,
          value: 'no',
          options: ['yes', 'no']
        },
        {
          id: 'treatment_date',
          label: 'Date of treatment',
          type: 'date',
          required: false,
          value: '',
        },
        {
          id: 'treated_by',
          label: 'Treated by (Name and address)',
          type: 'textarea',
          required: false,
          value: '',
          placeholder: 'Healthcare provider name and address'
        },
        {
          id: 'hospitalized',
          label: 'Was employee hospitalized overnight?',
          type: 'radio',
          required: true,
          value: 'no',
          options: ['yes', 'no']
        },
        {
          id: 'days_away_from_work',
          label: 'Days away from work',
          type: 'number',
          required: false,
          value: '',
          placeholder: 'Number of calendar days'
        },
        {
          id: 'return_to_work',
          label: 'Date returned to work',
          type: 'date',
          required: false,
          value: '',
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading form template
    setTimeout(() => {
      if (templateId && oshaTemplates[templateId]) {
        setFormData(oshaTemplates[templateId]);
      }
      setLoading(false);
    }, 500);
  }, [templateId]);

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    if (!formData) return;

    setFormData({
      ...formData,
      fields: formData.fields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      )
    });
  };

  const handleAiAssist = async (fieldId?: string) => {
    setAiProcessing(true);
    setShowAiAssistant(true);

    // Simulate AI processing
    setTimeout(() => {
      if (fieldId && formData) {
        // Simulate AI suggestions based on field
        const suggestions: Record<string, string> = {
          'description_of_injury': 'Employee slipped on wet floor in warehouse while carrying boxes, resulting in fall and back strain',
          'body_part_affected': 'Back',
          'object_substance': 'Wet floor surface',
          'injury_location': 'Warehouse Section B, near loading dock entrance',
          'time_of_incident': '10:30 AM'
        };

        if (suggestions[fieldId]) {
          setFormData({
            ...formData,
            fields: formData.fields.map(field =>
              field.id === fieldId 
                ? { ...field, value: suggestions[fieldId], aiSuggestion: suggestions[fieldId] }
                : field
            )
          });
        }
      }
      setAiProcessing(false);
    }, 2000);
  };

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Submitting form:', formData);
    alert('Form saved! In production, this would save to the database and generate PDF.');
  };

  const getCompletionPercentage = () => {
    if (!formData) return 0;
    const requiredFields = formData.fields.filter(f => f.required);
    const completedRequired = requiredFields.filter(f => f.value && f.value !== '');
    return Math.round((completedRequired.length / requiredFields.length) * 100);
  };

  if (loading) {
    return (
      <div className="form-builder-loading">
        <div className="loading-spinner"></div>
        <p>Loading form template...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="form-builder-error">
        <h2>Form template not found</h2>
        <button className="btn-primary" onClick={() => navigate('/forms')}>
          Back to Forms
        </button>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="form-builder">
      {/* Header */}
      <div className="form-builder-header glass-card">
        <div className="form-header-content">
          <div className="form-info">
            <div className="breadcrumb">
              <button className="breadcrumb-link" onClick={() => navigate('/forms')}>
                Forms
              </button>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">New Form</span>
            </div>
            <h1 className="form-title">{formData.name}</h1>
            <p className="form-description">{formData.description}</p>
          </div>
          <div className="form-actions">
            <div className="progress-indicator">
              <div className="progress-circle">
                <svg className="progress-ring" width="60" height="60">
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="var(--color-border)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="var(--color-primary-500)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - completionPercentage / 100)}`}
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                <span className="progress-text">{completionPercentage}%</span>
              </div>
              <span className="progress-label">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAiAssistant && (
        <div className="ai-assistant-panel glass-card">
          <div className="ai-assistant-header">
            <div className="ai-avatar gradient-apple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div className="ai-info">
              <h3>🤖 AI Assistant</h3>
              <p>{aiProcessing ? 'Analyzing and generating suggestions...' : 'Ready to help fill your form'}</p>
            </div>
            <button 
              className="ai-close"
              onClick={() => setShowAiAssistant(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          {aiProcessing && (
            <div className="ai-processing">
              <div className="processing-animation">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p>AI is analyzing your incident and preparing suggestions...</p>
            </div>
          )}

          <div className="ai-input-area">
            <textarea
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Describe the incident: 'Employee fell from ladder while changing light bulb...'"
              className="ai-textarea"
              rows={3}
            />
            <button 
              className="btn-primary"
              onClick={() => handleAiAssist()}
              disabled={aiProcessing}
            >
              {aiProcessing ? 'Processing...' : 'Fill Form with AI'}
            </button>
          </div>
        </div>
      )}

      <div style={{
        marginBottom: '1.5rem'
      }}>
        <div className="form-fields glass-card">
          <div className="form-fields-header">
            <h2>📋 OSHA 301 Form Fields</h2>
            <button 
              className="btn-secondary"
              onClick={() => setShowAiAssistant(!showAiAssistant)}
            >
              🤖 AI Assistant
            </button>
          </div>

          <div className="fields-grid">
            {formData.fields.map((field) => (
              <div key={field.id} className="field-group">
                <label className="field-label">
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>

                {(field.type === 'text' || field.type === 'textarea') && (
                  <div className="field-with-ai">
                    {field.type === 'text' ? (
                      <input
                        type="text"
                        className={`field-input ${field.aiSuggestion ? 'ai-suggested' : ''}`}
                        value={field.value as string}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    ) : (
                      <textarea
                        className={`field-textarea ${field.aiSuggestion ? 'ai-suggested' : ''}`}
                        value={field.value as string}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={3}
                      />
                    )}
                    <button 
                      className="ai-assist-btn"
                      onClick={() => handleAiAssist(field.id)}
                      title="AI Assist"
                    >
                      ✨
                    </button>
                  </div>
                )}

                {field.type === 'select' && (
                  <select
                    className="field-select"
                    value={field.value as string}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    required={field.required}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'date' && (
                  <input
                    type="date"
                    className="field-input"
                    value={field.value as string}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    className="field-input"
                    value={field.value as string}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}

                {field.type === 'radio' && (
                  <div className="radio-group">
                    {field.options?.map((option) => (
                      <label key={option} className="radio-label">
                        <input
                          type="radio"
                          name={field.id}
                          value={option}
                          checked={field.value === option}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        />
                        <span className="radio-text">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.aiSuggestion && (
                  <div className="ai-suggestion">
                    <span className="ai-badge">✨ AI Suggested</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions-panel glass-card">
          <div className="actions-content">
            <div className="save-status">
              ✅ <span>All changes saved</span>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary">💾 Save Draft</button>
              <button className="btn-primary" onClick={handleSubmit}>
                📄 Complete & Generate PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .form-builder {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }

        .form-builder-header {
          margin-bottom: 1.5rem;
        }

        .form-header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          padding: 1.5rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          color: var(--color-primary-600);
          cursor: pointer;
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: var(--color-text-secondary);
        }

        .breadcrumb-current {
          color: var(--color-text-secondary);
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }

        .form-description {
          color: var(--color-text-secondary);
          margin: 0;
        }

        .progress-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .progress-circle {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary-600);
        }

        .progress-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .ai-assistant-panel {
          margin-bottom: 1.5rem;
          border: 2px solid var(--color-primary-200);
        }

        .ai-assistant-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .ai-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ai-avatar svg {
          width: 20px;
          height: 20px;
          color: white;
        }

        .ai-info {
          flex: 1;
        }

        .ai-info h3 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .ai-info p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .ai-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--color-text-secondary);
        }

        .ai-processing {
          padding: 1.5rem;
          text-align: center;
          border-bottom: 1px solid var(--color-border);
        }

        .processing-animation {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .processing-animation .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-primary-500);
          animation: pulse 1.5s infinite ease-in-out;
        }

        .processing-animation .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .processing-animation .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }

        .ai-input-area {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ai-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-surface-100);
          color: var(--color-text-primary);
          font-family: inherit;
          resize: vertical;
        }

        .form-fields {
          margin-bottom: 1.5rem;
        }

        .form-fields-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .form-fields-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .fields-grid {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field-label {
          font-weight: 500;
          color: var(--color-text-primary);
          font-size: 0.875rem;
        }

        .required {
          color: var(--color-error-500);
          margin-left: 0.25rem;
        }

        .field-with-ai {
          position: relative;
        }

        .field-input, .field-textarea, .field-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-surface-100);
          color: var(--color-text-primary);
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .field-input:focus, .field-textarea:focus, .field-select:focus {
          outline: none;
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px var(--color-primary-100);
        }

        .ai-suggested {
          border-color: var(--color-primary-400) !important;
          background: var(--color-primary-50) !important;
        }

        .ai-assist-btn {
          position: absolute;
          right: 0.5rem;
          top: 0.5rem;
          background: var(--color-primary-500);
          border: none;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .ai-assist-btn:hover {
          background: var(--color-primary-600);
          transform: scale(1.05);
        }

        .radio-group {
          display: flex;
          gap: 1rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .radio-text {
          color: var(--color-text-primary);
        }

        .ai-suggestion {
          margin-top: 0.25rem;
        }

        .ai-badge {
          background: var(--color-primary-100);
          color: var(--color-primary-700);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .form-actions-panel {
          position: sticky;
          bottom: 1rem;
        }

        .actions-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
        }

        .save-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-success-600);
          font-size: 0.875rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .form-builder-loading, .form-builder-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary-500);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .radio-group {
            flex-direction: column;
          }

          .actions-content {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .action-buttons {
            justify-content: stretch;
          }

          .action-buttons button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FormBuilder; 