import os
from Helper.create_enum import (
    create_donvi_enum,
    create_giaidoan_enum,
    create_chucvu_enum,
    create_danhmucnganh_enum
)

org_config_filename = "organization_config.json"
common_config_filename = "common_config.json"

DonViEnum = create_donvi_enum(org_config_filename)
GdbcEnum = create_giaidoan_enum(common_config_filename)
ChucVuEnum = create_chucvu_enum(common_config_filename)
DanhMucNganhEnum = create_danhmucnganh_enum(org_config_filename)

# So *_Schemas.py can just do:
# from Schemas_Definition import DonViEnum, GdbcEnum, ChucVuEnum
