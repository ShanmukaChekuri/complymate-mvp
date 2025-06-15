from sqlalchemy import Boolean, Column, String, Integer, DateTime, Index
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    employee_count = Column(Integer, nullable=False)
    role = Column(String, default="user")
    subscription_tier = Column(String, default="free")
    subscription_status = Column(String, default="active")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    forms = relationship("Form", back_populates="user")
    # Future: audit_logs, analytics, etc.

# Indexes for performance
Index('idx_users_email', User.email)
Index('idx_users_company', User.company_name)
Index('idx_users_subscription', User.subscription_tier, User.subscription_status) 