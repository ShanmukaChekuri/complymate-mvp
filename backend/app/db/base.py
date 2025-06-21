# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.session import Base
from app.models.user import User
from app.models.form import Form, FormVersion, FormAnalysis
from app.models.file import File 