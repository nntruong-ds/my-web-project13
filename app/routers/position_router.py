from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.configs.database import get_db
from app.controllers.position_controller import PositionController
from app.schemas.position_schema import PositionCreate, PositionUpdate, PositionResponse

router = APIRouter(prefix="/positions", tags=["Position - Chức vụ"])

# API: Lấy thông tin chi tiết 1 chúc vụ
@router.get("/{chucvu_id}", response_model=PositionResponse)
def get_employee_detail(id: str, db: Session = Depends(get_db)):
    return PositionController.get_position(db, id)

@router.get("/", response_model=List[PositionResponse])
def get_all_positions(db: Session = Depends(get_db)):
    return PositionController.get_all(db)

@router.post("/", response_model=PositionResponse)
def create_position(request: PositionCreate, db: Session = Depends(get_db)):
    return PositionController.create(db, request)

@router.put("/{chucvu_id}", response_model=PositionResponse)
def update_position(chucvu_id: str, request: PositionUpdate, db: Session = Depends(get_db)):
    return PositionController.update(db, chucvu_id, request)

@router.delete("/{chucvu_id}")
def delete_position(chucvu_id: str, db: Session = Depends(get_db)):
    return PositionController.delete(db, chucvu_id)