using EthnicApiExcel.Models;
using EthnicApiExcel.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using api.Dtos.Common;

namespace api.Controllers
{
    [ApiController]
    [Route("api/ethnic")]
    public class EthnicController : ControllerBase
    {
        private readonly IEnumerable<EthnicGroup> _ethnicData;

        public EthnicController(ExcelReaderService excelReaderService)
        {
            _ethnicData = excelReaderService.ReadEthnicGroupsFromExcel();

            if (!_ethnicData.Any())
            {
                Console.WriteLine("Controller khởi tạo nhưng không có dữ liệu dân tộc nào được tải");
            }
        }

        [HttpGet]
        public IActionResult GetAllEthnicGroups()
        {
            if (!_ethnicData.Any())
            {
                return NotFound("Không có dữ liệu dân tộc nào được tìm thấy hoặc tải được");
            }
            return Ok(new ApiResponseDto<IEnumerable<EthnicGroup>> { Code = 200, Message = "Lấy tất cả dân tộc thành công", Data = _ethnicData });
        }

    }
}