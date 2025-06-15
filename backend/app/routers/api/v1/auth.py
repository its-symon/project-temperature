from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token
from app.utils.security import verify_password, get_password_hash, create_access_token

router = APIRouter()

# SignUP
@router.post("/signup", response_model=Token, status_code=status.HTTP_200_OK)
def signup(user_create: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user_create.password)
    user = User(email=user_create.email, password_hash=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Login
@router.post("/login", response_model=Token,  status_code=status.HTTP_200_OK)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_login.email).first()
    if not user or not verify_password(user_login.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/test")
def test():
    return {"message": "auth router working"}