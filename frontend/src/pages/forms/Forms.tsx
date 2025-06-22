import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  lastModified: string;
  status: 'completed' | 'draft' | 'template';
  progress?: number;
  oshaForm?: string;
  requiredFields?: number;
  estimatedTime?: string;
}

const Forms: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'drafts' | 'completed'>('templates');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Enhanced mock forms with OSHA focus
  const mockForms: FormTemplate[] = [
    {
      id: '1',
      name: 'OSHA 300 Injury & Illness Log',
      description: 'Record work-related injuries and illnesses during the year',
      category: 'OSHA Required',
      lastModified: 'Built-in Template',
      status: 'template',
      oshaForm: 'OSHA 300',
      requiredFields: 15,
      estimatedTime: '15 mins'
    },
    {
      id: '2',
      name: 'OSHA 300A Summary Report',
      description: 'Annual summary of work-related injuries and illnesses',
      category: 'OSHA Required',
      lastModified: 'Built-in Template',
      status: 'template',
      oshaForm: 'OSHA 300A',
      requiredFields: 12,
      estimatedTime: '10 mins'
    },
    {
      id: '3',
      name: 'OSHA 301 Incident Report',
      description: 'Detailed incident report for individual cases',
      category: 'OSHA Required',
      lastModified: 'Built-in Template',
      status: 'template',
      oshaForm: 'OSHA 301',
      requiredFields: 20,
      estimatedTime: '20 mins'
    },
    {
      id: '4',
      name: 'Safety Training Record',
      description: 'Employee safety training documentation and certification',
      category: 'Training',
      lastModified: '2 days ago',
      status: 'template',
      requiredFields: 8,
      estimatedTime: '5 mins'
    },
    {
      id: '5',
      name: 'Workplace Safety Inspection',
      description: 'Regular workplace safety audit and inspection checklist',
      category: 'Inspection',
      lastModified: '1 week ago',
      status: 'template',
      requiredFields: 25,
      estimatedTime: '30 mins'
    },
    {
      id: '6',
      name: 'Hazard Communication Program',
      description: 'Chemical safety data sheet and communication program',
      category: 'Chemical Safety',
      lastModified: 'Built-in Template',
      status: 'template',
      requiredFields: 18,
      estimatedTime: '25 mins'
    },
    // Active forms
    {
      id: '7',
      name: 'Q4 2024 OSHA 300 Log',
      description: 'Current quarter injury and illness tracking',
      category: 'OSHA Required',
      lastModified: '2 days ago',
      status: 'draft',
      progress: 75,
      oshaForm: 'OSHA 300',
      requiredFields: 15,
      estimatedTime: '5 mins remaining'
    },
    {
      id: '8',
      name: 'Warehouse Incident - Dec 15',
      description: 'Forklift accident report and investigation',
      category: 'OSHA Required',
      lastModified: '1 day ago',
      status: 'completed',
      progress: 100,
      oshaForm: 'OSHA 301',
      requiredFields: 20,
      estimatedTime: 'Complete'
    }
  ];

  const filteredForms = mockForms.filter(form => {
    if (activeTab === 'all') return true;
    if (activeTab === 'templates') return form.status === 'template';
    if (activeTab === 'drafts') return form.status === 'draft';
    if (activeTab === 'completed') return form.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="status-success">✓ Completed</span>;
      case 'draft':
        return <span className="status-warning">📝 Draft</span>;
      case 'template':
        return <span className="status-neutral">📋 Template</span>;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'templates', label: 'OSHA Templates', count: mockForms.filter(f => f.status === 'template').length },
    { id: 'drafts', label: 'In Progress', count: mockForms.filter(f => f.status === 'draft').length },
    { id: 'completed', label: 'Completed', count: mockForms.filter(f => f.status === 'completed').length },
    { id: 'all', label: 'All Forms', count: mockForms.length }
  ];

  const handleCreateFromTemplate = (templateId: string) => {
    // Navigate to form builder with template ID
    navigate(`/forms/builder/${templateId}`);
  };

  const handleAIFormWizard = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="forms-container">
      {/* Header */}
      <div className="forms-header">
        <div className="forms-header-content">
          <div className="forms-title-section">
            <h1 className="text-heading-2">🏗️ OSHA Forms Engine</h1>
            <p className="text-body text-secondary">AI-powered OSHA compliance forms with auto-generation</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="forms-content">
        {/* Enhanced Action Bar */}
        <div className="forms-action-bar glass-card">
          <div className="forms-action-content">
            <div className="forms-overview">
              <div className="forms-stats">
                <div className="stat-item">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Total Forms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">OSHA Required</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">75%</span>
                  <span className="stat-label">Compliance</span>
                </div>
              </div>
              <p className="text-body-small text-secondary">Create, fill, and generate OSHA compliance forms with AI assistance</p>
            </div>
            <div className="forms-actions">
              <button className="btn-secondary" onClick={() => setShowCreateForm(true)}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Upload PDF
              </button>
              <button className="btn-primary" onClick={handleAIFormWizard}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
                </svg>
                AI Form Wizard
              </button>
            </div>
          </div>
        </div>

        {/* AI Quick Start */}
        {activeTab === 'templates' && (
          <div className="ai-quick-start glass-card">
            <div className="ai-quick-start-content">
              <div className="ai-icon gradient-apple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="ai-content">
                <h3 className="text-heading-4">🤖 AI-Powered Form Creation</h3>
                <p className="text-body-small text-secondary">
                  Tell our AI what happened, and we'll automatically fill out the correct OSHA forms for you. 
                  Save 80% of your time with intelligent auto-completion.
                </p>
              </div>
              <button className="btn-primary" onClick={handleAIFormWizard}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 6v6l4 2"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Start AI Wizard
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="forms-tabs">
          <div className="tabs-container glass-card-flat">
            <div className="tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-count">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="forms-grid">
          {filteredForms.map((form) => (
            <div key={form.id} className="form-card glass-card animate-fade-in">
              <div className="form-card-header">
                <div className="form-icon">
                  {form.oshaForm ? (
                    <div className="osha-badge">
                      <span className="osha-text">{form.oshaForm}</span>
                    </div>
                  ) : form.status === 'completed' ? (
                    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  ) : (
                    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  )}
                </div>
                <div className="form-status">
                  {getStatusBadge(form.status)}
                </div>
              </div>

              <div className="form-card-content">
                <h3 className="form-title text-heading-4">{form.name}</h3>
                <p className="form-description text-body-small text-secondary">{form.description}</p>
                
                {form.progress !== undefined && (
                  <div className="form-progress">
                    <div className="progress-info">
                      <span className="text-caption">Progress</span>
                      <span className="text-caption">{form.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${form.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="form-details">
                  <div className="form-detail-item">
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4V11z"/>
                      <path d="M9 11V9a2 2 0 0 1 4 0v2"/>
                      <path d="M15 11h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4V11z"/>
                    </svg>
                    <span className="text-caption">{form.requiredFields} fields</span>
                  </div>
                  <div className="form-detail-item">
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <span className="text-caption">{form.estimatedTime}</span>
                  </div>
                </div>

                <div className="form-meta">
                  <div className="form-category">
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span className="text-caption">{form.category}</span>
                  </div>
                  <span className="form-modified text-caption">Modified {form.lastModified}</span>
                </div>
              </div>

              <div className="form-card-actions">
                {form.status === 'template' ? (
                  <button 
                    className="btn-primary-full"
                    onClick={() => handleCreateFromTemplate(form.id)}
                  >
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
                    </svg>
                    Use Template with AI
                  </button>
                ) : (
                  <>
                    <button className="btn-ghost">
                      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
                    <button className="btn-ghost">
                      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    {form.status === 'completed' && (
                      <button className="btn-ghost">
                        <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export PDF
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="empty-state glass-card">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <svg className="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3 className="text-heading-4">No forms found</h3>
              <p className="text-body-small text-secondary">Start with our AI-powered OSHA templates</p>
              <button className="btn-primary" onClick={handleAIFormWizard}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
                </svg>
                Create with AI
              </button>
            </div>
          </div>
        )}

        {/* AI Form Wizard Modal */}
        {showCreateForm && (
          <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-heading-3">🤖 AI Form Wizard</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateForm(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <p className="text-body text-secondary mb-4">
                  Describe what happened or what form you need, and our AI will help you create and fill it out automatically.
                </p>
                <div className="ai-examples">
                  <h4 className="text-heading-5 mb-2">Try saying:</h4>
                  <div className="example-prompts">
                    <button className="example-prompt">
                      "Employee fell from ladder in warehouse yesterday"
                    </button>
                    <button className="example-prompt">
                      "Need to create Q4 injury summary report"
                    </button>
                    <button className="example-prompt">
                      "Chemical spill in manufacturing area"
                    </button>
                  </div>
                </div>
                <textarea 
                  className="ai-input"
                  placeholder="Describe your situation or the form you need..."
                  rows={4}
                />
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button className="btn-primary">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
                  </svg>
                  Generate Form with AI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .forms-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary-600);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .ai-quick-start {
          margin-bottom: 1.5rem;
        }

        .ai-quick-start-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }

        .ai-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ai-icon svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        .ai-content {
          flex: 1;
        }

        .osha-badge {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
        }

        .form-details {
          display: flex;
          gap: 1rem;
          margin: 0.75rem 0;
          padding: 0.5rem 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .form-detail-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .form-detail-item svg {
          width: 14px;
          height: 14px;
          color: var(--color-text-secondary);
        }

        .btn-primary-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary-full:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px -8px var(--color-primary-500);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 0;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--color-text-secondary);
        }

        .modal-close svg {
          width: 20px;
          height: 20px;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 0 1.5rem 1.5rem;
        }

        .ai-examples {
          margin-bottom: 1.5rem;
        }

        .example-prompts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .example-prompt {
          background: var(--color-surface-100);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          color: var(--color-text-primary);
        }

        .example-prompt:hover {
          background: var(--color-surface-200);
          border-color: var(--color-primary-300);
        }

        .ai-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-surface-100);
          color: var(--color-text-primary);
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
        }

        .ai-input:focus {
          outline: none;
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px var(--color-primary-100);
        }

        @media (max-width: 768px) {
          .forms-stats {
            gap: 1rem;
          }

          .stat-number {
            font-size: 1.25rem;
          }

          .ai-quick-start-content {
            flex-direction: column;
            text-align: center;
          }

          .form-details {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}; 

export default Forms;