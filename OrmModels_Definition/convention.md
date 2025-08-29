## Naming Convention

- **Table names** and **column names** must follow these rules:
    1. Start with a **lowercase** letter  
    2. Use **camelCase** (no underscores `_`)  
    3. **No diacritics** (accents removed, e.g., `đ` → `d`)  

    ✅ Example:
    - `Số_Giảng_Viên_Cần_Tuyển_Mới` -> `soGiangVienCanTuyenMoi`

- **Common Table names** must follow these rules:
    1. No abbreviation 

- **Specific Table names** must follow these rules:
    1. Turn `baocao` into `bc`
    2. Use the first letter for abbreviation

    ✅ Example:
    - `bao_cao_khoa` -> `bcK`
    - `bao_cao_van_phong_dang_uy` -> `bcVPDU`

- **Column names** must follow these rules:
    1. Use attribute name as column name (skip specifying column name, use attribute)

    2. Extract Meaningful Compound Nouns, and use every its first letters for representation, the first letter of the first word in compound noun will be uppercase

    ✅ Example:
    - `Hồ Sơ Khen Thưởng` -> `Hskt`
    - `Hồ Sơ Chuyển Đảng Chính Thức` -> `Hscdct`
    - `Vi Phạm Kỷ Luật` -> `Vpkl`


## Abbreviation Convention
- No abbreviation: in Common Schemas, comments



## SQLAlchemy column comment Convention
- No abbreviation
- No diacritics