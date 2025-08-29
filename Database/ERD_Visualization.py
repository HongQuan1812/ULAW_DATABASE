from sqlalchemy import MetaData
from graphviz import Digraph
import os
from dotenv import load_dotenv
from Helper.load_file import load_env_file, load_config_file


# Database setup
from Database.Database_Setup import DatabaseSetup

# Import all schemas like in your runner
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




def get_class_readable_name(table_class, config_path="organization_config.json"):
    """
    Get a readable department name for a table class using a JSON config mapper.
    
    Args:
        table_class (DeclarativeMeta): SQLAlchemy ORM class.
        config_path (str): Path to the JSON config file.
    
    Returns:
        str: Readable name for the department.
    """
    try:
        config = load_config_file(config_path)
        print(f"✅ Config file found: {config_path}")

        name_mapper = config.get("DonVi_Name_Mapper", {})
        class_name = table_class.__name__
        class_key = class_name[2:] if class_name.startswith("BC") else class_name  

        return name_mapper.get(class_key, class_name)

    except FileNotFoundError:
        print(f"❌ Config file not found: {config_path}")
        return getattr(table_class, "__name__", str(table_class))
    except Exception as e:
        print(f"⚠️ Error extracting readable name: {e}")
        return getattr(table_class, "__name__", str(table_class))

def find_related_tables_from_config(main_table, config_path="organization_config.json"):
    """
    Find related tables for a given main table by reading from JSON config.

    Args:
        main_table (str): Table name (from __tablename__ in SQLAlchemy, usually lowercase).
        config_path (str): Path to JSON config file.

    Returns:
        list: Related table names.
    """
    try:
        config = load_config_file(config_path)
        print(f"✅ Config file found: {config_path}")

        class_key = main_table[2:].upper() if main_table.lower().startswith("bc") else main_table.upper()
        return config.get("DonVi_RelatedTables_Mapper", {}).get(class_key, [])

    except FileNotFoundError:
        print(f"❌ Config file not found: {config_path}")
        return []
    except Exception as e:
        print(f"⚠️ Error loading related tables for {main_table}: {e}")
        return []

def discover_department_schemas(Base, config_path="organization_config.json"):
    """
    Discover department report schemas from SQLAlchemy Base using JSON config.

    Args:
        Base (DeclarativeMeta): SQLAlchemy Base.
        config_path (str): Path to JSON config file.

    Returns:
        list: List of department schema dicts.
    """
    departments = []
    try:
        for table_class in Base.registry._class_registry.values():
            if isinstance(table_class, str) or not hasattr(table_class, '__tablename__'):
                continue

            table_name = table_class.__tablename__
            if not table_name.startswith("bc"):
                continue

            class_name = table_class.__name__
            dept_code = class_name[2:] if class_name.startswith("BC") else class_name

            readable_name = get_class_readable_name(table_class, config_path)
            related_tables = find_related_tables_from_config(table_name, config_path)

            departments.append({
                'code': dept_code,
                'name': readable_name,
                'main_table': table_name,
                'related_tables': related_tables,
                'class_obj': table_class
            })

        departments.sort(key=lambda x: x['code'])

    except FileNotFoundError:
        print(f"❌ Config file not found: {config_path}")
        return []
    except Exception as e:
        print(f"❌ Error discovering department schemas: {e}")
    return departments

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





    """
    Setup database connection using environment variables.
    
    Returns:
        sqlalchemy.engine.Engine: SQLAlchemy engine object or None on failure.
    """
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        dotenv_path = os.path.join(BASE_DIR, ".env")
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path=dotenv_path)
            print("✅ .env file loaded successfully")
        else:
            print("⚠️ .env file not found, using default environment")

        db = DatabaseSetup(
            username=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 3306)),
            database=os.getenv("DB_NAME", "BCSL"),
            echo=False
        )
        return db.get_engine()
    except Exception as e:
        print(f"❌ Error setting up database connection: {e}")
        return None

def create_department_erd(metadata, department_code, department_name, main_table, related_tables=None):
    """
    Create ERD for a specific department including common schemas with title in SVG
    
    Args:
        department_code: Short code for the department (e.g., 'PCTSV', 'PCSDLCNTT')
        department_name: Full department name (will be used as title)
        main_table: Main report table for the department
        related_tables: List of additional tables specific to this department
    """
    if related_tables is None:
        related_tables = []
    
    # Common tables that should appear in every department ERD
    common_tables = [
        'toChuc',           # Organization
        'donVi',            # Unit
        'nguoiBaoCao',      # Reporter
        'giaiDoanBaoCao',   # Reporting Period
        main_table          # Department's main report table
    ]
    
    # Combine common tables with department-specific tables
    selected_tables = common_tables + related_tables
    
    # Filter to only include tables that exist in the database
    existing_tables = [table for table in selected_tables if table in metadata.tables]
    
    # MODIFIED: Create Digraph with title as label
    dot = Digraph(comment=f'{department_name} ERD', format='svg')
    
    # MODIFIED: Add main title to the graph
    dot.attr(label=f'{department_name}\\n({department_code})',
             labelloc='t',  # Title at top
             labeljust='c',  # Center alignment
             fontname='Arial Bold',
             fontsize='16',
             fontcolor='darkblue')
    
    # MODIFIED: SVG-optimized attributes with viewport control
    dot.attr(rankdir='LR', 
             bgcolor='white',
             pad='0.4',  # Slightly more padding for title
             margin='0.2')  # Small margin
    
    # MODIFIED: Tight spacing for compact layout
    dot.attr(ranksep='0.6', nodesep='0.4')  # Compact spacing
    dot.attr('edge', color='darkblue', penwidth='1.0', arrowhead='crow')
    
    # Define color scheme for different table types
    table_colors = {
        # Common tables
        'toChuc': {'fillcolor': 'lightcoral', 'color': 'darkred'},
        'donVi': {'fillcolor': 'lightcoral', 'color': 'darkred'},
        'nguoiBaoCao': {'fillcolor': 'lightcoral', 'color': 'darkred'},
        'giaiDoanBaoCao': {'fillcolor': 'lightcoral', 'color': 'darkred'},
        
        # Main report table
        main_table: {'fillcolor': 'lightblue', 'color': 'darkblue'},
        
        # Reference/lookup tables
        'default_reference': {'fillcolor': 'lightgreen', 'color': 'darkgreen'},
        
        # Statistics/tracking tables
        'default_stats': {'fillcolor': 'lightyellow', 'color': 'darkorange'}
    }
    
    # Add each table as a node
    for table_name in existing_tables:
        if table_name in metadata.tables:
            table = metadata.tables[table_name]
            
            # Determine table color based on naming patterns
            if table_name in table_colors:
                colors = table_colors[table_name]
            elif table_name.startswith('thongTin'):  # Reference tables
                colors = table_colors['default_reference']
            elif table_name.startswith('thongKe'):   # Statistics tables
                colors = table_colors['default_stats']
            else:
                colors = {'fillcolor': 'lightgray', 'color': 'black'}
            
            # FIXED: Limit column display to prevent oversized nodes
            columns = []
            column_count = 0
            max_columns = 8  # Limit columns displayed
            
            for column in table.columns:
                if column_count >= max_columns:
                    columns.append("...")
                    break
                    
                col_info = column.name
                
                # FIXED: Shorten type info
                if column.primary_key or column.foreign_keys:
                    type_str = str(column.type)
                    # Truncate long type names
                    if len(type_str) > 15:
                        type_str = type_str[:12] + "..."
                    col_info += f" : {type_str}"
                
                # Mark primary keys
                if column.primary_key:
                    col_info = f"🔑 {col_info}"
                
                # Mark foreign keys
                if column.foreign_keys:
                    col_info = f"🔗 {col_info}"
                
                # FIXED: Truncate very long column names
                if len(col_info) > 35:
                    col_info = col_info[:32] + "..."
                    
                columns.append(col_info)
                column_count += 1
            
            # Create the table label with proper escaping
            table_label = f"{table_name}|" + "\\l".join(columns) + "\\l"
            
            # FIXED: Compact node styling with controlled dimensions
            dot.node(table_name, table_label,
                    shape='record',
                    style='filled,rounded',
                    fillcolor=colors['fillcolor'],
                    color=colors['color'],
                    fontname='Arial',
                    fontsize='8',  # Smaller font for compact display
                    penwidth='1.0',
                    fixedsize='false',  # Allow flexible sizing
                    margin='0.1')  # Minimal internal margin
    
    # Add relationships based on foreign keys
    added_relationships = set()
    for table_name in existing_tables:
        if table_name in metadata.tables:
            table = metadata.tables[table_name]
            for fk in table.foreign_keys:
                referenced_table = fk.column.table.name
                if referenced_table in existing_tables:
                    # Get the foreign key column name
                    fk_column = next(col.name for col in table.columns if fk in col.foreign_keys)
                    
                    # FIXED: Truncate long FK labels
                    if len(fk_column) > 15:
                        fk_label = fk_column[:12] + "..."
                    else:
                        fk_label = fk_column
                    
                    # Create a unique relationship identifier
                    rel_id = f"{table_name}->{referenced_table}"
                    if rel_id not in added_relationships:
                        dot.edge(table_name, referenced_table,
                               label=f"  {fk_label}  ",
                               fontsize='6',  # Smaller edge labels
                               fontcolor='darkblue',
                               arrowsize='0.8')  # Smaller arrows
                        added_relationships.add(rel_id)
    
    return dot


def main():
    config_path = os.path.join("..", "OrmModels_Definition", "organization_config.json")

    # Create output folder for ERD images
    output_root = "Database"
    output_folder = os.path.join(output_root, "Department_ERD")
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"📁 Created folder: {output_folder}")

    # Connect to your database using the provided function
    try:
        db_setup = connect_to_db()
        engine = db_setup.get_engine()
        print("🔗 Database connection established successfully")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        exit(1)

    # Load existing schema into MetaData
    metadata = MetaData()
    try:
        metadata.reflect(bind=engine)
        print(f"📋 Schema reflected - found {len(metadata.tables)} tables")
    except Exception as e:
        print(f"❌ Failed to reflect database schema: {e}")
        exit(1)

    # Discover departments automatically using the provided function
    print("🔍 Discovering department schemas...")
    try:
        # Assuming you have a Base object from SQLAlchemy declarative_base()
        departments = discover_department_schemas(Base, config_path)
        print(f"✅ Found {len(departments)} department report schemas")
        
        if len(departments) == 0:
            print("⚠️ No departments found. Please check your table naming convention and Base registry.")
            exit(1)
            
    except Exception as e:
        print(f"❌ Error discovering departments: {e}")
        exit(1)

    # Generate ERDs
    print("🎨 Generating Department-Specific ERDs with Titles...\n")

    # Create department-specific ERDs using discovered schemas
    successful_erds = []
    failed_erds = []

    for i, dept in enumerate(departments, 1):
        try:
            print(f"{i:2d}. Creating ERD for {dept['name'][:50]}...")
            
            # Use the provided create_department_erd function
            dept_graph = create_department_erd(
                metadata,
                dept['code'], 
                dept['name'], 
                dept['main_table'], 
                dept['related_tables']
            )
            
            filename = f"{dept['code'].lower()}_erd"
            output_path = os.path.join(output_folder, filename)
            dept_graph.render(output_path, cleanup=True)
            
            print(f"    ✅ {dept['code']} ERD saved as {output_folder}/{filename}.svg")
            successful_erds.append(dept)
            
        except Exception as e:
            print(f"    ❌ Error creating {dept['code']} ERD: {e}")
            failed_erds.append((dept, str(e)))

    # Print comprehensive summary
    print(f"\n📊 Database Analysis Summary:")
    print(f"Total tables found: {len(metadata.tables)}")
    print(f"Common tables: toChuc, donVi, nguoiBaoCao, giaiDoanBaoCao")
    print(f"Department report tables: {len(departments)}")
    print(f"Successfully generated ERDs: {len(successful_erds)}")
    print(f"Failed ERD generations: {len(failed_erds)}")

    if successful_erds:
        print(f"\n💡 Generated ERD Files:")
        for dept in successful_erds:
            filename = f"{dept['code'].lower()}_erd.svg"
            print(f"• {output_folder}/{filename} - {dept['name'][:60]}")

    if failed_erds:
        print(f"\n❌ Failed ERD Generations:")
        for dept, error in failed_erds:
            print(f"• {dept['code']} - {error}")

    print(f"\n🎨 Color Legend:")
    print(f"• Red tables: Common organizational structure")
    print(f"• Blue tables: Department-specific reports")
    print(f"• Green tables: Reference/lookup data")
    print(f"• Yellow tables: Statistics/tracking data")
    print(f"• 🔑 Primary keys, 🔗 Foreign keys")

    print(f"\n📋 Discovered Departments:")
    for i, dept in enumerate(departments, 1):
        related_count = len(dept['related_tables'])
        status = "✅" if dept in successful_erds else "❌"
        print(f"{i:2d}. {status} {dept['code']:15} | {dept['main_table']:20} | {related_count} related tables | {dept['name'][:40]}")

    print(f"\n🔧 Auto-discovery found {len(departments)} departments with their related tables automatically!")

    # Additional diagnostics
    print(f"\n🔍 Technical Details:")
    print(f"Config path used: OrmModels_Definition/organization_config.json")
    print(f"Database connection: {engine.url}")
    print(f"Output directory: {os.path.abspath(output_folder)}")

    # Cleanup database connection
    try:
        engine.dispose()
        print(f"🔌 Database connection closed")
    except Exception as e:
        print(f"⚠️ Warning: Error closing database connection: {e}")



if __name__ == "__main__":    
    main()