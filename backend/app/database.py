# DB connection
#from sqlalchemy import create_engine
#from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv  
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base
from sqlalchemy.exc import OperationalError
from .metrics import report_db_failure

#Load variables from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

#create the connection engine
engine = create_engine(DATABASE_URL)

#create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class that models.py will use to define tables


Base = declarative_base()

#dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except OperationalError:
        report_db_failure()
        raise
    finally:
        db.close()

