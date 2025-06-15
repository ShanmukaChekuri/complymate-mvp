from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.form import Form, FormAnalysis
from app.models.chat import ChatSession
from app.models.file import File

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get dashboard statistics.
    """
    # Get total forms count
    total_forms = db.query(func.count(Form.id)).filter(
        Form.user_id == current_user.id
    ).scalar()
    
    # Get forms by status
    forms_by_status = db.query(
        Form.status,
        func.count(Form.id)
    ).filter(
        Form.user_id == current_user.id
    ).group_by(Form.status).all()
    
    # Get average completion percentage
    avg_completion = db.query(
        func.avg(Form.completion_percentage)
    ).filter(
        Form.user_id == current_user.id
    ).scalar() or 0
    
    # Get recent analyses
    recent_analyses = db.query(FormAnalysis).join(Form).filter(
        Form.user_id == current_user.id
    ).order_by(FormAnalysis.created_at.desc()).limit(5).all()
    
    # Get active chat sessions
    active_chats = db.query(func.count(ChatSession.id)).filter(
        ChatSession.user_id == current_user.id,
        ChatSession.status == "active"
    ).scalar()
    
    # Get recent file uploads
    recent_files = db.query(File).filter(
        File.uploaded_by == current_user.id
    ).order_by(File.created_at.desc()).limit(5).all()
    
    # Get compliance score trend
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    compliance_trend = db.query(
        func.date(FormAnalysis.created_at),
        func.avg(FormAnalysis.compliance_score)
    ).join(Form).filter(
        Form.user_id == current_user.id,
        FormAnalysis.created_at >= thirty_days_ago
    ).group_by(
        func.date(FormAnalysis.created_at)
    ).all()
    
    return {
        "total_forms": total_forms,
        "forms_by_status": dict(forms_by_status),
        "average_completion": round(avg_completion, 2),
        "recent_analyses": [
            {
                "id": str(analysis.id),
                "form_id": str(analysis.form_id),
                "type": analysis.analysis_type,
                "score": analysis.compliance_score,
                "created_at": analysis.created_at
            }
            for analysis in recent_analyses
        ],
        "active_chats": active_chats,
        "recent_files": [
            {
                "id": str(file.id),
                "filename": file.filename,
                "status": file.processing_status,
                "created_at": file.created_at
            }
            for file in recent_files
        ],
        "compliance_trend": [
            {
                "date": date.strftime("%Y-%m-%d"),
                "score": round(score, 2)
            }
            for date, score in compliance_trend
        ]
    } 