import enum
from Helper.load_file import load_config_file
import os


def _enum_schema_with_titles(enum_cls: enum.Enum):
    """Helper: produce OpenAPI schema that shows enum names with values."""
    # Use the original mapping if available, otherwise fall back to enum names
    if hasattr(enum_cls, '_original_mapping'):
        descriptions = list(enum_cls._original_mapping.keys())
        varnames = list(enum_cls._original_mapping.keys())
    else:
        descriptions = [e.name for e in enum_cls]
        varnames = [e.name for e in enum_cls]
    
    return {
        "type": "integer",
        "enum": [e.value for e in enum_cls],
        "x-enum-varnames": varnames,
        "x-enum-descriptions": descriptions,
    }


def create_donvi_enum(config_path: str = "organization_config.json") -> enum.Enum:
    excluded = ["P", "V", "TT", "VP", "K"]
    try:
        config = load_config_file(config_path)
        mapper = config.get("DonVi_Name_Mapper", {})

        if not mapper:
            raise ValueError("❌ 'DonVi_Name_Mapper' not found or empty in config")

        # Create enum dict with filtered keys
        filtered_keys = [k for k in mapper.keys() if k not in excluded]
        enum_dict = {key: idx for idx, key in enumerate(filtered_keys, start=1)}

        DonViEnum = enum.Enum("DonViEnum", enum_dict, type=int)
        
        # Store original mapping for schema generation
        DonViEnum._original_mapping = enum_dict
        # Attach schema override
        DonViEnum.__schema__ = classmethod(lambda cls: _enum_schema_with_titles(cls))
        return DonViEnum

    except FileNotFoundError as e:
        print(f"❌ Config file not found: {config_path}")
        raise e
    except (ValueError, KeyError) as e:
        print(f"⚠️ Error creating DonViEnum: {e}")
        raise e
    except Exception as e:
        print(f"🔥 Unexpected error while creating DonViEnum: {e}")
        raise e


def create_giaidoan_enum(config_path: str = "organization_config.json") -> enum.Enum:
    try:
        config = load_config_file(config_path)
        gdbc = config.get("GdbcHangNam_Mapper", {})

        if not gdbc:
            raise ValueError("❌ 'GdbcHangNam_Mapper' not found or empty in config")

        enum_dict = {}
        for key, val in gdbc.items():
            start = val.get("thoiDiemBatDau")
            end = val.get("thoiDiemKetThuc")
            if not (start and end):
                raise ValueError(f"⚠️ Missing start or end date for {key}")

            label = f"{start}-{end}"
            enum_dict[label] = int(key)

        GiaiDoanBaoCaoEnum = enum.Enum("GiaiDoanBaoCaoEnum", enum_dict, type=int)
        
        # Store original mapping for schema generation
        GiaiDoanBaoCaoEnum._original_mapping = enum_dict
        GiaiDoanBaoCaoEnum.__schema__ = classmethod(lambda cls: _enum_schema_with_titles(cls))
        return GiaiDoanBaoCaoEnum

    except FileNotFoundError as e:
        print(f"❌ Config file not found: {config_path}")
        raise e
    except (ValueError, KeyError) as e:
        print(f"⚠️ Error creating GiaiDoanBaoCaoEnum: {e}")
        raise e
    except Exception as e:
        print(f"🔥 Unexpected error while creating GiaiDoanBaoCaoEnum: {e}")
        raise e


def create_danhmucnganh_enum(config_path: str = "organization_config.json") -> enum.Enum:
    try:
        config = load_config_file(config_path)
        mapper = config.get("DanhMucNganh_Mapper", {})

        if not mapper:
            raise ValueError("❌ 'DanhMucNganh_Mapper' not found or empty in config")

        enum_dict = {key: i for i, key in enumerate(mapper.keys(), start=1)}

        DanhMucNganhEnum = enum.Enum("DanhMucNganhEnum", enum_dict, type=int)
        
        # Store both original mapping and descriptions
        DanhMucNganhEnum._original_mapping = enum_dict
        DanhMucNganhEnum._descriptions_ = mapper
        DanhMucNganhEnum.__schema__ = classmethod(lambda cls: _enum_schema_with_titles(cls))
        return DanhMucNganhEnum

    except FileNotFoundError as e:
        print(f"❌ Config file not found: {config_path}")
        raise e
    except (ValueError, KeyError) as e:
        print(f"⚠️ Error creating DanhMucNganhEnum: {e}")
        raise e
    except Exception as e:
        print(f"🔥 Unexpected error while creating DanhMucNganhEnum: {e}")
        raise e


def create_chucvu_enum(config_path: str = "common_config.json") -> enum.Enum:
    try:
        config = load_config_file(config_path)
        positions = config.get("ChucVu_list", [])

        if not positions:
            raise ValueError("❌ 'ChucVu_list' not found or empty in config")

        # preserve order from JSON
        enum_dict = {pos: idx for idx, pos in enumerate(positions, start=1)}

        ChucVuEnum = enum.Enum("ChucVuEnum", enum_dict, type=int)

        # Store original mapping for schema generation
        ChucVuEnum._original_mapping = enum_dict
        ChucVuEnum.__schema__ = classmethod(lambda cls: _enum_schema_with_titles(cls))
        return ChucVuEnum

    except FileNotFoundError as e:
        print(f"❌ Config file not found: {config_path}")
        raise e
    except (ValueError, KeyError) as e:
        print(f"⚠️ Error creating ChucVuEnum: {e}")
        raise e
    except Exception as e:
        print(f"🔥 Unexpected error while creating ChucVuEnum: {e}")
        raise e
    
if __name__ == "__main__":
    print("🧪 Testing enum creation and displaying enum names...")
    
    try:
        org_config_filename = "organization_config.json"
        common_config_filename = "common_config.json"

        # Test ChucVuEnum
        print("\n" + "="*50)
        print("Testing ChucVuEnum:")
        print("="*50)
        ChucVuEnum = create_chucvu_enum(common_config_filename)
        print(f"ChucVuEnum created with {len(ChucVuEnum)} members:")
        for member in ChucVuEnum:
            print(f"  {member.name} = {member.value}")
        
        # Test DonViEnum (assuming organization_config.json exists)
        print("\n" + "="*50)
        print("Testing DonViEnum:")
        print("="*50)
        try:
            DonViEnum = create_donvi_enum(org_config_filename)
            print(f"DonViEnum created with {len(DonViEnum)} members:")
            for member in DonViEnum:
                print(f"  {member.name} = {member.value}")
        except Exception as e:
            print(f"❌ Could not create DonViEnum: {e}")
        
        # Test GiaiDoanBaoCaoEnum
        print("\n" + "="*50)
        print("Testing GiaiDoanBaoCaoEnum:")
        print("="*50)
        try:
            GiaiDoanEnum = create_giaidoan_enum(common_config_filename)
            print(f"GiaiDoanBaoCaoEnum created with {len(GiaiDoanEnum)} members:")
            for member in GiaiDoanEnum:
                print(f"  {member.name} = {member.value}")
        except Exception as e:
            print(f"❌ Could not create GiaiDoanBaoCaoEnum: {e}")
        
        # Test DanhMucNganhEnum
        print("\n" + "="*50)
        print("Testing DanhMucNganhEnum:")
        print("="*50)
        try:
            DanhMucNganhEnum = create_danhmucnganh_enum(org_config_filename)
            print(f"DanhMucNganhEnum created with {len(DanhMucNganhEnum)} members:")
            for member in DanhMucNganhEnum:
                print(f"  {member.name} = {member.value}")
        except Exception as e:
            print(f"❌ Could not create DanhMucNganhEnum: {e}")
            
        print("\n" + "="*50)
        print("✅ Testing completed!")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")