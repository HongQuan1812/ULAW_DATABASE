# API_Definition/Khoa_API/Insert_BaoCaoKhoa.py

from fastapi import APIRouter, Depends, status
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from OrmModels_Definition.Khoa_OrmModels import BCK, FDANHMUCNGANH
from Schemas_Definition.Khoa_Schemas import BCKCreate, BCKRead
from API_Definition.Dependencies.Khoa_Dependencies import (
    BCKValidator,
    get_bck_validator
)
from API_Definition.Dependencies.Common_Dependencies import (
    BaoCaoValidator,
    get_baocao_validator
)


bck_router = InferringRouter(
    prefix="/bck",
)  # smarter than APIRouter for CBV


# ======================================================
# Controller: NguoiBaoCao
# ======================================================
@cbv(bck_router)
class BCKController:
    # ------------------------Shared dependency for all endpoints----------------------------
   
    # Independent validators - avoid FastAPI inheritance issues
    common_validator: BaoCaoValidator = Depends(get_baocao_validator)
    specific_validator: BCKValidator = Depends(get_bck_validator)  

    # Access db from one of the validators
    @property
    def db(self):
        return self.specific_validator.db  # or self.common_validator.db



    # ----------------------------------API Definition---------------------------------------

    @bck_router.post(
        "/insert",
        response_model=dict,  
        status_code=status.HTTP_201_CREATED,
        summary="Insert new Faculty Report",
        description="Create a new Báo cáo cấp Khoa (Faculty-level report)"
    )
    async def insert_bao_cao_khoa(self, bao_cao: BCKCreate):
        """
        Insert a new Faculty Report (Báo cáo Khoa).
        """
        # Run common foreign key validation first
        bao_cao = await self.common_validator.validate_foreign_keys(bao_cao)
        bao_cao = await self.specific_validator.validate_business_rules(bao_cao)
        

        # 1️⃣ Insert BCK record (excluding danhMucNganh)
        bck_data = bao_cao.model_dump(exclude_unset=True, exclude={"danhMucNganh"})
        new_bck = BCK(**bck_data)
        self.db.add(new_bck)
        await self.db.commit()
        await self.db.refresh(new_bck)

        # 2️⃣ Insert ngành mappings if present
        if bao_cao.danhMucNganh:
            for nganh_enum in bao_cao.danhMucNganh:
                mapping = FDANHMUCNGANH(
                    idBaoCao=new_bck.idBaoCao,
                    idNganh=nganh_enum
                )
                self.db.add(mapping)
            await self.db.commit()

        # 3️⃣ Get enriched data and return dict response
        enriched_data = await BCKRead.from_orm_with_nganh(self.db, new_bck)
        
        return {
            "message": "✅ Faculty Report inserted successfully",
            "data": enriched_data.model_dump()  # Convert to dict
        }


    @bck_router.get(
        "/read/{report_id}",
        response_model=dict,  
        summary="Get Faculty Report by ID",
        description="Retrieve a specific Báo cáo cấp Khoa by its ID"
    )
    async def get_bao_cao_khoa(self, report_id: int):
        """
        Retrieve a Faculty Report by ID.
        """
        validated_report_id = await self.specific_validator.validate_exists(report_id)
        bao_cao = await self.db.get(BCK, validated_report_id)

        if not bao_cao:
            return {
                "message": "❌ Faculty Report not found",
                "data": None
            }

        # 🔹 Get enriched data and return dict response
        enriched_data = await BCKRead.from_orm_with_nganh(self.db, bao_cao)
        
        return {
            "message": "✅ Faculty Report retrieved successfully",
            "data": enriched_data.model_dump()  # Convert to dict
        }