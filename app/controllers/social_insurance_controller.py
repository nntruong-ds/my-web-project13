from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.social_insurance_service import SocialInsuranceService

class SocialInsuranceController:
    
    @staticmethod
    def search(
        db: Session, 
        keyword: str, 
        thang: int, 
        nam: int, 
        mapb: str, 
        macn: int
    ):
        return SocialInsuranceService.search_insurance(
            db, keyword, thang, nam, mapb, macn
        )

    @staticmethod
    def create(db: Session, data):
        try:
            return SocialInsuranceService.create(db, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update(db: Session, data):
        try:
            return SocialInsuranceService.update(db, data)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    @staticmethod
    def export_excel(
        db: Session, 
        keyword: str, thang: int, nam: int, 
        mapb: str, macn: int, 
    ):
        return SocialInsuranceService.export_to_excel(db, keyword, thang, nam, mapb, macn)