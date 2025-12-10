from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.controllers.branch_controller import BranchController
from app.schemas.branch_schema import BranchResponse, BranchCreate, BranchUpdate

router = APIRouter(prefix="/branches", tags=["Branches"])

@router.get("/", response_model=list[BranchResponse])
def get_all_branches(db: Session = Depends(get_db)):
    return BranchController.get_all_branches(db)

@router.get("/{ma_chi_nhanh}", response_model=BranchResponse)
def get_branch(ma_chi_nhanh: int, db: Session = Depends(get_db)):
    return BranchController.get_branch(db, ma_chi_nhanh)

@router.post("/", response_model=BranchResponse)
def create_branch(data: BranchCreate, db: Session = Depends(get_db)):
    return BranchController.create_branch(db, data)

@router.put("/{ma_chi_nhanh}", response_model=BranchResponse)
def update_branch(ma_chi_nhanh: int, data: BranchUpdate, db: Session = Depends(get_db)):
    return BranchController.update_branch(db, ma_chi_nhanh, data)
    
@router.delete("/{ma_chi_nhanh}", status_code=status.HTTP_200_OK)
def delete_branch(ma_chi_nhanh: int, db: Session = Depends(get_db)):
    return BranchController.delete_branch(db, ma_chi_nhanh)