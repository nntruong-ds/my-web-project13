from sqlalchemy.orm import Session
from app.models.position import Position
from app.schemas.position_schema import *

class PositionService:
    @staticmethod
    def get_position_orm(db: Session, chucvu_id: str):
        return db.query(Position).filter(Position.chucvu_id == chucvu_id).first()
    
    @staticmethod
    def get_position_by_id(db: Session, chucvu_id: str):
        position = PositionService.get_position_orm(db, chucvu_id)
        if not position:
            return None
        return PositionResponse.model_validate(position) 

    @staticmethod
    def get_all(db: Session):
        return [PositionResponse.model_validate(e) for e in db.query(Position).all()]

    @staticmethod
    def create(db: Session, data: PositionCreate):
        # Check trùng ID
        if PositionService.get_position_orm(db, data.chucvu_id):
            raise ValueError(f"Mã chức vụ {data.chucvu_id} đã tồn tại!")
        
        # Check trùng tên (Optional - tùy bạn muốn chặn không)
        existing_name = db.query(Position).filter(Position.ten_chuc_vu == data.ten_chuc_vu).first()
        if existing_name:
             raise ValueError(f"Tên chức vụ '{data.ten_chuc_vu}' đã tồn tại!")

        new_pos = Position(**data.model_dump())
        db.add(new_pos)
        db.commit()
        db.refresh(new_pos)
        return new_pos

    @staticmethod
    def update(db: Session, chucvu_id: str, data: PositionUpdate):
        pos = PositionService.get_position_orm(db, chucvu_id)
        if not pos:
            raise ValueError("Chức vụ không tồn tại!")

        if data.ten_chuc_vu is not None: pos.ten_chuc_vu = data.ten_chuc_vu
        if data.luong_co_ban is not None: pos.luong_co_ban = data.luong_co_ban
        if data.he_so_luong is not None: pos.he_so_luong = data.he_so_luong

        db.commit()
        db.refresh(pos)
        return pos

    @staticmethod
    def delete(db: Session, chucvu_id: str):
        pos = PositionService.get_position_orm(db, chucvu_id)
        if not pos:
            raise ValueError("Chức vụ không tồn tại!")
        
        # Có thể thêm check logic: Nếu đang có nhân viên giữ chức vụ này thì không cho xóa
        if pos.ds_nhan_vien:
             raise ValueError(f"Không thể xóa chức vụ này vì đang có {len(pos.ds_nhan_vien)} nhân viên nắm giữ!")

        db.delete(pos)
        db.commit()
        return {"message": "Xóa thành công"}