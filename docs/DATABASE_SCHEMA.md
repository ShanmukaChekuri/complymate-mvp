# ComplyMate Database Schema

## Overview
The database schema is designed to support OSHA compliance form management, AI-powered analysis, and user interactions.

## Tables

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    employee_count INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'active',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company ON users(company_name);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_status);
```

### forms
```sql
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    content JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    metadata JSONB,
    completion_percentage FLOAT DEFAULT 0,
    processing_status VARCHAR(50),
    last_processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forms_user ON forms(user_id);
CREATE INDEX idx_forms_type ON forms(type);
CREATE INDEX idx_forms_status ON forms(status);
CREATE INDEX idx_forms_year ON forms(year);
```

### form_versions
```sql
CREATE TABLE form_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id),
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    changes_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_form_versions_form ON form_versions(form_id);
CREATE UNIQUE INDEX idx_form_versions_unique ON form_versions(form_id, version_number);
```

### form_analyses
```sql
CREATE TABLE form_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id),
    analysis_type VARCHAR(50) NOT NULL,
    model_used VARCHAR(50) NOT NULL,
    suggestions JSONB NOT NULL,
    compliance_score FLOAT,
    processing_time FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_form_analyses_form ON form_analyses(form_id);
CREATE INDEX idx_form_analyses_type ON form_analyses(analysis_type);
```

### chat_sessions
```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    context JSONB NOT NULL,
    model_used VARCHAR(50) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_sessions_form ON chat_sessions(form_id);
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
```

### chat_messages
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id),
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    selected_option VARCHAR(255),
    form_updates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);
```

### files
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    extracted_data JSONB,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_form ON files(form_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_status ON files(processing_status);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

### analytics
```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    dimensions JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_user ON analytics(user_id);
CREATE INDEX idx_analytics_metric ON analytics(metric_name);
CREATE INDEX idx_analytics_time ON analytics(recorded_at);
```

## Relationships

### One-to-Many
- User → Forms
- Form → Form Versions
- Form → Form Analyses
- Form → Files
- User → Audit Logs
- Form → Chat Sessions
- Chat Session → Chat Messages
- User → Analytics

### Many-to-One
- Forms → User
- Form Versions → Form
- Form Analyses → Form
- Files → Form
- Audit Logs → User
- Chat Sessions → Form
- Chat Messages → Chat Session
- Analytics → User

## Constraints

### Foreign Keys
- All foreign keys have ON DELETE RESTRICT
- All foreign keys have ON UPDATE CASCADE

### Unique Constraints
- User email must be unique
- Form version numbers must be unique per form
- File paths must be unique
- Chat session IDs must be unique

## Data Types

### UUID
- Used for all primary keys
- Generated using gen_random_uuid()

### JSONB
- Used for flexible data storage
- Indexed for performance
- Used in forms.content, forms.metadata, form_analyses.suggestions
- Used in chat_sessions.context, chat_messages.form_updates

### Timestamps
- All timestamps include timezone
- Default to CURRENT_TIMESTAMP
- Automatically updated on changes

## Migration Strategy

### Development
1. Use SQLite for local development
2. Alembic for migration management
3. Version control for schema changes

### Production
1. PostgreSQL for production
2. Zero-downtime migrations
3. Backup before migrations
4. Rollback plan for each migration

## Indexes

### Performance Indexes
- Email lookups
- Form filtering
- Audit log queries
- File searches
- Chat session tracking
- Analytics queries

### Composite Indexes
- Form versions (form_id, version_number)
- Audit logs (entity_type, entity_id)
- Analytics (user_id, metric_name, recorded_at)

## Validation Rules

### Users
- Email must be valid format
- Password must meet complexity requirements
- Company name required
- First/last name required
- Industry must be valid
- Employee count must be positive

### Forms
- Title required
- Type must be valid
- Content must be valid JSON
- Status must be valid
- Year must be valid

### Files
- Filename must be unique
- Size must be positive
- Mime type must be valid
- Path must be unique
- Processing status must be valid

### Chat Sessions
- Form ID must be valid
- User ID must be valid
- Status must be valid
- Context must be valid JSON
- Model must be valid

### Users
- Email must be valid format
- Password must meet complexity requirements
- Company name required
- First/last name required
- Industry must be valid
- Employee count must be positive

### Forms
- Title required
- Type must be valid
- Content must be valid JSON
- Status must be valid
- Year must be valid

### Files
- Filename must be unique
- Size must be positive
- Mime type must be valid
- Path must be unique 