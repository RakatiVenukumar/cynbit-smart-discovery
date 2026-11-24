from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.admin import Administrator


def get_admin_by_email(db: Session, email: str) -> Administrator | None:
    return db.scalar(select(Administrator).where(Administrator.email == email))


def get_admin_by_id(db: Session, admin_id: str) -> Administrator | None:
    import uuid
    try:
        uid = uuid.UUID(admin_id)
    except ValueError:
        return None
    return db.get(Administrator, uid)


def create_admin(db: Session, email: str, password_hash: str) -> Administrator:
    admin = Administrator(email=email, password_hash=password_hash)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin
