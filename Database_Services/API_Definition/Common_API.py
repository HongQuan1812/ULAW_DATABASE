# routers/common_router.py
from fastapi import status, Depends
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter

from OrmModels_Definition.Common_OrmModels import NguoiBaoCao
from Schemas_Definition.Common_Schemas import NguoiBaoCaoCreate, NguoiBaoCaoRead
from API_Definition.Dependencies.Common_Dependencies import (
    NguoiBaoCaoValidator,
    get_nguoi_baocao_validator
)


common_router = InferringRouter()

# ======================================================
# Controller: NguoiBaoCao
# ======================================================
@cbv(common_router)
class NguoiBaoCaoController:
    # ------------------------Shared dependency for all endpoints----------------------------
    
    validator: NguoiBaoCaoValidator = Depends(get_nguoi_baocao_validator)



    # ----------------------------------API Definition---------------------------------------

    @common_router.post(
        "/nguoibaocao/insert",
        response_model=dict,
        status_code=status.HTTP_201_CREATED,
        summary="Insert a new Reporter",
        description="Create a new NguoiBaoCao (reporter). Validates foreign keys before insertion."
    )
    async def insert_nguoibaocao(self, nguoi_bao_cao: NguoiBaoCaoCreate):
        """
        Insert a new reporter (NguoiBaoCao) into the database.
        """

        # 1️⃣ Validate foreign keys (DonVi, etc.)
        nguoi_bao_cao = await self.validator.validate_foreign_keys(nguoi_bao_cao)
        nguoi_bao_cao = await self.validator.validate_chucvu(nguoi_bao_cao)

        # 2️⃣ Create new reporter entity
        new_reporter = NguoiBaoCao(
            hoVaTen=nguoi_bao_cao.hoVaTen,
            chucVu=nguoi_bao_cao.chucVu,
            emailTruong=nguoi_bao_cao.emailTruong,
            idDonVi=nguoi_bao_cao.idDonVi,
        )
        self.validator.db.add(new_reporter)
        await self.validator.db.commit()
        await self.validator.db.refresh(new_reporter)

        # 3️⃣ Return response
        return {
            "message": "✅ Reporter inserted successfully",
            "data": NguoiBaoCaoRead.model_validate(new_reporter)
        }
