from ..models.user import User

def register_user(db, username, password):
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        return {"error": "Username already exists"}

    new_user = User(username=username, password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User registered successfully"}

def login_user(db, username, password):
    user = db.query(User).filter(User.username == username, User.password == password).first()
    if user:
        return {"msg": "Login successful"}
    else:
        return {"error": "Invalid credentials"}
