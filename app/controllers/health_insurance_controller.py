from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.services.health_insurance_service import HealthInsuranceService

class HealthInsuranceController:
    
    @staticmethod
    def search(db: Session, keyword, thang, nam, mapb, macn):
        return HealthInsuranceService.search_insurance(db, keyword, thang, nam, mapb, macn)

    @staticmethod
    def create(db: Session, data):
        try:
            return HealthInsuranceService.create(db, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update(db: Session, data):
        try:
            return HealthInsuranceService.update(db, data)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    @staticmethod
    def export_excel(db: Session, keyword, thang, nam, mapb, macn):
        return HealthInsuranceService.export_to_excel(db, keyword, thang, nam, mapb, macn)