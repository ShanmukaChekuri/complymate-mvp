// Core Platform Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'manager' | 'employee' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  language: string;
  timezone: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  complianceAlerts: boolean;
  safetyIncidents: boolean;
  trainingReminders: boolean;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: OrganizationSize;
  address: Address;
  contactInfo: ContactInfo;
  subscription: Subscription;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationSize = 'small' | 'medium' | 'large' | 'enterprise';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  features: string[];
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface OrganizationSettings {
  complianceStandards: string[];
  safetyPrograms: string[];
  reportingFrequency: 'daily' | 'weekly' | 'monthly';
  autoNotifications: boolean;
}

// OSHA Compliance Types
export interface ComplianceRecord {
  id: string;
  organizationId: string;
  type: ComplianceType;
  status: ComplianceStatus;
  priority: Priority;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo?: string;
  documents: Document[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type ComplianceType = 
  | 'training'
  | 'inspection'
  | 'incident_report'
  | 'safety_audit'
  | 'equipment_maintenance'
  | 'hazard_assessment'
  | 'emergency_plan'
  | 'ppe_inspection';

export type ComplianceStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'overdue'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export type DocumentType = 'pdf' | 'image' | 'video' | 'document' | 'spreadsheet';

export interface Note {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Safety Incident Types
export interface SafetyIncident {
  id: string;
  organizationId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  location: string;
  date: Date;
  reportedBy: string;
  involvedEmployees: string[];
  witnesses?: string[];
  immediateActions: string[];
  rootCause?: string;
  correctiveActions: string[];
  documents: Document[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export type IncidentType = 
  | 'injury'
  | 'near_miss'
  | 'property_damage'
  | 'environmental'
  | 'security'
  | 'fire'
  | 'chemical_exposure'
  | 'equipment_failure';

export type IncidentSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type IncidentStatus = 'reported' | 'investigating' | 'resolved' | 'closed';

// Training Types
export interface TrainingRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  courseId: string;
  courseName: string;
  type: TrainingType;
  status: TrainingStatus;
  completionDate?: Date;
  expiryDate?: Date;
  score?: number;
  certificate?: Document;
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export type TrainingType = 
  | 'safety_orientation'
  | 'hazard_communication'
  | 'ppe_training'
  | 'emergency_response'
  | 'equipment_operation'
  | 'chemical_safety'
  | 'ergonomics'
  | 'first_aid';

export type TrainingStatus = 'assigned' | 'in_progress' | 'completed' | 'expired' | 'failed';

// Equipment Types
export interface Equipment {
  id: string;
  organizationId: string;
  name: string;
  type: EquipmentType;
  model: string;
  serialNumber: string;
  location: string;
  status: EquipmentStatus;
  lastInspection: Date;
  nextInspection: Date;
  maintenanceHistory: MaintenanceRecord[];
  documents: Document[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export type EquipmentType = 
  | 'ppe'
  | 'safety_equipment'
  | 'machinery'
  | 'tools'
  | 'vehicles'
  | 'fire_suppression'
  | 'monitoring_devices';

export type EquipmentStatus = 'operational' | 'maintenance' | 'out_of_service' | 'retired';

export interface MaintenanceRecord {
  id: string;
  type: MaintenanceType;
  description: string;
  performedBy: string;
  date: Date;
  cost?: number;
  nextMaintenance?: Date;
}

export type MaintenanceType = 'preventive' | 'corrective' | 'emergency' | 'inspection';

// Dashboard and Analytics Types
export interface DashboardMetrics {
  totalIncidents: number;
  openComplianceItems: number;
  overdueTraining: number;
  equipmentInspections: number;
  safetyScore: number;
  trendData: TrendData[];
}

export interface TrendData {
  date: Date;
  incidents: number;
  compliance: number;
  training: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'file';
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}

// UI Component Types
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  badge?: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Search and Filter Types
export interface SearchFilters {
  dateRange?: { start: Date; end: Date };
  status?: string[];
  priority?: Priority[];
  assignedTo?: string[];
  type?: string[];
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Export/Import Types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange?: { start: Date; end: Date };
  fields: string[];
  filters?: SearchFilters;
}

// Audit Trail Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
} 