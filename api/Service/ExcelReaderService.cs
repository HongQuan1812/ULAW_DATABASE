using EthnicApiExcel.Models;
using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Hosting;

namespace EthnicApiExcel.Services
{
    public class ExcelReaderService
    {
        private readonly string _excelFilePath;
        private readonly IHostEnvironment _env;

        public ExcelReaderService(IHostEnvironment env, string excelFileName)
        {
            _env = env;
            // Xây dựng đường dẫn file Excel trong wwwroot
            _excelFilePath = Path.Combine(_env.ContentRootPath, "wwwroot", excelFileName);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }
        public IEnumerable<EthnicGroup> ReadEthnicGroupsFromExcel()
        {
            var ethnicGroups = new List<EthnicGroup>();

            if (!File.Exists(_excelFilePath))
            {
                Console.WriteLine($"Không tìm thấy file Excel tại {_excelFilePath}.");
                return ethnicGroups;
            }

            try
            {
                using (var package = new ExcelPackage(new FileInfo(_excelFilePath)))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null)
                    {
                        Console.WriteLine($"Không tìm thấy worksheet nào trong file Excel tại {_excelFilePath}.");
                        return ethnicGroups;
                    }

                    int startRow = worksheet.Dimension.Start.Row;
                    int endRow = worksheet.Dimension.End.Row;

                    int currentId = 0;

                    for (int row = startRow + 1; row <= endRow; row++)
                    {
                        string? tenDanToc = worksheet.Cells[row, 1]?.GetValue<string>();

                        if (!string.IsNullOrWhiteSpace(tenDanToc))
                        {
                            currentId++;
                            ethnicGroups.Add(new EthnicGroup
                            {
                                id = currentId,
                                name = tenDanToc
                            });
                        }
                        else
                        {
                            Console.WriteLine($"Bỏ qua hàng {row} vì không có tên dân tộc.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi đọc file Excel tại {_excelFilePath}: {ex.Message}");
            }

            return ethnicGroups;
        }
    }
}