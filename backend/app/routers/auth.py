from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

security = HTTPBearer()


# =========================================================
# PROFILE UPDATE SCHEMA
# =========================================================

class ProfileUpdate(BaseModel):
    full_name: str
    phone: str | None = None


# =========================================================
# PASSWORD FUNCTIONS
# =========================================================

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# =========================================================
# JWT TOKEN
# =========================================================

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User registered successfully"
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": str(db_user.id),
        "email": db_user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "phone": db_user.phone
        }
    }


# =========================================================
# UPDATE PROFILE
# =========================================================

@router.put("/profile")
def update_profile(
    profile: ProfileUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    try:
        # Get token
        token = credentials.credentials

        # Decode token
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        # Find logged-in user
        db_user = (
            db.query(User)
            .filter(User.id == int(user_id))
            .first()
        )

        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Update full name
        db_user.full_name = profile.full_name.strip()

        # Update phone
        if profile.phone is not None:
            db_user.phone = profile.phone.strip()

        # Save changes
        db.commit()
        db.refresh(db_user)

        return {
            "success": True,
            "message": "Profile updated successfully",
            "user": {
                "id": db_user.id,
                "full_name": db_user.full_name,
                "email": db_user.email,
                "phone": db_user.phone
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Profile update error:", e)

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


# =========================================================
# DELETE ACCOUNT
# =========================================================

@router.delete("/delete-account")
def delete_account(
    email: str,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User account not found"
        )

    db.delete(db_user)
    db.commit()

    return {
        "message": "Account deleted permanently"
    }