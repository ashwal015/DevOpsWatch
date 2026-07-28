#app Entry Point
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import models, schemas, auth  

from fastapi.middleware.cors import CORSMiddleware

#Create tables that don't exist yet (User alredy exists, harless to call)

Base.metadata.create_all(bind=engine)

app = FastAPI()

#app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://35.159.168.66:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        email=user.email,
        password_hash=auth.hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = auth.create_access_token({"sub": new_user.email})
    return {"access_token": token}

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token}

#additional endpoints for incidents

@app.post("/incidents", response_model=schemas.IncidentOut)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    new_incident = models.Incident(**incident.dict(), owner_id=user.id)
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return new_incident

@app.get("/incidents", response_model=list[schemas.IncidentOut])
def list_incidents(db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Incident).all()

@app.patch("/incidents/{incident_id}", response_model=schemas.IncidentOut)
def update_incident(incident_id: int, update: schemas.IncidentUpdate, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    for key, value in update.dict(exclude_unset=True).items():
        setattr(incident, key, value)
    db.commit()
    db.refresh(incident)
    return incident
    