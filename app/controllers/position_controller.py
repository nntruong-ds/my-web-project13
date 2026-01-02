from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.services.position_service import PositionService
from app.schemas.position_schema import PositionCreate, PositionUpdate

class PositionController:
    @staticmethod
    def get_position(db: Session, id: str):
        position = PositionService.get_position_by_id(db, id)
        if not position:
            raise HTTPException(
                status_code=404,
                detail=f"Không tìm thấy chức vụ {id}")
        return position

    @staticmethod
    def get_all(db: Session):
        return PositionService.get_all(db)

    @staticmethod
    def create(db: Session, request: PositionCreate):
        try:
            return PositionService.create(db, request)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update(db: Session, chucvu_id: str, request: PositionUpdate):
        try:
            return PositionService.update(db, chucvu_id, request)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete(db: Session, chucvu_id: str):
        try:
            return PositionService.delete(db, chucvu_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))