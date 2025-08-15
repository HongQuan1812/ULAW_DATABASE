using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;

namespace api.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public UploadController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [Route("picture")]
        [HttpPost]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không có file nào được tải lên" });
            }

            var allowedExtensions = new[] { ".jpg" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new { message = "Chỉ chấp nhận file ảnh đuôi: JPG" });
            }

            var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", "tmp");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/uploads/tmp/{uniqueFileName}";
                Console.WriteLine($"File saved at: {filePath}, Path URL: {fileUrl}");

                return Ok(new { url = fileUrl, message = "Tải ảnh lên thành công" });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error Uploading: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi tải ảnh lên server", error = ex.Message });
            }
        }

        [Route("file")]
        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            var allowedExtensions = new[] { ".pdf" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", "tmp");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            try
            {
                var uniqueFileName = Guid.NewGuid().ToString() + fileExtension; 
                var filePath = Path.Combine(uploadsFolder, uniqueFileName); 

                using (var stream = new FileStream(filePath, FileMode.Create)) 
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/uploads/tmp/{uniqueFileName}";
                Console.WriteLine($"File saved at: {Path.Combine(uploadsFolder, file.FileName)}, Path URL: {fileUrl}");

                return Ok(new { url = fileUrl, message = "Tải chứng chỉ tiếng Anh lên thành công" });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error Uploading: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi tải chứng chỉ tiếng Anh lên server", error = ex.Message });
            }
        }
    }
}