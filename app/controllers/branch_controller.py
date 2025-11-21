from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.branch_service import BranchService
from app.schemas.branch_schema import BranchCreate, BranchUpdate

class BranchController:
    @staticmethod
    def get_all_branches(db: Session):
        return BranchService.get_all_branches(db)
    
    @staticmethod
    def get_branch(db:Session, id: int):
        branch = BranchService.get_branch_by_id(db, id)

        if not branch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy chi nhánh có mã {id}"
            )
        
        return branch

    @staticmethod
    def create_branch(db: Session, data: BranchCreate):
        try:
            return BranchService.create_branch(db, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_branch(db: Session, id: int, data: BranchUpdate):
        branch = BranchService.update_branch(db, id, data)

        if branch is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chi nhánh không tồn tại"
            )
        
        return branch

    @staticmethod
    def delete_branch(db: Session, id: int):
        result = BranchService.delete_branch(db, id)

        if not result:
            raise HTTPException(status_code=404, detail="Chi nhánh không tồn tại")

        return {"message": "Xóa chi nhánh thành công"}