"""
Admin creation script. Run from the backend directory:
  python scripts/create_admin.py
"""
import sys
import os
import getpass

# Allow running from scripts/ subdirectory
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.config import settings  # noqa: E402 — load env
from app.db.session import SessionLocal  # noqa: E402
from app.repositories.admin_repo import get_admin_by_email, create_admin  # noqa: E402
from app.core.security import hash_password  # noqa: E402


def main():
    print("=== Cynbit Smart Discovery — Admin Creation ===")
    email = input("Admin email: ").strip()
    if not email or "@" not in email:
        print("Invalid email.")
        sys.exit(1)

    password = getpass.getpass("Password: ")
    confirm = getpass.getpass("Confirm password: ")

    if password != confirm:
        print("Passwords do not match.")
        sys.exit(1)

    if len(password) < 8:
        print("Password must be at least 8 characters.")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = get_admin_by_email(db, email)
        if existing:
            print(f"Admin already exists: {email}")
            sys.exit(0)

        hashed = hash_password(password)
        admin = create_admin(db, email, hashed)
        print(f"Admin created successfully: {admin.email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
