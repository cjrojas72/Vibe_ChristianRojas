from database import engine
from sqlalchemy.exc import OperationalError

try:
    # Try to connect
    with engine.connect() as connection:
        print("Connection to MySQL server was successful!")
except OperationalError as e:
    print(f"Connection failed: {e}")
