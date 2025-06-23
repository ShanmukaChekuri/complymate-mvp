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
  const [aiFormDescription, setAiFormDescription] = useState('');

  // Enhanced mock forms with OSHA focus
  const mockForms: FormTemplate[] = [
    {
      id: '1',
      name: 'OSHA 300 Injury & Illness Log',
      description: 'Record work-related injuries and illnesses during the year',
      category: 'OSHA Required',
      lastModified: 'Modified Built-in Template',
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
      lastModified: 'Modified Built-in Template',
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
      lastModified: 'Modified Built-in Template',
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
      lastModified: 'Modified Built-in Template',
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
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            ✓ Completed
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            📝 In Progress
          </span>
        );
      case 'template':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            📋 Template
          </span>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'templates', label: 'OSHA Templates', count: mockForms.filter(f => f.status === 'template').length, icon: '📋' },
    { id: 'drafts', label: 'In Progress', count: mockForms.filter(f => f.status === 'draft').length, icon: '📝' },
    { id: 'completed', label: 'Completed', count: mockForms.filter(f => f.status === 'completed').length, icon: '✅' },
    { id: 'all', label: 'All Forms', count: mockForms.length, icon: '📊' }
  ];

  const handleCreateFromTemplate = (templateId: string) => {
    navigate(`/forms/builder/${templateId}`);
  };

  const handleAIFormWizard = () => {
    setShowCreateForm(true);
  };

  const handleGenerateAIForm = () => {
    if (!aiFormDescription.trim()) return;
    
    // Simulate AI form generation
    console.log('Generating form for:', aiFormDescription);
    setShowCreateForm(false);
    setAiFormDescription('');
    
    // In real app, this would navigate to the generated form
    // navigate(`/forms/ai-generated/${generatedFormId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 space-y-6">
        {/* AI Wizard Banner */}
        <div className="rounded-xl p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Form Assistant</h3>
                <p className="text-blue-100">Tell our AI what happened, and we'll automatically fill out the correct OSHA forms for you. Save 80% of your time with intelligent auto-completion.</p>
              </div>
            </div>
            <button
              onClick={handleAIFormWizard}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Start AI Wizard
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => handleCreateFromTemplate(form.id)}
            >
              {/* Form Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {form.oshaForm && (
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-800 text-xs font-medium mb-2 dark:bg-red-900/30 dark:text-red-400">
                      {form.oshaForm}
                    </div>
                  )}
                  <h3 className="font-semibold mb-2 text-white">
                    {form.name}
                  </h3>
                  <p className="text-sm mb-3 text-slate-400">
                    {form.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar for drafts */}
              {form.status === 'draft' && form.progress && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      Progress
                    </span>
                    <span className="text-sm text-slate-400">
                      {form.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${form.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Form Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    📝 Fields
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {form.requiredFields}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    ⏱️ Time
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {form.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-between">
                {getStatusBadge(form.status)}
                <span className="text-xs text-slate-500">
                  {form.lastModified}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              No forms found
            </h3>
            <p className="text-slate-400 mb-4">
              Try switching to a different tab or create a new form.
            </p>
            <button
              onClick={handleAIFormWizard}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create New Form
            </button>
          </div>
        )}
      </div>

      {/* AI Form Wizard Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl p-6 bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  AI Form Wizard
                </h3>
                <p className="text-sm text-slate-400">
                  Describe what happened or what form you need
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Describe your situation or the form you need...
                </label>
                <textarea
                  value={aiFormDescription}
                  onChange={(e) => setAiFormDescription(e.target.value)}
                  placeholder="Example: An employee fell from a ladder in the warehouse yesterday and injured their wrist. They went to the hospital for treatment..."
                  className="w-full h-32 px-4 py-3 rounded-lg border resize-none bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAIForm}
                  disabled={!aiFormDescription.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    aiFormDescription.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-slate-700 text-slate-500'
                  } disabled:cursor-not-allowed`}
                >
                  ✨ Generate Form with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;