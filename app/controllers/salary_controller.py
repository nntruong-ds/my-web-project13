from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.services.salary_service import SalaryService

class SalaryController:
    @staticmethod
    def get_list(db: Session, thang, nam, mapb, macn, macv, keyword):
        return SalaryService.get_salaries(db, thang, nam, mapb, macn, macv, keyword)

    @staticmethod
    def calculate(db: Session, data):
        try:
            return SalaryService.calculate_and_save(db, data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_detail(db: Session, ma_nv, thang, nam):
        salary = SalaryService.get_salary_detail(db, ma_nv, thang, nam)
        if not salary:
            raise HTTPException(status_code=404, detail="Chưa có dữ liệu lương tháng này")
        return salary
    
    @staticmethod
    def export(db: Session, thang, nam, mapb, macn, macv, keyword):
        return SalaryService.export_excel(db, thang, nam, mapb, macn, macv, keyword)