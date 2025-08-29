# run_complete_database.py - Runner for all database schemas

# Standard library imports
import os
from datetime import date
from Helper.load_file import load_env_file, load_config_file


# Database setup
from Database.Database_Setup import DatabaseSetup

# Common schemas
from OrmModels_Definition.Common_OrmModels import (
    Base, 
    ToChuc, 
    DonVi, 
    NguoiBaoCao, 
    GiaiDoanBaoCao
)

# Specific report schemas - Khoa and Van Phong
from OrmModels_Definition.Van_Phong_OrmModels import (
    BCVPDUHDTCD       # VĂN PHÒNG ĐẢNG ỦY - HỘI ĐỒNG TRƯỜNG - CÔNG ĐOÀN
)

from OrmModels_Definition.Khoa_OrmModels import (
    BCK,               # Bao cao cap Khoa
    # Reference tables for K
    DANHMUCNGANH
)

# Vien (Institute) schemas
from OrmModels_Definition.Vien_OrmModels import (
    BCVLSS,           # Viện Luật So Sánh
    BCVSHTTKNDMST,    # Viện Sở Hữu Trí Tuệ, Khởi Nghiệp và Đổi Mới Sáng Tạo
    BCVDTQT,          # Viện Đào Tạo Quốc Tế
    BCVDTBD           # Viện Đào Tạo và Bồi Dưỡng
)

# Phong and TrungTam (Office and Center) schemas
from OrmModels_Definition.Phong_TrungTam_OrmModels import (
    BCPCTSV,        # Phòng Công Tác Sinh Viên (Student Affairs Office)
    BCPCSDLCNTT,    # Phòng Cơ Sở Dữ Liệu và Công Nghệ Thông Tin
    BCPCSVC,        # Phòng Cơ Sở Vật Chất (Infrastructure Office)
    BCPHCTH,       # Phòng Hành Chính - Tổng Hợp (Administrative Office)
    BCPKHCNHTPT,   # Phòng Khoa Học Công Nghệ và Hợp Tác Phát Triển
    BCPTTPC,       # Phòng Thanh Tra - Pháp Chế (Inspection and Legal Office)
    BCPTTQHDN,     # Phòng Truyền Thông và Quan Hệ Doanh Nghiệp
    BCPTCKT,       # Phòng Tài Chính - Kế Toán (Finance and Accounting Office)
    BCPTVTS,       # Phòng Tư Vấn Tuyển Sinh (Admissions Counseling Office)
    BCPTCNS,       # Phòng Tổ Chức Nhân Sự (Human Resources Office)
    BCPDTSDH,      # Phòng Đào Tạo Sau Đại Học (Postgraduate Training Office)
    BCPDTDH,       # Phòng Đào Tạo Đại Học (Undergraduate Training Office)
    BCPDBCLKT,     # Phòng Đảm Bảo Chất Lượng và Khảo Thí
    BCTV,          # Thư Viện (Library)
    BCTTTHL,       # Trung Tâm Học Liệu (Learning Materials Center)
    BCTTTVPLPVCD,   # Trung Tâm Tư Vấn Pháp Luật và Phục Vụ Cộng Đồng
    
    # Reference tables for CSDLCNTT
    THONGTINHTCSDL,
    THONGKEHTCSDL,
    THONGTINTUONGLUA,
    THONGKETUONGLUA,
    THONGTINPMDV,
    THONGKEPMDV,
    # Reference tables for CSVC
    THONGTINMMTB,
    THONGKEMUASAMMMTB,
    EquipmentCategory
)


    

def connect_to_db():
    """
    Establish a database connection using environment variables.
    
    Requires a .env file with:
        DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

    Returns:
        DatabaseSetup instance if successful.

    Raises:
        ValueError if required environment variables are missing or invalid.
    """
    # Load environment file (safe loader)
    env_path = os.path.join("..", "Database", ".env")
    load_env_file(env_path)

    print("🔄 Setting up database connection...")

    # Required environment variables
    required_vars = ["DB_USERNAME", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"]

    # Check for missing values
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        raise ValueError(f"❌ Missing required environment variables: {', '.join(missing)}")

    try:
        db = DatabaseSetup(
            username=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT")),  # convert safely
            database=os.getenv("DB_NAME"),
            echo=True
        )
        print("✅ Database connection initialized successfully")
        return db

    except ValueError as ve:
        raise ValueError(f"❌ Invalid value in environment variables: {ve}") from ve
    except Exception as e:
        raise RuntimeError(f"❌ Failed to initialize database connection: {e}") from e

def create_all_tables(db):
    """
    Safely create all database tables including common, specific, and reference tables.

    Args:
        db (DatabaseSetup): An instance of DatabaseSetup

    Returns:
        bool: True if tables created successfully, False otherwise
    """
    try:
        # Get engine
        engine = db.get_engine()
        print("🔄 Creating all database tables...")

        # Create all tables from Base metadata
        Base.metadata.create_all(engine)

        print("✅ SUCCESS! All tables created successfully!")
        return True

    except Exception as e:
        print(f"❌ Failed to create tables: {str(e)}")
        return False

    finally:
        if 'engine' in locals():
            engine.dispose()  # Clean up connection pool
            print("🔒 Engine disposed")

def insert_ToChuc(db, config_path="organization_config.json"):
    """
    Insert the organization levels (ToChuc) into the database.
    """
    config = load_config_file(config_path)
    cap_to_chuc_list = config["CapToChuc_List"]

    try:
        session = db.get_session()
        for cap in cap_to_chuc_list:
            exists = session.query(ToChuc).filter_by(capToChuc=cap).first()
            if not exists:
                session.add(ToChuc(capToChuc=cap))
                print(f"✅ Inserted ToChuc: {cap}")
            else:
                print(f"ℹ️ ToChuc '{cap}' already exists, skipped.")
        session.commit()

    except Exception as e:
        session.rollback()
        print(f"❌ Failed to insert ToChuc: {str(e)}")
        raise

    finally:
        session.close()
        print("🔒 Session closed")

def insert_DonVi(db, config_path="organization_config.json"):
    """
    Insert DonVi records for each schema class (BC...) into the database.
    DonVi will be linked to their corresponding ToChuc via idToChuc.
    """
    config = load_config_file(config_path)
    mapping = config["ToChuc_DonVi_Mapper"]

    session = db.get_session()
    created, skipped, missing_tc = 0, 0, []

    try:
        for cap_tc, class_names in mapping.items():
            tc_row = session.query(ToChuc.idToChuc).filter(ToChuc.capToChuc == cap_tc).first()
            if not tc_row:
                print(f"⚠️ ToChuc '{cap_tc}' not found in table 'toChuc'. Skipping its DonVi.")
                missing_tc.append(cap_tc)
                continue

            id_tochuc = tc_row[0]
            for class_name in class_names:
                cap_donvi = class_name
                exists = session.query(DonVi.idDonVi).filter(
                    DonVi.capDonVi == cap_donvi,
                    DonVi.idToChuc == id_tochuc
                ).first()

                if exists:
                    print(f"ℹ️ DonVi '{cap_donvi}' under ToChuc '{cap_tc}' already exists. Skipped.")
                    skipped += 1
                else:
                    session.add(DonVi(capDonVi=cap_donvi, idToChuc=id_tochuc))
                    created += 1
                    print(f"✅ Inserted DonVi '{cap_donvi}' under ToChuc '{cap_tc}' (idToChuc={id_tochuc}).")

        session.commit()
        print(f"🎉 Done. Created: {created}, Skipped: {skipped}. Missing ToChuc: {missing_tc or 'None'}")
        return True

    except Exception as e:
        session.rollback()
        print(f"❌ Failed to insert DonVi: {str(e)}")
        return False

    finally:
        session.close()
        print("🔒 Session closed")

def insert_GDBC(db, config_path="common_config.json"):
    """
    Insert recurring reporting stages (GiaiDoanBaoCao) into the database.
    The stages are loaded from a JSON config file (GdbcHangNam_Mapper).
    Uses a dummy year (1900) since we only care about month and day.
    """
    config = load_config_file(config_path)
    gdbc_config = config.get("GdbcHangNam_Mapper", {})

    try:
        session = db.get_session()
        periods = []

        # Parse config into date objects (year=1900, since only day/month matter)
        for _, stage in gdbc_config.items():
            start_day, start_month = map(int, stage["thoiDiemBatDau"].split("/"))
            end_day, end_month = map(int, stage["thoiDiemKetThuc"].split("/"))

            periods.append((
                date(1900, start_month, start_day),
                date(1900, end_month, end_day)
            ))

        # Insert into DB
        for start, end in periods:
            exists = session.query(GiaiDoanBaoCao).filter_by(
                thoiDiemBatDau=start,
                thoiDiemKetThuc=end
            ).first()
            if not exists:
                session.add(GiaiDoanBaoCao(thoiDiemBatDau=start, thoiDiemKetThuc=end))
                print(f"✅ Inserted GiaiDoanBaoCao: {start.strftime('%d/%m')} → {end.strftime('%d/%m')}")
            else:
                print(f"ℹ️ GiaiDoanBaoCao {start.strftime('%d/%m')} → {end.strftime('%d/%m')} already exists, skipped.")

        session.commit()

    except Exception as e:
        session.rollback()
        print(f"❌ Failed to insert GiaiDoanBaoCao: {str(e)}")
        raise

    finally:
        session.close()
        print("🔒 Session closed")

def insert_DanhMucNganh(db, config_path="organization_config.json"):
    """
    Insert DanhMucNganh records into the database.
    The list of majors/fields is loaded from a JSON config file.
    We store the KEY (e.g., 'L', 'QTKD') as tenNganh.
    """
    config = load_config_file(config_path)
    mapping = config.get("DanhMucNganh_Mapper", {})

    session = db.get_session()
    created, skipped = 0, 0

    try:
        for key, value in mapping.items():
            exists = session.query(DANHMUCNGANH.idNganh).filter(
                DANHMUCNGANH.tenNganh == key
            ).first()

            if exists:
                print(f"ℹ️ DanhMucNganh '{key}' already exists. Skipped.")
                skipped += 1
            else:
                session.add(DANHMUCNGANH(tenNganh=key))
                created += 1
                print(f"✅ Inserted DanhMucNganh: {key} ({value})")

        session.commit()
        print(f"🎉 Done. Created: {created}, Skipped: {skipped}")

        return True

    except Exception as e:
        session.rollback()
        print(f"❌ Failed to insert DanhMucNganh: {str(e)}")
        return False

    finally:
        session.close()
        print("🔒 Session closed")

if __name__ == "__main__": 
    org_config_path = "../OrmModels_Definition/organization_config.json"
    common_config_path = "../OrmModels_Definition/common_config.json"  
    db = connect_to_db()
    create_all_tables(db)
    insert_ToChuc(db, org_config_path)
    insert_DonVi(db, org_config_path)
    insert_DanhMucNganh(db, org_config_path)
    insert_GDBC(db, common_config_path)
    