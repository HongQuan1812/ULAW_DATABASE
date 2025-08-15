using Microsoft.AspNetCore.Mvc;
using api.Service;
using api.Dtos.Common;
using api.Dtos.Major;
using System.Collections.Generic;
using System.Linq;

namespace api.Controllers
{
    [Route("api/major")]
    [ApiController]
    public class MajorController : ControllerBase
    {
        private readonly MajorService _majorService;

        public MajorController(MajorService majorService)
        {
            _majorService = majorService;
        }

        [ProducesResponseType(typeof(ApiResponseDto<List<MajorDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponseDto), 404)]
        [ProducesResponseType(typeof(ApiResponseDto), 500)]
        [HttpGet]
        public IActionResult GetAllMajor(
            [FromQuery] int? majorCode,
            [FromQuery] string? subjectGroupCode)
        {
            if (!majorCode.HasValue && string.IsNullOrEmpty(subjectGroupCode))
            {
                var allMajors = _majorService.GetAllMajors();
                return Ok(new ApiResponseDto<List<MajorDto>> { Code = 200, Message = "Lấy tất cả thông tin ngành thành công", Data = allMajors });
            }

            if (majorCode.HasValue && string.IsNullOrEmpty(subjectGroupCode))
            {
                var major = _majorService.GetMajorByCode(majorCode.Value);
                if (major == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy thông tin ngành với code: {majorCode}" });
                }
                return Ok(new ApiResponseDto<MajorDto> { Code = 200, Message = "Lấy thông tin ngành thành công", Data = major });
            }

            if (majorCode.HasValue && !string.IsNullOrEmpty(subjectGroupCode))
            {
                var subjectGroup = _majorService.GetSubjectGroupByCode(majorCode.Value, subjectGroupCode);
                if (subjectGroup == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy tổ hợp môn '{subjectGroupCode}' của ngành '{majorCode}'" });
                }
                return Ok(new ApiResponseDto<SubjectGroupDto> { Code = 200, Message = "Lấy thông tin tổ hợp môn thành công", Data = subjectGroup });
            }

            return BadRequest(new ApiResponseDto { Code = 400, Message = "Tham số đầu vào không hợp lệ hoặc thiếu!" });
        }

        [ProducesResponseType(typeof(ApiResponseDto<MajorDto>), 200)]
        [ProducesResponseType(typeof(ApiResponseDto<SubjectGroupDto>), 200)] 
        [ProducesResponseType(typeof(ApiResponseDto), 400)]
        [ProducesResponseType(typeof(ApiResponseDto), 404)]
        [HttpGet("name-by-code")]
        public IActionResult GetMajorNameByCode(
            [FromQuery] int? majorCode,
            [FromQuery] string? subjectGroupCode
        )
        {
            if (!majorCode.HasValue) 
            {
                return BadRequest(new ApiResponseDto { Code = 400, Message = "Tham số 'majorCode' là bắt buộc để truy vấn tên ngành theo code." }); //
            }

            if (string.IsNullOrEmpty(subjectGroupCode)) 
            {
                var major = _majorService.GetMajorByCode(majorCode.Value); 
                if (major == null) 
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy ngành với code '{majorCode}'" }); 
                }
                return Ok(new ApiResponseDto<MajorDto> { Code = 200, Message = "Lấy tên ngành thành công", Data = major }); 
            }

            if (!string.IsNullOrEmpty(subjectGroupCode)) 
            {
                var subjectGroup = _majorService.GetSubjectGroupByCode(majorCode.Value, subjectGroupCode); 
                if (subjectGroup == null) 
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy tổ hợp môn với code '{subjectGroupCode}' của ngành '{majorCode}'" }); //
                }
                return Ok(new ApiResponseDto<SubjectGroupDto> { Code = 200, Message = "Lấy tên tổ hợp môn thành công", Data = subjectGroup }); 
            }
            
            return BadRequest(new ApiResponseDto { Code = 400, Message = "Tham số đầu vào không hợp lệ hoặc thiếu!" }); 
        }
    }
}