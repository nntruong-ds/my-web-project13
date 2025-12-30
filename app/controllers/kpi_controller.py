from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.services.kpi_service import KPIService

class KPIController:
    
    @staticmethod
    def get_overview(db: Session, thang, nam, mapb, macn, keyword):
        return KPIService.get_overview(db, thang, nam, mapb, macn, keyword)
    
    @staticmethod
    def export_overview(db: Session, thang, nam, mapb, macn, keyword):
        return KPIService.export_overview_excel(db, thang, nam, mapb, macn, keyword)

    @staticmethod
    def get_details(db: Session, ma_nv, thang, nam):
        return KPIService.get_details(db, ma_nv, thang, nam)

    @staticmethod
    def create(db: Session, data):
        try:
            return KPIService.create(db, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update(db: Session, ma_nv, ten_kpi, ky, data):
        try:
            return KPIService.update(db, ma_nv, ten_kpi, ky, data)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))