from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.services.reward_discipline_service import RewardDisciplineService

class RewardDisciplineController:
    
    # Tìm kiếm & Lọc
    @staticmethod
    def search(db: Session, keyword, thang, nam, loai, mapb, macn):
        return RewardDisciplineService.search(db, keyword, thang, nam, loai, mapb, macn)

    # Tạo mới
    @staticmethod
    def create(db: Session, data):
        try:
            return RewardDisciplineService.create(db, data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # Cập nhật (Theo ID)
    @staticmethod
    def update(db: Session, id: int, data):
        try:
            return RewardDisciplineService.update(db, id, data)
        except ValueError as e:
            # Lỗi 404 nếu không tìm thấy ID
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # Xóa (Theo ID)
    @staticmethod
    def delete(db: Session, id: int):
        try:
            return RewardDisciplineService.delete(db, id)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
            
    # Xuất Excel
    @staticmethod
    def export(db: Session, keyword, thang, nam, loai, mapb, macn):
        return RewardDisciplineService.export_excel(db, keyword, thang, nam, loai, mapb, macn)