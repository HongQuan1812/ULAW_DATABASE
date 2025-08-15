using Microsoft.AspNetCore.Mvc;
using api.Service;
using api.Dtos.Common;
using api.Dtos.Province;
using System.Collections.Generic; // Để sử dụng List
using System.Linq;
using api.Dtos.User;

namespace api.Controllers
{
    [Route("api/province")]
    [ApiController]
    public class ProvinceController : ControllerBase
    {
        private readonly ProvinceService _locationService;

        public ProvinceController(ProvinceService locationService)
        {
            _locationService = locationService;
        }

        [ProducesResponseType(typeof(ApiResponseDto<ProvinceDto>), 200)]
        [ProducesResponseType(typeof(ApiResponseDto<WardDto>), 200)]
        [ProducesResponseType(typeof(ApiResponseDto), 400)]
        [ProducesResponseType(typeof(ApiResponseDto), 404)]
        [HttpGet]
        public IActionResult GetLocation(
            [FromQuery] string? provinceCode,
            [FromQuery] string? wardCode)
        {
            if (string.IsNullOrEmpty(provinceCode) && string.IsNullOrEmpty(wardCode))
            {
                var allProvince = _locationService.GetAllProvinces();
                return Ok(new ApiResponseDto<List<ProvinceDto>> { Code = 200, Message = "Lấy tất cả thông tin Tỉnh/Thành phố thành công", Data = allProvince });
            }

            if (!string.IsNullOrEmpty(provinceCode) && string.IsNullOrEmpty(wardCode))
            {
                var provinces = _locationService.GetProvinceByCode(provinceCode);
                if (provinces == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy thông tin Tỉnh/Thành phố với code: {provinceCode}" });
                }
                return Ok(new ApiResponseDto<ProvinceDto> { Code = 200, Message = "Lấy thông tin ngành thành công", Data = provinces });
            }

            if (!string.IsNullOrEmpty(provinceCode) && !string.IsNullOrEmpty(wardCode))
            {
                var ward = _locationService.GetWardByCode(provinceCode, wardCode);
                if (ward == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy Phường/Xã '{wardCode}' của Tỉnh/Thành phố '{provinceCode}'" });
                }
                return Ok(new ApiResponseDto<WardDto> { Code = 200, Message = "Lấy thông tin Phường/Xã thành công", Data = ward });
            }

            return BadRequest(new ApiResponseDto { Code = 400, Message = "Thiếu tham số đầu vào!" });
        }

        [ProducesResponseType(typeof(ApiResponseDto<UserProvinceDto>), 200)]
        [ProducesResponseType(typeof(ApiResponseDto), 400)]
        [ProducesResponseType(typeof(ApiResponseDto), 404)]
        [HttpGet("name-by-code")]
        public IActionResult GetLocationNameByCode(
            [FromQuery] string? provinceCode,
            [FromQuery] string? wardCode)
        {
            if (string.IsNullOrEmpty(provinceCode))
            {
                return BadRequest(new ApiResponseDto { Code = 400, Message = "Tham số 'provinceCode' là bắt buộc để truy vấn tên địa lý theo code." });
            }

            if (!string.IsNullOrEmpty(provinceCode) && string.IsNullOrEmpty(wardCode))
            {
                var locationName = _locationService.GetProvinceNameByProvinceCode(provinceCode);
                if (locationName == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy Tỉnh/Thành phố với code '{provinceCode}'" });
                }
                return Ok(new ApiResponseDto<UserProvinceDto> { Code = 200, Message = "Lấy tên Tỉnh/Thành phố thành công", Data = locationName });
            }

            if (!string.IsNullOrEmpty(provinceCode) && !string.IsNullOrEmpty(wardCode))
            {
                var locationName = _locationService.GetWardNameByWardCode(provinceCode, wardCode); // <-- Gọi hàm mới
                if (locationName == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = $"Không tìm thấy Phường/Xã với code '{wardCode}' trong Tỉnh/Thành phố '{provinceCode}'" });
                }
                return Ok(new ApiResponseDto<UserProvinceDto> { Code = 200, Message = "Lấy tên Phường/Xã thành công", Data = locationName });
            }

            return BadRequest(new ApiResponseDto { Code = 400, Message = "Tham số truy vấn không hợp lệ. Vui lòng cung cấp 'provinceCode' hoặc kết hợp 'provinceCode' và 'wardCode'." });
        }
    }
}