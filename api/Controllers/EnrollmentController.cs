using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Data;
using api.Dtos.User;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using api.Dtos.Enrollment;
using api.Dtos.Common;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Collections.Generic;
using System.IO;
using api.Service;
using api.Interfaces;
using api.Dtos.Update;
using api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace api.Controllers
{
    [ApiController]
    [Route("api/enrollment")]

    public class EnrollmentController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IEmailQueueService _emailQueueService;
        private readonly IEmailService _emailService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<EnrollmentHub> _hubContext;

        public EnrollmentController(ApplicationDBContext context, IEmailQueueService emailQueueService, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IHubContext<EnrollmentHub> hubContext)
        {
            _context = context;
            _emailQueueService = emailQueueService;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
            _hubContext = hubContext;
        }

        private async Task<string> GenerateEnrollmentCode(string trainingSystemType, string educationType)
        {
            string prefix = "";
            if (trainingSystemType == "DaoTaoTuXa")
            {
                prefix = "DTTX";
            }
            else if (trainingSystemType == "VuaLamVuaHoc")
            {
                prefix = "VLVH";
            }
            else if (trainingSystemType == "ChinhQuy")
            {
                prefix = "CQ";
            }
            else if (trainingSystemType == "SauDaiHoc")
            {
                prefix = "SDH";
            }
            else
            {
                throw new ArgumentException($"Loại hình đào tạo không hợp lệ: '{trainingSystemType}'");
            }

            string fullPrefix = $"{prefix}-{educationType}";
            int lastNumber = 0;

            if (educationType == "DH")
            {
                var maxCode = await _context.DaiHocEnrollments
                                            .Where(e => e.EnrollmentCode.StartsWith(fullPrefix))
                                            .OrderByDescending(e => e.FormId)
                                            .Select(e => e.EnrollmentCode)
                                            .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(maxCode))
                {
                    var parts = maxCode.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int num))
                    {
                        lastNumber = num;
                    }
                }
            }
            else if (educationType == "LT")
            {
                var maxCode = await _context.LienThongEnrollments
                                            .Where(e => e.EnrollmentCode.StartsWith(fullPrefix))
                                            .OrderByDescending(e => e.FormId)
                                            .Select(e => e.EnrollmentCode)
                                            .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(maxCode))
                {
                    var parts = maxCode.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int num))
                    {
                        lastNumber = num;
                    }
                }
            }
            else if (educationType == "VB2")
            {
                var maxCode = await _context.VanBang2Enrollments
                                            .Where(e => e.EnrollmentCode.StartsWith(fullPrefix))
                                            .OrderByDescending(e => e.FormId)
                                            .Select(e => e.EnrollmentCode)
                                            .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(maxCode))
                {
                    var parts = maxCode.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int num))
                    {
                        lastNumber = num;
                    }
                }
            }
            else if (educationType == "M")
            {
                var maxCode = await _context.SauDaiHocEnrollments
                                            .Where(e => e.EnrollmentCode.StartsWith(fullPrefix))
                                            .OrderByDescending(e => e.FormId)
                                            .Select(e => e.EnrollmentCode)
                                            .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(maxCode))
                {
                    var parts = maxCode.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int num))
                    {
                        lastNumber = num;
                    }
                }
            }
            else if (educationType == "P")
            {
                var maxCode = await _context.SauDaiHocEnrollments
                                            .Where(e => e.EnrollmentCode.StartsWith(fullPrefix))
                                            .OrderByDescending(e => e.FormId)
                                            .Select(e => e.EnrollmentCode)
                                            .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(maxCode))
                {
                    var parts = maxCode.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int num))
                    {
                        lastNumber = num;
                    }
                }
            }
            else if (educationType == "R")
            {
                var maxCode = await _context.SauDaiHocEnrollments
                                            .Where(e => e.EnrollmentCode.StartsWith(fullPrefix))
                                            .OrderByDescending(e => e.FormId)
                                            .Select(e => e.EnrollmentCode)
                                            .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(maxCode))
                {
                    var parts = maxCode.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int num))
                    {
                        lastNumber = num;
                    }
                }
            }

            return $"{fullPrefix}-{(lastNumber + 1).ToString("D3")}";
        }

        private string GetAdminRole(string enrollmentCode)
        {
            return enrollmentCode.ToUpper().StartsWith("SDH") ? "adminSdh" : "adminPdt";
        }

        private string GetAdminRoleDisplay(string? role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return "Chưa xác định";

            return role.ToLower() switch
            {
                "adminpdt" => "Phòng ĐT-ĐH",
                "adminsdh" => "Phòng ĐT-SĐH",
                _ => "Khác"
            };
        }

        private string MoveFromTmpAndReplace(string originalUrl, string subFolder, string newFileName)
        {
            if (string.IsNullOrWhiteSpace(originalUrl))
                return originalUrl;

            if (originalUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                originalUrl = new Uri(originalUrl).PathAndQuery;

            var wwwRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var trimmedUrl = originalUrl.TrimStart('/');
            var oldPath = Path.Combine(wwwRoot, trimmedUrl);

            if (!originalUrl.Contains("/uploads/tmp/"))
            {
                return $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{originalUrl}";
            }

            if (!System.IO.File.Exists(oldPath))
            {
                return $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{originalUrl}";
            }

            var ext = Path.GetExtension(oldPath);
            var newPath = Path.Combine(wwwRoot, "uploads", subFolder, newFileName + ext);
            var newDir = Path.GetDirectoryName(newPath);
            if (!Directory.Exists(newDir)) Directory.CreateDirectory(newDir);

            if (System.IO.File.Exists(newPath))
            {
                System.IO.File.Delete(newPath);
            }

            System.IO.File.Copy(oldPath, newPath, true);

            var relativeUrl = $"/uploads/{subFolder}/{newFileName}{ext}";
            var absoluteUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{relativeUrl}";
            return absoluteUrl;
        }

        private string EnsureAbsoluteUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url)) return url;
            if (url.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                return url;

            return $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{url}";
        }

        [HttpPost("daihoc")]
        [Authorize]
        public async Task<IActionResult> EnrollDaiHoc([FromBody] DaiHocEnrollment form)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Any())
                                       .Select(x => new { Field = x.Key, Errors = x.Value.Errors.Select(e => e.ErrorMessage) });
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
            }

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(appUserId))
            {
                return Unauthorized(new { message = "Người dùng chưa đăng nhập hoặc không có AppUserId." });
            }

            form.EnrollmentCode = await GenerateEnrollmentCode(form.TrainingSystemType, "DH");

            if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
            {
                var ext = Path.GetExtension(form.StudentInfor.StudentAvatar);
                form.StudentInfor.StudentAvatar = MoveFromTmpAndReplace(
                    form.StudentInfor.StudentAvatar,
                    "daihoc/hinh-the",
                    form.EnrollmentCode
                );
            }

            if (form.EnglishCertificate != null && !string.IsNullOrEmpty(form.EnglishCertificate.EnglishCertificateFilePath))
            {
                var ext = Path.GetExtension(form.EnglishCertificate.EnglishCertificateFilePath);
                form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                    form.EnglishCertificate.EnglishCertificateFilePath,
                    "daihoc/chung-chi/tieng-anh",
                    form.EnrollmentCode
                );
            }

            if (form.FranceCertificate != null && !string.IsNullOrEmpty(form.FranceCertificate.FranceCertificateFilePath))
            {
                var ext = Path.GetExtension(form.FranceCertificate.FranceCertificateFilePath);
                form.FranceCertificate.FranceCertificateFilePath = MoveFromTmpAndReplace(
                    form.FranceCertificate.FranceCertificateFilePath,
                    "daihoc/chung-chi/tieng-phap",
                    form.EnrollmentCode
                );
            }

            if (form.JapanCertificate != null && !string.IsNullOrEmpty(form.JapanCertificate.JapanCertificateFilePath))
            {
                var ext = Path.GetExtension(form.JapanCertificate.JapanCertificateFilePath);
                form.JapanCertificate.JapanCertificateFilePath = MoveFromTmpAndReplace(
                    form.JapanCertificate.JapanCertificateFilePath,
                    "daihoc/chung-chi/tieng-nhat",
                    form.EnrollmentCode
                );
            }

            _context.DaiHocEnrollments.Add(form);
            await _context.SaveChangesAsync();

            bool isSummarizationSuccessful = true;
            string summarizationErrorMessage = null;
            string urlAvatar = null;

            try
            {
                if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
                {
                    urlAvatar = form.StudentInfor.StudentAvatar;
                }

                var summaryEntry = new Summarization
                {
                    EnrollmentCode = form.EnrollmentCode,
                    AppUserId = appUserId,
                    StudentFirstName = form.StudentFirstName,
                    StudentLastName = form.StudentLastName,
                    StudentPhone = form.StudentPhone,
                    StudentEmail = form.StudentEmail,
                    StudentInfor = form.StudentInfor,
                    HighSchoolInfor = form.HighSchoolInfor,
                    ContactInfor = form.ContactInfor,
                    AspirationMajor = form.AspirationMajor,
                    AspirationExamGroup = form.AspirationExamGroup,
                    AspirationAdmissionMethod = form.AspirationAdmissionMethod,
                    AspirationSubject1Score = form.AspirationSubject1Score,
                    AspirationSubject2Score = form.AspirationSubject2Score,
                    AspirationSubject3Score = form.AspirationSubject3Score,
                    AspirationConfirmation = form.AspirationConfirmation,
                    TrainingSystemType = form.TrainingSystemType,
                    EducationType = "DH",
                    EnglishCertificate = form.EnglishCertificate,
                    FranceCertificate = form.FranceCertificate,
                    JapanCertificate = form.JapanCertificate,
                    RegisDate = DateTime.UtcNow,
                    UniversityInfor = null,
                    Step = 0,
                    AdminRole = GetAdminRole(form.EnrollmentCode)
                };
                _context.Summarization.Add(summaryEntry);
                await _context.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi Database khi lưu tóm tắt hồ sơ ĐH: " + (ex.InnerException?.Message ?? ex.Message);
                Console.WriteLine($"DbUpdateException when saving Summarization for DH: {summarizationErrorMessage}");
            }
            catch (ValidationException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi xác thực dữ liệu khi lưu tóm tắt hồ sơ ĐH: " + ex.Message;
                Console.WriteLine($"ValidationException when saving Summarization for DH: {summarizationErrorMessage}");
            }
            catch (Exception ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi không xác định khi lưu tóm tắt hồ sơ ĐH: " + ex.Message;
                Console.WriteLine($"General Exception when saving Summarization for DH: {summarizationErrorMessage}");
            }
            try
            {
                string fullName = $"{form.StudentLastName} {form.StudentFirstName}";
                string trainingTypeLabel = form.TrainingSystemType == "DaoTaoTuXa" ? "Đào Tạo Từ Xa"
                    : form.TrainingSystemType == "VuaLamVuaHoc" ? "Vừa Làm Vừa Học"
                    : form.TrainingSystemType == "ChinhQuy" ? "Chính quy"
                    : "Không xác định";

                string subject = "[ULAW - Đăng ký xét tuyển] - Thông tin đăng ký hồ sơ mới được cập nhật";
                string body = $@"
                    <p>Thông tin hồ sơ thí sinh vừa nộp hồ sơ:</p>
                    <ul>
                        <li>Họ và tên: <strong>{fullName}</strong></li>
                        <li>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong></li>
                        <li>Hệ đào tạo: <strong>{trainingTypeLabel}</strong></li>
                        <li>Địa chỉ Email: <strong>{form.StudentEmail}</strong></li>
                        <li>Số điện thoại: <strong>{form.StudentPhone}</strong></li>
                    </ul>
                    <p>
                        ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso' target='_blank'>
                                Truy cập trang quản lý hồ sơ
                            </a>
                    </p>";

                _emailQueueService.Enqueue("csdl-cntt@hcmulaw.edu.vn", subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi đưa Email vào hàng đợi: {ex.Message}");
            }

            await _hubContext.Clients.All.SendAsync("enrollmentDataChanged");

            return Ok(new
            {
                message = "Đăng ký thành công",
                enrollmentCode = form.EnrollmentCode,
                isSummarizationSuccessful = isSummarizationSuccessful,
                summarizationErrorMessage = summarizationErrorMessage,
                urlAvatar = urlAvatar
            });
        }

        [HttpPost("lienthong")]
        [Authorize]
        public async Task<IActionResult> EnrollLienThong([FromBody] LienThongEnrollment form)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Any())
                                       .Select(x => new { Field = x.Key, Errors = x.Value.Errors.Select(e => e.ErrorMessage) });
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
            }

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(appUserId))
            {
                return Unauthorized(new { message = "Người dùng chưa đăng nhập hoặc không có AppUserId." });
            }

            form.EnrollmentCode = await GenerateEnrollmentCode(form.TrainingSystemType, "LT");

            if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
            {
                var ext = Path.GetExtension(form.StudentInfor.StudentAvatar);
                form.StudentInfor.StudentAvatar = MoveFromTmpAndReplace(
                    form.StudentInfor.StudentAvatar,
                    "lienthong/hinh-the",
                    form.EnrollmentCode
                );
            }

            if (form.EnglishCertificate != null && !string.IsNullOrEmpty(form.EnglishCertificate.EnglishCertificateFilePath))
            {
                var ext = Path.GetExtension(form.EnglishCertificate.EnglishCertificateFilePath);
                form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                    form.EnglishCertificate.EnglishCertificateFilePath,
                    "lienthong/chung-chi/tieng-anh",
                    form.EnrollmentCode
                );
            }

            if (form.FranceCertificate != null && !string.IsNullOrEmpty(form.FranceCertificate.FranceCertificateFilePath))
            {
                var ext = Path.GetExtension(form.FranceCertificate.FranceCertificateFilePath);
                form.FranceCertificate.FranceCertificateFilePath = MoveFromTmpAndReplace(
                    form.FranceCertificate.FranceCertificateFilePath,
                    "lienthong/chung-chi/tieng-phap",
                    form.EnrollmentCode
                );
            }

            if (form.JapanCertificate != null && !string.IsNullOrEmpty(form.JapanCertificate.JapanCertificateFilePath))
            {
                var ext = Path.GetExtension(form.JapanCertificate.JapanCertificateFilePath);
                form.JapanCertificate.JapanCertificateFilePath = MoveFromTmpAndReplace(
                    form.JapanCertificate.JapanCertificateFilePath,
                    "lienthong/chung-chi/tieng-nhat",
                    form.EnrollmentCode
                );
            }

            if (form.UniversityInfor != null && !string.IsNullOrEmpty(form.UniversityInfor.UniversityDegree))
            {
                var ext = Path.GetExtension(form.UniversityInfor.UniversityDegree);
                form.UniversityInfor.UniversityDegree = MoveFromTmpAndReplace(
                    form.UniversityInfor.UniversityDegree,
                    "lienthong/bang-cap/dai-hoc",
                    form.EnrollmentCode
                );
            }

            _context.LienThongEnrollments.Add(form);
            await _context.SaveChangesAsync();

            bool isSummarizationSuccessful = true;
            string summarizationErrorMessage = null;
            string urlAvatar = null;

            try
            {
                if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
                {
                    urlAvatar = form.StudentInfor.StudentAvatar;
                }

                var summaryEntry = new Summarization
                {
                    EnrollmentCode = form.EnrollmentCode,
                    AppUserId = appUserId,
                    StudentFirstName = form.StudentFirstName,
                    StudentLastName = form.StudentLastName,
                    StudentPhone = form.StudentPhone,
                    StudentEmail = form.StudentEmail,
                    StudentInfor = form.StudentInfor,
                    HighSchoolInfor = form.HighSchoolInfor,
                    ContactInfor = form.ContactInfor,
                    AspirationMajor = form.AspirationMajor,
                    AspirationConfirmation = form.AspirationConfirmation,
                    TrainingSystemType = form.TrainingSystemType,
                    EducationType = "LT",
                    RegisDate = DateTime.UtcNow,
                    UniversityInfor = form.UniversityInfor,
                    EnglishCertificate = form.EnglishCertificate,
                    FranceCertificate = form.FranceCertificate,
                    JapanCertificate = form.JapanCertificate,
                    Step = 0,
                    AdminRole = GetAdminRole(form.EnrollmentCode)
                };
                _context.Summarization.Add(summaryEntry);
                await _context.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi Database khi lưu tóm tắt hồ sơ Liên thông: " + (ex.InnerException?.Message ?? ex.Message);
                Console.WriteLine($"DbUpdateException when saving Summarization for LT: {summarizationErrorMessage}");
            }
            catch (ValidationException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi xác thực dữ liệu khi lưu tóm tắt hồ sơ Liên thông: " + ex.Message;
                Console.WriteLine($"ValidationException when saving Summarization for LT: {summarizationErrorMessage}");
            }
            catch (Exception ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi không xác định khi lưu tóm tắt hồ sơ Liên thông: " + ex.Message;
                Console.WriteLine($"General Exception when saving Summarization for LT: {ex.Message}");
            }

            try
            {
                string fullName = $"{form.StudentLastName} {form.StudentFirstName}";
                string trainingTypeLabel = form.TrainingSystemType == "DaoTaoTuXa" ? "Đào Tạo Từ Xa"
                    : form.TrainingSystemType == "VuaLamVuaHoc" ? "Vừa Làm Vừa Học"
                    : form.TrainingSystemType == "ChinhQuy" ? "Chính quy"
                    : "Không xác định";

                string subject = "[ULAW - Đăng ký xét tuyển] - Thông tin đăng ký hồ sơ mới được cập nhật";

                string body = $@"
                            <p>Thông tin hồ sơ thí sinh vừa nộp hồ sơ:</p>
                            <ul>
                                <li>Họ và tên: <strong>{fullName}</strong></li>
                                <li>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong></li>
                                <li>Hệ đào tạo: <strong>{trainingTypeLabel}</strong></li>
                                <li>Địa chỉ Email: <strong>{form.StudentEmail}</strong></li>
                                <li>Số điện thoại: <strong>{form.StudentPhone}</strong></li>
                            </ul>
                            <p>
                                ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso' target='_blank'>
                                    Truy cập trang quản lý hồ sơ
                                </a>
                            </p>";

                _emailQueueService.Enqueue("csdl-cntt@hcmulaw.edu.vn", subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi đưa Email vào hàng đợi: {ex.Message}");
            }

            await _hubContext.Clients.All.SendAsync("enrollmentDataChanged");

            return Ok(new
            {
                message = "Đăng ký thành công",
                enrollmentCode = form.EnrollmentCode,
                isSummarizationSuccessful = isSummarizationSuccessful,
                summarizationErrorMessage = summarizationErrorMessage,
                urlAvatar = urlAvatar
            });
        }

        [HttpPost("vanbang2")]
        [Authorize]
        public async Task<IActionResult> EnrollVanBang2([FromBody] VanBang2Enrollment form)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Any())
                                       .Select(x => new { Field = x.Key, Errors = x.Value.Errors.Select(e => e.ErrorMessage) });
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
            }

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(appUserId))
            {
                return Unauthorized(new { message = "Người dùng chưa đăng nhập hoặc không có AppUserId." });
            }

            form.EnrollmentCode = await GenerateEnrollmentCode(form.TrainingSystemType, "VB2");

            if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
            {
                var ext = Path.GetExtension(form.StudentInfor.StudentAvatar);
                form.StudentInfor.StudentAvatar = MoveFromTmpAndReplace(
                    form.StudentInfor.StudentAvatar,
                    "vanbang2/hinh-the",
                    form.EnrollmentCode
                );
            }

            if (form.EnglishCertificate != null && !string.IsNullOrEmpty(form.EnglishCertificate.EnglishCertificateFilePath))
            {
                var ext = Path.GetExtension(form.EnglishCertificate.EnglishCertificateFilePath);
                form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                    form.EnglishCertificate.EnglishCertificateFilePath,
                    "vanbang2/chung-chi/tieng-anh",
                    form.EnrollmentCode
                );
            }

            if (form.FranceCertificate != null && !string.IsNullOrEmpty(form.FranceCertificate.FranceCertificateFilePath))
            {
                var ext = Path.GetExtension(form.FranceCertificate.FranceCertificateFilePath);
                form.FranceCertificate.FranceCertificateFilePath = MoveFromTmpAndReplace(
                    form.FranceCertificate.FranceCertificateFilePath,
                    "vanbang2/chung-chi/tieng-phap",
                    form.EnrollmentCode
                );
            }

            if (form.JapanCertificate != null && !string.IsNullOrEmpty(form.JapanCertificate.JapanCertificateFilePath))
            {
                var ext = Path.GetExtension(form.JapanCertificate.JapanCertificateFilePath);
                form.JapanCertificate.JapanCertificateFilePath = MoveFromTmpAndReplace(
                    form.JapanCertificate.JapanCertificateFilePath,
                    "vanbang2/chung-chi/tieng-nhat",
                    form.EnrollmentCode
                );
            }

            if (form.UniversityInfor != null && !string.IsNullOrEmpty(form.UniversityInfor.UniversityDegree))
            {
                var ext = Path.GetExtension(form.UniversityInfor.UniversityDegree);
                form.UniversityInfor.UniversityDegree = MoveFromTmpAndReplace(
                    form.UniversityInfor.UniversityDegree,
                    "vanbang2/bang-cap/dai-hoc",
                    form.EnrollmentCode
                );
            }

            _context.VanBang2Enrollments.Add(form);
            await _context.SaveChangesAsync();

            bool isSummarizationSuccessful = true;
            string summarizationErrorMessage = null;
            string urlAvatar = null;

            try
            {
                if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
                {
                    urlAvatar = form.StudentInfor.StudentAvatar;
                }

                var summaryEntry = new Summarization
                {
                    EnrollmentCode = form.EnrollmentCode,
                    AppUserId = appUserId,
                    StudentFirstName = form.StudentFirstName,
                    StudentLastName = form.StudentLastName,
                    StudentPhone = form.StudentPhone,
                    StudentEmail = form.StudentEmail,
                    StudentInfor = form.StudentInfor,
                    HighSchoolInfor = form.HighSchoolInfor,
                    ContactInfor = form.ContactInfor,
                    AspirationMajor = form.AspirationMajor,
                    AspirationConfirmation = form.AspirationConfirmation,
                    TrainingSystemType = form.TrainingSystemType,
                    EducationType = "VB2",
                    RegisDate = DateTime.UtcNow,
                    UniversityInfor = form.UniversityInfor,
                    EnglishCertificate = form.EnglishCertificate,
                    FranceCertificate = form.FranceCertificate,
                    JapanCertificate = form.JapanCertificate,
                    Step = 0,
                    AdminRole = GetAdminRole(form.EnrollmentCode)
                };
                _context.Summarization.Add(summaryEntry);
                await _context.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi Database khi lưu tóm tắt hồ sơ Văn Bằng 2: " + (ex.InnerException?.Message ?? ex.Message);
                Console.WriteLine($"DbUpdateException when saving Summarization for LT: {summarizationErrorMessage}");
            }
            catch (ValidationException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi xác thực dữ liệu khi lưu tóm tắt hồ sơ Văn Bằng 2: " + ex.Message;
                Console.WriteLine($"ValidationException when saving Summarization for VB2: {summarizationErrorMessage}");
            }
            catch (Exception ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi không xác định khi lưu tóm tắt hồ sơ Văn Bằng 2: " + ex.Message;
                Console.WriteLine($"General Exception when saving Summarization for LT: {ex.Message}");
            }

            try
            {
                string fullName = $"{form.StudentLastName} {form.StudentFirstName}";
                string trainingTypeLabel = form.TrainingSystemType == "DaoTaoTuXa" ? "Đào Tạo Từ Xa"
                    : form.TrainingSystemType == "VuaLamVuaHoc" ? "Vừa Làm Vừa Học"
                    : form.TrainingSystemType == "ChinhQuy" ? "Chính quy"
                    : "Không xác định";

                string subject = "[ULAW - Đăng ký xét tuyển] - Thông tin đăng ký hồ sơ mới được cập nhật";

                string body = $@"
                            <p>Thông tin hồ sơ thí sinh vừa nộp hồ sơ:</p>
                            <ul>
                                <li>Họ và tên: <strong>{fullName}</strong></li>
                                <li>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong></li>
                                <li>Hệ đào tạo: <strong>{trainingTypeLabel}</strong></li>
                                <li>Địa chỉ Email: <strong>{form.StudentEmail}</strong></li>
                                <li>Số điện thoại: <strong>{form.StudentPhone}</strong></li>
                            </ul>
                            <p>
                                ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso' target='_blank'>
                                    Truy cập trang quản lý hồ sơ
                                </a>
                            </p>";

                _emailQueueService.Enqueue("csdl-cntt@hcmulaw.edu.vn", subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi đưa Email vào hàng đợi: {ex.Message}");
            }

            await _hubContext.Clients.All.SendAsync("enrollmentDataChanged");

            return Ok(new
            {
                message = "Đăng ký thành công",
                enrollmentCode = form.EnrollmentCode,
                isSummarizationSuccessful = isSummarizationSuccessful,
                summarizationErrorMessage = summarizationErrorMessage,
                urlAvatar = urlAvatar
            });
        }

        [HttpPost("saudaihoc")]
        [Authorize]
        public async Task<IActionResult> EnrollSDH([FromBody] SauDaiHocEnrollment form)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Any())
                                       .Select(x => new { Field = x.Key, Errors = x.Value.Errors.Select(e => e.ErrorMessage) });
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
            }

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(appUserId))
            {
                return Unauthorized(new { message = "Người dùng chưa đăng nhập hoặc không có AppUserId." });
            }

            var educationType = form.EducationType?.ToUpper(); // "M", "P", "R"

            if (string.IsNullOrEmpty(educationType) || !"MPR".Contains(educationType))
            {
                return BadRequest(new { message = "EducationType phải là 'M', 'P' hoặc 'R'" });
            }

            form.EnrollmentCode = await GenerateEnrollmentCode(form.TrainingSystemType, educationType);

            if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
            {
                var ext = Path.GetExtension(form.StudentInfor.StudentAvatar);
                form.StudentInfor.StudentAvatar = MoveFromTmpAndReplace(
                    form.StudentInfor.StudentAvatar,
                    "saudaihoc/hinh-the",
                    form.EnrollmentCode
                );
            }

            if (form.UniversityInfor != null && !string.IsNullOrEmpty(form.UniversityInfor.UniversityDegree))
            {
                var ext = Path.GetExtension(form.UniversityInfor.UniversityDegree);
                form.UniversityInfor.UniversityDegree = MoveFromTmpAndReplace(
                    form.UniversityInfor.UniversityDegree,
                    "saudaihoc/bang-cap/dai-hoc",
                    form.EnrollmentCode
                );
            }

            if (form.EnglishCertificate != null && !string.IsNullOrEmpty(form.EnglishCertificate.EnglishCertificateFilePath))
            {
                var ext = Path.GetExtension(form.EnglishCertificate.EnglishCertificateFilePath);
                form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                    form.EnglishCertificate.EnglishCertificateFilePath,
                    "saudaihoc/chung-chi/tieng-anh",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyDegreeFile))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyDegreeFile);
                form.HighStudyInfor.HighStudyDegreeFile = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyDegreeFile,
                    "saudaihoc/bang-cap/cao-hoc",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyTranscript))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyTranscript);
                form.HighStudyInfor.HighStudyTranscript = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyTranscript,
                    "saudaihoc/bang-diem",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyApplication))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyApplication);
                form.HighStudyInfor.HighStudyApplication = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyApplication,
                    "saudaihoc/ho-so",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyBackground))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyBackground);
                form.HighStudyInfor.HighStudyBackground = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyBackground,
                    "saudaihoc/ly-lich",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyReseachExperience))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyReseachExperience);
                form.HighStudyInfor.HighStudyReseachExperience = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyReseachExperience,
                    "saudaihoc/kinh-nghiem",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyReseachProposal))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyReseachProposal);
                form.HighStudyInfor.HighStudyReseachProposal = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyReseachProposal,
                    "saudaihoc/du-thao",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyPlan))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyPlan);
                form.HighStudyInfor.HighStudyPlan = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyPlan,
                    "saudaihoc/ke-hoach",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyRecommendationLetter))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyRecommendationLetter);
                form.HighStudyInfor.HighStudyRecommendationLetter = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyRecommendationLetter,
                    "saudaihoc/thu-gioi-thieu",
                    form.EnrollmentCode
                );
            }

            if (form.HighStudyInfor != null && !string.IsNullOrEmpty(form.HighStudyInfor.HighStudyLetterForStudy))
            {
                var ext = Path.GetExtension(form.HighStudyInfor.HighStudyLetterForStudy);
                form.HighStudyInfor.HighStudyLetterForStudy = MoveFromTmpAndReplace(
                    form.HighStudyInfor.HighStudyLetterForStudy,
                    "saudaihoc/cv-di-hoc",
                    form.EnrollmentCode
                );
            }

            if (!string.IsNullOrEmpty(form.FeeFile))
            {
                var ext = Path.GetExtension(form.FeeFile);
                form.FeeFile = MoveFromTmpAndReplace(
                    form.FeeFile,
                    "saudaihoc/hoa-don",
                    form.EnrollmentCode
                );
            }

            _context.SauDaiHocEnrollments.Add(form);
            await _context.SaveChangesAsync();

            bool isSummarizationSuccessful = true;
            string summarizationErrorMessage = null;
            string urlAvatar = null;

            try
            {
                if (form.StudentInfor != null && !string.IsNullOrEmpty(form.StudentInfor.StudentAvatar))
                {
                    urlAvatar = form.StudentInfor.StudentAvatar;
                }

                var summaryEntry = new Summarization
                {
                    EnrollmentCode = form.EnrollmentCode,
                    AppUserId = appUserId,
                    StudentFirstName = form.StudentFirstName,
                    StudentLastName = form.StudentLastName,
                    StudentPhone = form.StudentPhone,
                    StudentEmail = form.StudentEmail,
                    StudentInfor = form.StudentInfor,
                    ContactInfor = form.ContactInfor,
                    UniversityInfor = form.UniversityInfor,
                    HighStudyInfor = form.HighStudyInfor,
                    EnglishCertificate = form.EnglishCertificate,
                    AspirationMajor = form.AspirationMajor,
                    AspirationConfirmation = form.AspirationConfirmation,
                    FeeFile = form.FeeFile,
                    WorkPlace = form.WorkPlace,
                    TrainingSystemType = form.TrainingSystemType,
                    EducationType = form.EducationType?.ToUpper(),
                    RegisDate = DateTime.UtcNow,
                    Step = 0,
                    AdminRole = GetAdminRole(form.EnrollmentCode)
                };
                _context.Summarization.Add(summaryEntry);
                await _context.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi Database khi lưu tóm tắt hồ sơ Liên thông: " + (ex.InnerException?.Message ?? ex.Message);
                Console.WriteLine($"DbUpdateException when saving Summarization for LT: {summarizationErrorMessage}");
            }
            catch (ValidationException ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi xác thực dữ liệu khi lưu tóm tắt hồ sơ Liên thông: " + ex.Message;
                Console.WriteLine($"ValidationException when saving Summarization for LT: {summarizationErrorMessage}");
            }
            catch (Exception ex)
            {
                isSummarizationSuccessful = false;
                summarizationErrorMessage = "Lỗi không xác định khi lưu tóm tắt hồ sơ Liên thông: " + ex.Message;
                Console.WriteLine($"General Exception when saving Summarization for LT: {ex.Message}");
            }

            try
            {
                string fullName = $"{form.StudentLastName} {form.StudentFirstName}";
                string trainingTypeLabel = form.TrainingSystemType == "SauDaiHoc" ? "Sau Đại Học"
                    : "Không xác định";

                string subject = "[ULAW - Đăng ký xét tuyển] - Thông tin đăng ký hồ sơ mới được cập nhật";

                string body = $@"
                            <p>Thông tin hồ sơ thí sinh vừa nộp hồ sơ:</p>
                            <ul>
                                <li>Họ và tên: <strong>{fullName}</strong></li>
                                <li>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong></li>
                                <li>Hệ đào tạo: <strong>{trainingTypeLabel}</strong></li>
                                <li>Địa chỉ Email: <strong>{form.StudentEmail}</strong></li>
                                <li>Số điện thoại: <strong>{form.StudentPhone}</strong></li>
                            </ul>
                            <p>
                                ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso' target='_blank'>
                                    Truy cập trang quản lý hồ sơ
                                </a>
                            </p>";

                _emailQueueService.Enqueue("thenbius1401@gmail.com", subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi đưa Email vào hàng đợi: {ex.Message}");
            }

            await _hubContext.Clients.All.SendAsync("enrollmentDataChanged");

            return Ok(new
            {
                message = "Đăng ký thành công",
                enrollmentCode = form.EnrollmentCode,
                isSummarizationSuccessful = isSummarizationSuccessful,
                summarizationErrorMessage = summarizationErrorMessage,
                urlAvatar = urlAvatar
            });
        }

        [HttpGet("get-form")]
        public async Task<IActionResult> GetFormInformationByCode([FromQuery] string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return BadRequest(new { message = "Mã hồ sơ không được để trống" });
            }

            try
            {
                var form = await _context.Summarization
                    .Include(s => s.StudentInfor)
                    .Include(s => s.HighSchoolInfor)
                    .Include(s => s.ContactInfor)
                    .Include(s => s.UniversityInfor)
                    .Include(s => s.HighStudyInfor)
                    .Include(s => s.EnglishCertificate)
                    .Include(s => s.FranceCertificate)
                    .Include(s => s.JapanCertificate)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.EnrollmentCode == code);

                if (form == null)
                {
                    return NotFound(new { message = "Không tìm thấy hồ sơ trong hệ thống." });
                }

                var dto = new AdminEnrollManagementDto
                {
                    EnrollmentCode = form.EnrollmentCode,
                    AppUserId = form.AppUserId,
                    TrainingSystemType = form.TrainingSystemType,
                    RegisDate = form.RegisDate.ToString("yyyy-MM-dd"),
                    StudentFirstName = form.StudentFirstName,
                    StudentLastName = form.StudentLastName,
                    StudentPhone = form.StudentPhone,
                    StudentEmail = form.StudentEmail,
                    StudentInfor = form.StudentInfor,
                    HighSchoolInfor = form.HighSchoolInfor,
                    UniversityInfor = form.UniversityInfor,
                    ContactInfor = form.ContactInfor,
                    HighStudyInfor = form.HighStudyInfor,
                    EnglishCertificate = form.EnglishCertificate,
                    FranceCertificate = form.FranceCertificate,
                    JapanCertificate = form.JapanCertificate,
                    AspirationMajor = form.AspirationMajor,
                    AspirationExamGroup = form.AspirationExamGroup,
                    AspirationAdmissionMethod = form.AspirationAdmissionMethod,
                    AspirationSubject1Score = form.AspirationSubject1Score,
                    AspirationSubject2Score = form.AspirationSubject2Score,
                    AspirationSubject3Score = form.AspirationSubject3Score,
                    FeeFile = form.FeeFile,
                    WorkPlace = form.WorkPlace,
                    EditDate = form.EditDate,
                    Step = form.Step,
                    AdminMess = form.AdminMess,
                    AdminName = form.AdminName,
                    AdminUsername = form.AdminUsername,
                    AdminProcessTime = form.AdminProcessTime
                };

                return Ok(new { message = $"Đã tìm thấy hồ sơ {dto.EnrollmentCode}", data = dto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi nội bộ khi xử lý hồ sơ", error = ex.Message });
            }
        }

        [HttpGet("id-info")]
        public async Task<IActionResult> Info([FromQuery(Name = "CCCD")] string studentIdCard)
        {
            if (string.IsNullOrWhiteSpace(studentIdCard))
            {
                return BadRequest(new { message = "Mã CCCD không được để trống." });
            }

            var summaryForms = await _context.Summarization
                                            .Include(s => s.StudentInfor)
                                            .Include(s => s.HighSchoolInfor)
                                            .Include(s => s.ContactInfor)
                                            .Include(s => s.UniversityInfor)
                                            .Include(s => s.HighStudyInfor)
                                            .Include(s => s.EnglishCertificate)
                                            .Include(s => s.FranceCertificate)
                                            .Include(s => s.JapanCertificate)
                                            .Where(s => s.StudentInfor.StudentIdCard == studentIdCard)
                                            .ToListAsync();
            if (summaryForms != null && summaryForms.Any())
            {
                return Ok(new { message = $"Đã tìm thấy {summaryForms.Count} hồ sơ với CCCD: {studentIdCard}", data = summaryForms });
            }

            return NotFound(new { message = $"Không tìm thấy hồ sơ với mã CCCD: {studentIdCard}" });
        }

        [HttpGet("regis-info")]
        [Authorize]
        public async Task<IActionResult> RegifInfo()
        {
            string currentAppUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentAppUserId))
            {
                return Unauthorized(new { Code = 404, Message = "Vui lòng đăng nhập để xem thông tin đăng ký." });
            }

            var registrationSummaries = await _context.Summarization
                                        .Where(s => s.AppUserId == currentAppUserId)
                                        .Select(s => new RegistrationSummaryDto
                                        {
                                            EnrollmentCode = s.EnrollmentCode,
                                            TrainingSystemType = s.TrainingSystemType,
                                            RegisDate = s.RegisDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                                            Step = s.Step,
                                            AdminMess = s.AdminMess,
                                            AdminName = s.AdminName,
                                        })
                                        .ToListAsync();

            if (registrationSummaries != null && registrationSummaries.Any())
            {
                return Ok(new ApiResponseDto<List<RegistrationSummaryDto>>
                {
                    Code = 200,
                    Message = $"Đã tìm thấy {registrationSummaries.Count} thông tin đăng ký cho người dùng.",
                    Data = registrationSummaries
                });
            }
            return NotFound(new ApiResponseDto { Code = 404, Message = "Không tìm thấy thông tin đăng ký nào cho người dùng hiện tại." });
        }

        [HttpGet("admin-search")]
        [Authorize]
        public async Task<IActionResult> SearchFrom(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchQuery = null,
            [FromQuery] string? trainingSystemType = null,
            [FromQuery] string? educationType = null,
            [FromQuery] string? sortOrder = null,
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null,
            [FromQuery] int? step = null,
            [FromQuery] string? adminName = null,
            [FromQuery] string? adminRole = null
        )
        {
            var query = _context.Summarization
                                .Include(s => s.StudentInfor)
                                .Include(s => s.ContactInfor)
                                .Include(s => s.HighSchoolInfor)
                                .Include(s => s.UniversityInfor)
                                .Include(s => s.HighStudyInfor)
                                .Include(s => s.EnglishCertificate)
                                .Include(s => s.FranceCertificate)
                                .Include(s => s.JapanCertificate)
                                .AsNoTracking();

            if (!string.IsNullOrEmpty(trainingSystemType))
            {
                query = query.Where(s => s.TrainingSystemType != null &&
                                         s.TrainingSystemType.ToLower() == trainingSystemType.ToLower());
            }

            if (!string.IsNullOrEmpty(educationType))
            {
                query = query.Where(s => s.EducationType != null &&
                                         s.EducationType.ToLower() == educationType.ToLower());
            }

            if (!string.IsNullOrEmpty(searchQuery))
            {
                string searchLower = searchQuery.ToLower();
                query = query.Where(s =>
                    (s.EnrollmentCode != null && s.EnrollmentCode.ToLower().Contains(searchLower)) ||
                    (s.StudentFirstName != null && s.StudentFirstName.ToLower().Contains(searchLower)) ||
                    (s.StudentLastName != null && s.StudentLastName.ToLower().Contains(searchLower))
                );
            }

            if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out DateTime startDateTime))
            {
                query = query.Where(s => s.RegisDate >= startDateTime);
            }
            if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out DateTime endDateTime))
            {
                endDateTime = endDateTime.Date.AddDays(1).AddTicks(-1);
                query = query.Where(s => s.RegisDate <= endDateTime);
            }

            if (!string.IsNullOrEmpty(sortOrder))
            {
                switch (sortOrder.ToLower())
                {
                    case "asc":
                        query = query.OrderBy(s => s.RegisDate);
                        break;
                    case "desc":
                        query = query.OrderByDescending(s => s.RegisDate);
                        break;
                    default:
                        query = query.OrderByDescending(s => s.RegisDate);
                        break;
                }
            }

            if (!string.IsNullOrEmpty(adminRole))
            {
                query = query.Where(s => s.AdminRole != null &&
                                         s.AdminRole.ToLower() == adminRole.ToLower());
            }
            if (step.HasValue)
            {
                query = query.Where(s => s.Step == step.Value);
            }

            if (!string.IsNullOrWhiteSpace(adminName))
            {
                query = query.Where(s => s.AdminName != null && s.AdminName.ToLower().Contains(adminName.ToLower()));
            }

            var totalCount = await query.CountAsync();
            var skip = (pageNumber - 1) * pageSize;
            var paginatedQuery = query.Skip(skip).Take(pageSize);

            var regisSummaries = await paginatedQuery
                                        .Select(s => new AdminEnrollManagementDto
                                        {
                                            EnrollmentCode = s.EnrollmentCode,
                                            AppUserId = s.AppUserId,
                                            TrainingSystemType = s.TrainingSystemType,
                                            EducationType = s.EducationType,
                                            RegisDate = s.RegisDate.ToString("yyyy-MM-dd"),
                                            StudentFirstName = s.StudentFirstName,
                                            StudentLastName = s.StudentLastName,
                                            StudentPhone = s.StudentPhone,
                                            StudentEmail = s.StudentEmail,
                                            StudentInfor = s.StudentInfor,
                                            HighSchoolInfor = s.HighSchoolInfor,
                                            UniversityInfor = s.UniversityInfor,
                                            HighStudyInfor = s.HighStudyInfor,
                                            ContactInfor = s.ContactInfor,
                                            EnglishCertificate = s.EnglishCertificate,
                                            FranceCertificate = s.FranceCertificate,
                                            JapanCertificate = s.JapanCertificate,
                                            AspirationMajor = s.AspirationMajor,
                                            AspirationExamGroup = s.AspirationExamGroup,
                                            AspirationAdmissionMethod = s.AspirationAdmissionMethod,
                                            AspirationSubject1Score = s.AspirationSubject1Score,
                                            AspirationSubject2Score = s.AspirationSubject2Score,
                                            AspirationSubject3Score = s.AspirationSubject3Score,
                                            FeeFile = s.FeeFile,
                                            WorkPlace = s.WorkPlace,
                                            Step = s.Step,
                                            AdminName = s.AdminName,
                                            AdminRole = s.AdminRole
                                        })
                                        .ToListAsync();

            if (regisSummaries != null && regisSummaries.Any())
            {

                return Ok(new ApiResponseDto<List<AdminEnrollManagementDto>>
                {
                    Code = 200,
                    Message = $"Đã tìm thấy {regisSummaries.Count} hồ sơ đăng ký trong hệ thống.",
                    Data = regisSummaries,
                    Pagination = new PaginationMetaDataDto(pageNumber, pageSize, totalCount)
                });
            }

            return NotFound(new ApiResponseDto { Code = 404, Message = "Không tìm thấy hồ sơ đăng ký nào trong hệ thống." });
        }

        [HttpGet("export-excel")]
        [Authorize]
        public async Task<IActionResult> ExportEnrollmentsToExcel(
            [FromQuery] string? searchQuery = null,
            [FromQuery] string? trainingSystemType = null,
            [FromQuery] string? educationType = null,
            [FromQuery] string? sortOrder = null,
            [FromQuery] string? sortColumn = null,
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null,
            [FromQuery] int? step = null,
            [FromQuery] string? adminName = null,
            [FromQuery] string? adminRole = null
        )
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var query = _context.Summarization
                                 .Include(s => s.StudentInfor)
                                 .Include(s => s.ContactInfor)
                                 .Include(s => s.HighSchoolInfor)
                                 .Include(s => s.UniversityInfor)
                                 .Include(s => s.HighStudyInfor)
                                 .Include(s => s.EnglishCertificate)
                                 .Include(s => s.FranceCertificate)
                                 .Include(s => s.JapanCertificate)
                                 .AsNoTracking();

            if (!string.IsNullOrEmpty(trainingSystemType))
            {
                query = query.Where(s => s.TrainingSystemType != null &&
                                         s.TrainingSystemType.ToLower() == trainingSystemType.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(adminRole))
            {
                query = query.Where(s => s.AdminRole != null && s.AdminRole.ToLower() == adminRole.ToLower());
            }

            if (!string.IsNullOrEmpty(educationType))
            {
                query = query.Where(s => s.EducationType != null &&
                                         s.EducationType.ToLower() == educationType.ToLower());
            }

            if (!string.IsNullOrEmpty(searchQuery))
            {
                string searchLower = searchQuery.ToLower();
                query = query.Where(s =>
                    (s.EnrollmentCode != null && s.EnrollmentCode.ToLower().Contains(searchLower)) ||
                    (s.StudentFirstName != null && s.StudentFirstName.ToLower().Contains(searchLower)) ||
                    (s.StudentLastName != null && s.StudentLastName.ToLower().Contains(searchLower))
                );
            }

            if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out DateTime startDateTime))
            {
                query = query.Where(s => s.RegisDate >= startDateTime);
            }
            if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out DateTime endDateTime))
            {
                endDateTime = endDateTime.Date.AddDays(1).AddTicks(-1);
                query = query.Where(s => s.RegisDate <= endDateTime);
            }

            if (step.HasValue)
            {
                query = query.Where(s => s.Step == step.Value);
            }

            if (!string.IsNullOrWhiteSpace(adminName))
            {
                query = query.Where(s => s.AdminName != null && s.AdminName.ToLower().Contains(adminName.ToLower()));
            }

            query = query.OrderByDescending(s => s.RegisDate);


            var dataToExport = await query.ToListAsync();

            if (!dataToExport.Any())
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu để xuất báo cáo!" });
            }

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("DanhSachHoSo");

                // Existing Headers
                worksheet.Cells[1, 1].Value = "Mã hồ sơ";
                worksheet.Cells[1, 2].Value = "Ngày nộp";
                worksheet.Cells[1, 3].Value = "Họ";
                worksheet.Cells[1, 4].Value = "Tên";
                worksheet.Cells[1, 5].Value = "Số CCCD/Mã định danh";
                worksheet.Cells[1, 6].Value = "Số điện thoại";
                worksheet.Cells[1, 7].Value = "Email";
                worksheet.Cells[1, 8].Value = "Hệ đào tạo";
                worksheet.Cells[1, 9].Value = "Chương trình đào tạo";
                worksheet.Cells[1, 10].Value = "Ngày, tháng, năm sinh";
                worksheet.Cells[1, 11].Value = "Giới tính";
                worksheet.Cells[1, 12].Value = "Dân tộc";
                worksheet.Cells[1, 13].Value = "Trường ĐH/CC/TC";
                worksheet.Cells[1, 14].Value = "Ngành học";
                worksheet.Cells[1, 15].Value = "GPA";
                worksheet.Cells[1, 16].Value = "Hệ điểm";
                worksheet.Cells[1, 17].Value = "Nguyện vọng đăng ký";
                worksheet.Cells[1, 18].Value = "Tổ hợp môn";
                worksheet.Cells[1, 19].Value = "Phương thức xét tuyển";
                worksheet.Cells[1, 20].Value = "Điểm môn 1";
                worksheet.Cells[1, 21].Value = "Điểm môn 2";
                worksheet.Cells[1, 22].Value = "Điểm môn 3";
                worksheet.Cells[1, 23].Value = "Trạng thái";
                worksheet.Cells[1, 24].Value = "Người xử lý";
                worksheet.Cells[1, 25].Value = "Đơn vị";

                int currentColumn = 26;

                worksheet.Cells[1, currentColumn++].Value = "Bằng tốt nghiệp";
                worksheet.Cells[1, currentColumn++].Value = "Bậc tốt nghiệp";

                // High Study Detail
                worksheet.Cells[1, currentColumn++].Value = "Trường CH";
                worksheet.Cells[1, currentColumn++].Value = "Loại bằng";
                worksheet.Cells[1, currentColumn++].Value = "Ngành TN(CNLG)";
                worksheet.Cells[1, currentColumn++].Value = "Chuyên ngành TN";
                worksheet.Cells[1, currentColumn++].Value = "Bằng tốt nghiệp (CH)";
                worksheet.Cells[1, currentColumn++].Value = "Bảng điểm";
                worksheet.Cells[1, currentColumn++].Value = "Hồ sơ";
                worksheet.Cells[1, currentColumn++].Value = "Lý lịch";
                worksheet.Cells[1, currentColumn++].Value = "Kinh nghiệm";
                worksheet.Cells[1, currentColumn++].Value = "Dự thảo";
                worksheet.Cells[1, currentColumn++].Value = "Kế hoạch";
                worksheet.Cells[1, currentColumn++].Value = "Thư giới thiệu";
                worksheet.Cells[1, currentColumn++].Value = "Công văn";

                // English Certificate Details
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Tên)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Cấp độ)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Nghe)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Đọc)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Viết)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Nói)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Tổng điểm)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Ngày cấp)";
                worksheet.Cells[1, currentColumn++].Value = "CC TA (Link)";

                // France Certificate Details
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Tên)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Cấp độ)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Nghe)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Đọc)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Viết)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Nói)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Tổng điểm)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Ngày cấp)";
                worksheet.Cells[1, currentColumn++].Value = "CC TP (Link)";

                // Japan Certificate Details
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Tên)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Cấp độ)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Nghe)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Đọc)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Từ vựng)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Tổng điểm)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Ngày cấp)";
                worksheet.Cells[1, currentColumn++].Value = "CC TN (Link)";

                // Apply styling to all headers (update range based on new columns)
                using (var range = worksheet.Cells[1, 1, 1, currentColumn - 1]) // Adjusted range
                {
                    range.Style.Font.Bold = true;
                    range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                }

                worksheet.Cells[1, 1, 1, currentColumn - 1].AutoFilter = true; // Adjusted range

                int row = 2;
                foreach (var item in dataToExport)
                {
                    worksheet.Cells[row, 1].Value = item.EnrollmentCode;
                    worksheet.Cells[row, 2].Value = item.RegisDate.ToString("yyyy-MM-dd");
                    worksheet.Cells[row, 3].Value = item.StudentLastName;
                    worksheet.Cells[row, 4].Value = item.StudentFirstName;
                    worksheet.Cells[row, 5].Value = item.StudentInfor?.StudentIdCard;
                    worksheet.Cells[row, 6].Value = item.StudentPhone;
                    worksheet.Cells[row, 7].Value = item.StudentEmail;
                    worksheet.Cells[row, 8].Value = GetTrainingSystemDisplayName(item.TrainingSystemType);
                    worksheet.Cells[row, 9].Value = GetEducationType(item.EducationType);
                    worksheet.Cells[row, 10].Value = item.StudentInfor?.StudentDob;
                    worksheet.Cells[row, 11].Value = GetGenderDisplay(item.StudentInfor?.StudentGender);
                    worksheet.Cells[row, 12].Value = item.StudentInfor?.StudentEthnicity;
                    worksheet.Cells[row, 13].Value = item.UniversityInfor?.UniversityName;
                    worksheet.Cells[row, 14].Value = item.UniversityInfor?.UniversityMajor;
                    worksheet.Cells[row, 15].Value = item.UniversityInfor?.UniversityGpa;
                    int? aspirationMajorCode = null;
                    if (int.TryParse(item.AspirationMajor, out int parsedCode))
                    {
                        aspirationMajorCode = parsedCode;
                    }
                    worksheet.Cells[row, 16].Value = GetScoreTypeName(item.UniversityInfor?.UniversityScoreType);
                    worksheet.Cells[row, 17].Value = GetMajorName(aspirationMajorCode);
                    worksheet.Cells[row, 18].Value = item.AspirationExamGroup;
                    worksheet.Cells[row, 19].Value = GetAdmissionMethodDisplay(item.AspirationAdmissionMethod);
                    worksheet.Cells[row, 20].Value = item.AspirationSubject1Score;
                    worksheet.Cells[row, 21].Value = item.AspirationSubject2Score;
                    worksheet.Cells[row, 22].Value = item.AspirationSubject3Score;
                    worksheet.Cells[row, 23].Value = GetStatusName(item.Step);
                    worksheet.Cells[row, 24].Value = item.AdminName;
                    worksheet.Cells[row, 25].Value = GetAdminRoleDisplay(item.AdminRole);

                    currentColumn = 26;

                    if (!string.IsNullOrEmpty(item.UniversityInfor?.UniversityDegree) && Uri.IsWellFormedUriString(item.UniversityInfor.UniversityDegree, UriKind.RelativeOrAbsolute))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.UniversityInfor.UniversityDegree, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = item.UniversityInfor?.UniversityDegree;
                    }

                    if (worksheet.Cells[row, 25].Value == null)
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = GetGraduateDegreeName(item.UniversityInfor?.UniversityGraduateDegree);
                    }

                    // High Study Detail
                    worksheet.Cells[row, currentColumn++].Value = item.HighStudyInfor?.HighStudyUniversity;
                    worksheet.Cells[row, currentColumn++].Value = GetDegreeName(item.HighStudyInfor?.HighStudyDegree);
                    worksheet.Cells[row, currentColumn++].Value = item.HighStudyInfor?.HighStudyGraduateMajor;
                    worksheet.Cells[row, currentColumn++].Value = GetMajorName(item.HighStudyInfor?.HighStudyTrainingMajor);
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyDegreeFile))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyDegreeFile, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyTranscript))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyTranscript, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyApplication))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyApplication, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyBackground))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyBackground, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyReseachExperience))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyReseachExperience, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyReseachProposal))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyReseachProposal, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyPlan))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyPlan, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyRecommendationLetter))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyRecommendationLetter, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }
                    if (!string.IsNullOrEmpty(item.HighStudyInfor?.HighStudyLetterForStudy))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.HighStudyInfor.HighStudyLetterForStudy, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }

                    // English Certificate Details
                    worksheet.Cells[row, currentColumn++].Value = item.EnglishCertificate?.EnglishCertificateName;
                    worksheet.Cells[row, currentColumn++].Value = item.EnglishCertificate?.EnglishCertificateLevel;
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.EnglishCertificate?.EnglishCertificateListeningScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.EnglishCertificate?.EnglishCertificateReadingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.EnglishCertificate?.EnglishCertificateWritingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.EnglishCertificate?.EnglishCertificateSpeakingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.EnglishCertificate?.EnglishCertificateTotalScore);
                    worksheet.Cells[row, currentColumn++].Value = item.EnglishCertificate?.EnglishCertificateDate;
                    // For the link, create a hyperlink
                    if (!string.IsNullOrEmpty(item.EnglishCertificate?.EnglishCertificateFilePath))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.EnglishCertificate.EnglishCertificateFilePath, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link"; // Display text for the hyperlink
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }

                    // France Certificate Details
                    worksheet.Cells[row, currentColumn++].Value = item.FranceCertificate?.FranceCertificateName;
                    worksheet.Cells[row, currentColumn++].Value = item.FranceCertificate?.FranceCertificateLevel;
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.FranceCertificate?.FranceCertificateListeningScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.FranceCertificate?.FranceCertificateReadingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.FranceCertificate?.FranceCertificateWritingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.FranceCertificate?.FranceCertificateSpeakingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.FranceCertificate?.FranceCertificateTotalScore);
                    worksheet.Cells[row, currentColumn++].Value = item.FranceCertificate?.FranceCertificateDate;
                    if (!string.IsNullOrEmpty(item.FranceCertificate?.FranceCertificateFilePath))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.FranceCertificate.FranceCertificateFilePath, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }

                    // Japan Certificate Details
                    worksheet.Cells[row, currentColumn++].Value = item.JapanCertificate?.JapanCertificateName;
                    worksheet.Cells[row, currentColumn++].Value = item.JapanCertificate?.JapanCertificateLevel;
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.JapanCertificate?.JapanCertificateListeningScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.JapanCertificate?.JapanCertificateReadingScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.JapanCertificate?.JapanCertificateVocabularyScore);
                    worksheet.Cells[row, currentColumn++].Value = ClearEmtyScore(item.JapanCertificate?.JapanCertificateTotalScore);
                    worksheet.Cells[row, currentColumn++].Value = item.JapanCertificate?.JapanCertificateDate;
                    if (!string.IsNullOrEmpty(item.JapanCertificate?.JapanCertificateFilePath))
                    {
                        var cell = worksheet.Cells[row, currentColumn++];
                        cell.Hyperlink = new Uri(item.JapanCertificate.JapanCertificateFilePath, UriKind.RelativeOrAbsolute);
                        cell.Value = "Link";
                        cell.Style.Font.UnderLine = true;
                        cell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                    }
                    else
                    {
                        worksheet.Cells[row, currentColumn++].Value = "";
                    }

                    row++;
                }

                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                string excelName = $"DanhSachHoSo_{DateTime.Now.ToString("yyyyMMddHHmmss")}.xlsx";
                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
        }

        private string ClearEmtyScore(decimal? type)
        {
            if (!type.HasValue || type == 0) return "";
            return type.Value.ToString("G29");
        }

        private string GetTrainingSystemDisplayName(string? type)
        {
            if (string.IsNullOrEmpty(type)) return "";
            switch (type)
            {
                case "DaoTaoTuXa": return "Đào Tạo Từ Xa";
                case "VuaLamVuaHoc": return "Vừa Làm Vừa Học";
                case "ChinhQuy": return "Chính Quy";
                case "SauDaiHoc": return "Sau Đại Học";
                default: return type;
            }
        }

        private string GetGenderDisplay(string? type)
        {
            if (string.IsNullOrEmpty(type)) return "";
            switch (type)
            {
                case "0": return "Nam";
                case "1": return "Nữ";
                default: return type;
            }
        }

        private string GetStatusName(int? type)
        {
            switch (type)
            {
                case 0: return "Chưa tiếp nhận";
                case 1: return "Tiếp nhận";
                case 2: return "Yêu cầu cập nhật";
                case 3: return "Từ chối";
                case 4: return "Chấp nhận";
                case 5: return "Phê duyệt";
                default: return "Chưa tiếp nhận";
            }
        }

        private string GetAdmissionMethodDisplay(string? type)
        {
            if (string.IsNullOrEmpty(type)) return "";
            switch (type)
            {
                case "HocBa": return "Học Bạ";
                case "THPTQG": return "Kết quả thi THPT Quốc Gia";
                default: return type;
            }
        }

        private string GetScoreTypeName(string? type)
        {
            if (string.IsNullOrEmpty(type)) return "";
            switch (type)
            {
                case "hs4": return "Hệ số 4";
                case "hs10": return "Hệ số 10";
                default: return type;
            }
        }

        private string GetMajorName(int? type)
        {
            if (!type.HasValue) return "";
            switch (type.Value)
            {
                case 7220201: return "Ngôn ngữ Anh";
                case 7380101: return "Luật";
                case 7380109: return "Luật thương mại quốc tế";
                case 7340102: return "Quản trị - Luật";
                case 7340101: return "Quản trị kinh doanh";
                case 7340120: return "Kinh doanh quốc tế";
                case 7340201: return "Tài chính - Ngân hàng";
                case 9380102: return "Luật hiến pháp và luật hành chính";
                case 9380103: return "Luật dân sự và tố tụng dân sự";
                case 9380104: return "Luật hình sự và tố tụng hình sự";
                case 9380107: return "Luật kinh tế";
                case 9380108: return "Luật quốc tế";
                default: return "";
            }
        }

        private string GetEducationType(string type)
        {
            switch (type)
            {
                case "VB2": return "Văn bằng 2";
                case "DH": return "Đại học";
                case "LT": return "Liên thông";
                case "M": return "Thạc sĩ";
                case "R": return "Nghiên cứu sinh";
                case "P": return "Tiến sĩ";
                default: return "";
            }
            ;
        }

        private string GetGraduateDegreeName(string? type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return "Đại học";
            }
            switch (type)
            {
                case "CD": return "Cao đẳng";
                case "TC": return "Trung cấp";
                default: return "";
            }
        }

        private string GetDegreeName(int? type)
        {
            if (!type.HasValue) return "";
            switch (type.Value)
            {
                case 1: return "Thạc sĩ";
                case 2: return "Cử nhân loại Giỏi";
                default: return "";
            }
        }

        private void TryUpdateDual<TModel, TDto>(TModel? entity1, TModel? entity2, TDto? updatedDto)
                where TModel : class
                where TDto : class
        {
            if (updatedDto == null) return;

            var dtoType = typeof(TDto);
            var props = dtoType.GetProperties();

            void ApplyUpdate(TModel? entity)
            {
                if (entity == null) return;

                var entry = _context.Entry(entity);
                foreach (var prop in props)
                {
                    var value = prop.GetValue(updatedDto);
                    if (value != null)
                    {
                        var modelProp = entry.Property(prop.Name);
                        if (modelProp != null)
                        {
                            modelProp.CurrentValue = value;
                        }
                    }
                }
            }

            ApplyUpdate(entity1);
            ApplyUpdate(entity2);
        }

        [HttpPut("daihoc/update")]
        [Authorize]
        public async Task<IActionResult> UpdateDaiHoc([FromBody] UpdateDaiHocDto dto)
        {
            var form = await _context.DaiHocEnrollments
                .Include(x => x.StudentInfor)
                .Include(x => x.HighSchoolInfor)
                .Include(x => x.ContactInfor)
                .Include(x => x.EnglishCertificate)
                .Include(x => x.FranceCertificate)
                .Include(x => x.JapanCertificate)
                .FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);

            if (form == null)
                return NotFound(new { message = "Không tìm thấy hồ sơ để cập nhật." });

            var summary = await _context.Summarization
                .Include(s => s.StudentInfor)
                .Include(s => s.HighSchoolInfor)
                .Include(s => s.ContactInfor)
                .Include(s => s.EnglishCertificate)
                .Include(s => s.FranceCertificate)
                .Include(s => s.JapanCertificate)
                .FirstOrDefaultAsync(s => s.EnrollmentCode == dto.EnrollmentCode);

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (summary?.AppUserId != appUserId)
                return Forbid();

            // Chỉ cập nhật nếu có dữ liệu
            if (dto.StudentFirstName != null) form.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) form.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) form.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) form.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) form.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) form.AspirationMajor = dto.AspirationMajor;
            if (dto.AspirationExamGroup != null) form.AspirationExamGroup = dto.AspirationExamGroup;
            if (dto.AspirationAdmissionMethod != null) form.AspirationAdmissionMethod = dto.AspirationAdmissionMethod;
            if (dto.AspirationSubject1Score.HasValue) form.AspirationSubject1Score = (decimal)dto.AspirationSubject1Score;
            if (dto.AspirationSubject2Score.HasValue) form.AspirationSubject2Score = (decimal)dto.AspirationSubject2Score;
            if (dto.AspirationSubject3Score.HasValue) form.AspirationSubject3Score = (decimal)dto.AspirationSubject3Score;

            // Cập nhật summary nếu có
            if (dto.StudentFirstName != null) summary.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) summary.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) summary.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) summary.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) summary.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) summary.AspirationMajor = dto.AspirationMajor;
            if (dto.AspirationExamGroup != null) summary.AspirationExamGroup = dto.AspirationExamGroup;
            if (dto.AspirationAdmissionMethod != null) summary.AspirationAdmissionMethod = dto.AspirationAdmissionMethod;
            if (dto.AspirationSubject1Score.HasValue)
                summary.AspirationSubject1Score = (decimal)dto.AspirationSubject1Score;
            if (dto.AspirationSubject2Score.HasValue)
                summary.AspirationSubject2Score = (decimal)dto.AspirationSubject2Score;
            if (dto.AspirationSubject3Score.HasValue)
                summary.AspirationSubject3Score = (decimal)dto.AspirationSubject3Score;

            // Cập nhật thông tin lồng bằng TryUpdateDual
            TryUpdateDual<StudentInformation, StudentInforUpdateDto>(form.StudentInfor, summary.StudentInfor, dto.StudentInfor);
            TryUpdateDual<HighSchoolInformation, HighSchoolInforUpdateDto>(form.HighSchoolInfor, summary.HighSchoolInfor, dto.HighSchoolInfor);
            TryUpdateDual<ContactInformation, ContactInformation>(form.ContactInfor, summary.ContactInfor, dto.ContactInfor);
            TryUpdateDual<EnglishCertificate, EnglishCertificate>(form.EnglishCertificate, summary.EnglishCertificate, dto.EnglishCertificate);
            TryUpdateDual<FranceCertificate, FranceCertificate>(form.FranceCertificate, summary.FranceCertificate, dto.FranceCertificate);
            TryUpdateDual<JapanCertificate, JapanCertificate>(form.JapanCertificate, summary.JapanCertificate, dto.JapanCertificate);

            if (!string.IsNullOrEmpty(form.EnglishCertificate?.EnglishCertificateFilePath))
            {
                if (form.EnglishCertificate.EnglishCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                        form.EnglishCertificate.EnglishCertificateFilePath,
                        "daihoc/chung-chi/tieng-anh",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = EnsureAbsoluteUrl(form.EnglishCertificate.EnglishCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.FranceCertificate?.FranceCertificateFilePath))
            {
                if (form.FranceCertificate.FranceCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.FranceCertificate.FranceCertificateFilePath = MoveFromTmpAndReplace(
                        form.FranceCertificate.FranceCertificateFilePath,
                        "daihoc/chung-chi/tieng-phap",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.FranceCertificate.FranceCertificateFilePath = EnsureAbsoluteUrl(form.FranceCertificate.FranceCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.JapanCertificate?.JapanCertificateFilePath))
            {
                if (form.JapanCertificate.JapanCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.JapanCertificate.JapanCertificateFilePath = MoveFromTmpAndReplace(
                        form.JapanCertificate.JapanCertificateFilePath,
                        "daihoc/chung-chi/tieng-nhat",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.JapanCertificate.JapanCertificateFilePath = EnsureAbsoluteUrl(form.JapanCertificate.JapanCertificateFilePath);
                }
            }

            // 4. Gán file path từ form sang summary
            if (form.EnglishCertificate != null && summary.EnglishCertificate != null)
                summary.EnglishCertificate.EnglishCertificateFilePath = form.EnglishCertificate.EnglishCertificateFilePath;

            if (form.FranceCertificate != null && summary.FranceCertificate != null)
                summary.FranceCertificate.FranceCertificateFilePath = form.FranceCertificate.FranceCertificateFilePath;

            if (form.JapanCertificate != null && summary.JapanCertificate != null)
                summary.JapanCertificate.JapanCertificateFilePath = form.JapanCertificate.JapanCertificateFilePath;

            form.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
            summary.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");

            await _context.SaveChangesAsync();

            var subject = "[ULAW - Đăng ký xét tuyển] - Người dùng cập nhật hồ sơ";
            var body = $@"
                        <p>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong> vừa được cập nhật bởi người dùng.</p>
                        <p>Vui lòng đăng nhập hệ thống để kiểm tra thay đổi.</p>
                        <p>
                            ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso/{form.EnrollmentCode}' target='_blank'>
                                Xem chi tiết hồ sơ
                                </a>
                        </p>
                        <p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

            _emailQueueService.EnqueueWithEnrollmentCode(summary.EnrollmentCode, "csdl-cntt@hcmulaw.edu.vn", subject, body);

            await _hubContext.Clients.All.SendAsync("enrollmentDetailDataChanged", form.EnrollmentCode);

            return Ok(new { message = "Cập nhật hồ sơ Đại học thành công." });
        }

        [HttpPut("lienthong/update")]
        [Authorize]
        public async Task<IActionResult> UpdateLienThong([FromBody] UpdateLienThongDto dto)
        {
            var form = await _context.LienThongEnrollments
                .Include(x => x.StudentInfor)
                .Include(x => x.HighSchoolInfor)
                .Include(x => x.ContactInfor)
                .Include(x => x.UniversityInfor)
                .Include(x => x.EnglishCertificate)
                .Include(x => x.FranceCertificate)
                .Include(x => x.JapanCertificate)
                .FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);

            if (form == null)
                return NotFound(new { message = "Không tìm thấy hồ sơ để cập nhật." });

            var summary = await _context.Summarization
                .Include(s => s.StudentInfor)
                .Include(s => s.HighSchoolInfor)
                .Include(s => s.ContactInfor)
                .Include(s => s.UniversityInfor)
                .Include(s => s.EnglishCertificate)
                .Include(s => s.FranceCertificate)
                .Include(s => s.JapanCertificate)
                .FirstOrDefaultAsync(s => s.EnrollmentCode == dto.EnrollmentCode);

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (summary?.AppUserId != appUserId)
                return Forbid();

            // Basic info
            if (dto.StudentFirstName != null) form.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) form.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) form.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) form.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) form.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) form.AspirationMajor = dto.AspirationMajor;

            if (dto.StudentFirstName != null) summary.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) summary.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) summary.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) summary.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) summary.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) summary.AspirationMajor = dto.AspirationMajor;

            // Related entities
            TryUpdateDual<StudentInformation, StudentInforUpdateDto>(form.StudentInfor, summary.StudentInfor, dto.StudentInfor);
            TryUpdateDual<HighSchoolInformation, HighSchoolInforUpdateDto>(form.HighSchoolInfor, summary.HighSchoolInfor, dto.HighSchoolInfor);
            TryUpdateDual<ContactInformation, ContactInformation>(form.ContactInfor, summary.ContactInfor, dto.ContactInfor);
            TryUpdateDual<UniversityInformation, UniversityInformation>(form.UniversityInfor, summary.UniversityInfor, dto.UniversityInfor);
            TryUpdateDual<EnglishCertificate, EnglishCertificate>(form.EnglishCertificate, summary.EnglishCertificate, dto.EnglishCertificate);
            TryUpdateDual<FranceCertificate, FranceCertificate>(form.FranceCertificate, summary.FranceCertificate, dto.FranceCertificate);
            TryUpdateDual<JapanCertificate, JapanCertificate>(form.JapanCertificate, summary.JapanCertificate, dto.JapanCertificate);

            if (!string.IsNullOrEmpty(form.EnglishCertificate?.EnglishCertificateFilePath))
            {
                if (form.EnglishCertificate.EnglishCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                        form.EnglishCertificate.EnglishCertificateFilePath,
                        "lienthong/chung-chi/tieng-anh",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = EnsureAbsoluteUrl(form.EnglishCertificate.EnglishCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.FranceCertificate?.FranceCertificateFilePath))
            {
                if (form.FranceCertificate.FranceCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.FranceCertificate.FranceCertificateFilePath = MoveFromTmpAndReplace(
                        form.FranceCertificate.FranceCertificateFilePath,
                        "lienthong/chung-chi/tieng-phap",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.FranceCertificate.FranceCertificateFilePath = EnsureAbsoluteUrl(form.FranceCertificate.FranceCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.JapanCertificate?.JapanCertificateFilePath))
            {
                if (form.JapanCertificate.JapanCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.JapanCertificate.JapanCertificateFilePath = MoveFromTmpAndReplace(
                        form.JapanCertificate.JapanCertificateFilePath,
                        "lienthong/chung-chi/tieng-nhat",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.JapanCertificate.JapanCertificateFilePath = EnsureAbsoluteUrl(form.JapanCertificate.JapanCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.UniversityInfor?.UniversityDegree))
            {
                if (form.UniversityInfor.UniversityDegree.Contains("/uploads/tmp/"))
                {
                    form.UniversityInfor.UniversityDegree = MoveFromTmpAndReplace(
                        form.UniversityInfor.UniversityDegree,
                        "lienthong/bang-cap/dai-hoc",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.UniversityInfor.UniversityDegree = EnsureAbsoluteUrl(form.UniversityInfor.UniversityDegree);
                }
            }

            // 4. Gán file path từ form sang summary
            if (form.EnglishCertificate != null && summary.EnglishCertificate != null)
                summary.EnglishCertificate.EnglishCertificateFilePath = form.EnglishCertificate.EnglishCertificateFilePath;

            if (form.FranceCertificate != null && summary.FranceCertificate != null)
                summary.FranceCertificate.FranceCertificateFilePath = form.FranceCertificate.FranceCertificateFilePath;

            if (form.JapanCertificate != null && summary.JapanCertificate != null)
                summary.JapanCertificate.JapanCertificateFilePath = form.JapanCertificate.JapanCertificateFilePath;

            if (form.UniversityInfor != null && summary.UniversityInfor != null)
            {
                summary.UniversityInfor.UniversityDegree = form.UniversityInfor.UniversityDegree;
            }

            form.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
            summary.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");

            await _context.SaveChangesAsync();

            var subject = "[ULAW - Đăng ký xét tuyển] - Người dùng cập nhật hồ sơ";
            var body = $@"
                        <p>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong> vừa được cập nhật bởi người dùng.</p>
                        <p>Vui lòng đăng nhập hệ thống để kiểm tra thay đổi.</p>
                        <p>
                            ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso/{form.EnrollmentCode}' target='_blank'>
                                Xem chi tiết hồ sơ
                                </a>
                        </p>
                        <p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

            _emailQueueService.EnqueueWithEnrollmentCode(summary.EnrollmentCode, "csdl-cntt@hcmulaw.edu.vn", subject, body);

            await _hubContext.Clients.All.SendAsync("enrollmentDetailDataChanged", form.EnrollmentCode);

            return Ok(new { message = "Cập nhật hồ sơ Liên thông thành công." });
        }

        [HttpPut("vanbang2/update")]
        [Authorize]
        public async Task<IActionResult> UpdateVanBang2([FromBody] UpdateVanBang2Dto dto)
        {
            var form = await _context.VanBang2Enrollments
                .Include(x => x.StudentInfor)
                .Include(x => x.HighSchoolInfor)
                .Include(x => x.ContactInfor)
                .Include(x => x.UniversityInfor)
                .Include(x => x.EnglishCertificate)
                .Include(x => x.FranceCertificate)
                .Include(x => x.JapanCertificate)
                .FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);

            if (form == null)
                return NotFound(new { message = "Không tìm thấy hồ sơ để cập nhật." });

            var summary = await _context.Summarization
                .Include(s => s.StudentInfor)
                .Include(s => s.HighSchoolInfor)
                .Include(s => s.ContactInfor)
                .Include(s => s.UniversityInfor)
                .Include(s => s.EnglishCertificate)
                .Include(s => s.FranceCertificate)
                .Include(s => s.JapanCertificate)
                .FirstOrDefaultAsync(s => s.EnrollmentCode == dto.EnrollmentCode);

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (summary?.AppUserId != appUserId)
                return Forbid();

            // Basic info
            if (dto.StudentFirstName != null) form.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) form.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) form.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) form.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) form.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) form.AspirationMajor = dto.AspirationMajor;

            if (dto.StudentFirstName != null) summary.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) summary.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) summary.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) summary.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) summary.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) summary.AspirationMajor = dto.AspirationMajor;

            // Related entities
            TryUpdateDual<StudentInformation, StudentInforUpdateDto>(form.StudentInfor, summary.StudentInfor, dto.StudentInfor);
            TryUpdateDual<HighSchoolInformation, HighSchoolInforUpdateDto>(form.HighSchoolInfor, summary.HighSchoolInfor, dto.HighSchoolInfor);
            TryUpdateDual<ContactInformation, ContactInformation>(form.ContactInfor, summary.ContactInfor, dto.ContactInfor);
            TryUpdateDual<UniversityInformation, UniversityInformation>(form.UniversityInfor, summary.UniversityInfor, dto.UniversityInfor);
            TryUpdateDual<EnglishCertificate, EnglishCertificate>(form.EnglishCertificate, summary.EnglishCertificate, dto.EnglishCertificate);
            TryUpdateDual<FranceCertificate, FranceCertificate>(form.FranceCertificate, summary.FranceCertificate, dto.FranceCertificate);
            TryUpdateDual<JapanCertificate, JapanCertificate>(form.JapanCertificate, summary.JapanCertificate, dto.JapanCertificate);

            if (!string.IsNullOrEmpty(form.EnglishCertificate?.EnglishCertificateFilePath))
            {
                if (form.EnglishCertificate.EnglishCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                        form.EnglishCertificate.EnglishCertificateFilePath,
                        "vanbang2/chung-chi/tieng-anh",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = EnsureAbsoluteUrl(form.EnglishCertificate.EnglishCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.FranceCertificate?.FranceCertificateFilePath))
            {
                if (form.FranceCertificate.FranceCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.FranceCertificate.FranceCertificateFilePath = MoveFromTmpAndReplace(
                        form.FranceCertificate.FranceCertificateFilePath,
                        "vanbang2/chung-chi/tieng-phap",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.FranceCertificate.FranceCertificateFilePath = EnsureAbsoluteUrl(form.FranceCertificate.FranceCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.JapanCertificate?.JapanCertificateFilePath))
            {
                if (form.JapanCertificate.JapanCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.JapanCertificate.JapanCertificateFilePath = MoveFromTmpAndReplace(
                        form.JapanCertificate.JapanCertificateFilePath,
                        "vanbang2/chung-chi/tieng-nhat",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.JapanCertificate.JapanCertificateFilePath = EnsureAbsoluteUrl(form.JapanCertificate.JapanCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.UniversityInfor?.UniversityDegree))
            {
                if (form.UniversityInfor.UniversityDegree.Contains("/uploads/tmp/"))
                {
                    form.UniversityInfor.UniversityDegree = MoveFromTmpAndReplace(
                        form.UniversityInfor.UniversityDegree,
                        "vanbang2/bang-cap/dai-hoc",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.UniversityInfor.UniversityDegree = EnsureAbsoluteUrl(form.UniversityInfor.UniversityDegree);
                }
            }

            // 4. Gán file path từ form sang summary
            if (form.EnglishCertificate != null && summary.EnglishCertificate != null)
                summary.EnglishCertificate.EnglishCertificateFilePath = form.EnglishCertificate.EnglishCertificateFilePath;

            if (form.FranceCertificate != null && summary.FranceCertificate != null)
                summary.FranceCertificate.FranceCertificateFilePath = form.FranceCertificate.FranceCertificateFilePath;

            if (form.JapanCertificate != null && summary.JapanCertificate != null)
                summary.JapanCertificate.JapanCertificateFilePath = form.JapanCertificate.JapanCertificateFilePath;

            if (form.UniversityInfor != null && summary.UniversityInfor != null)
            {
                summary.UniversityInfor.UniversityDegree = form.UniversityInfor.UniversityDegree;
            }

            form.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
            summary.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");

            await _context.SaveChangesAsync();

            var subject = "[ULAW - Đăng ký xét tuyển] - Người dùng cập nhật hồ sơ";
            var body = $@"
                        <p>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong> vừa được cập nhật bởi người dùng.</p>
                        <p>Vui lòng đăng nhập hệ thống để kiểm tra thay đổi.</p>
                        <p>
                            ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso/{form.EnrollmentCode}' target='_blank'>
                                Xem chi tiết hồ sơ
                                </a>
                        </p>
                        <p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

            _emailQueueService.EnqueueWithEnrollmentCode(summary.EnrollmentCode, "csdl-cntt@hcmulaw.edu.vn", subject, body);

            return Ok(new { message = "Cập nhật hồ sơ Văn bằng 2 thành công." });
        }

        [HttpPut("saudaihoc/update")]
        [Authorize]
        public async Task<IActionResult> UpdateSDH([FromBody] UpdateSDHDto dto)
        {
            var form = await _context.SauDaiHocEnrollments
                .Include(x => x.StudentInfor)
                .Include(x => x.ContactInfor)
                .Include(x => x.UniversityInfor)
                .Include(x => x.HighStudyInfor)
                .Include(x => x.EnglishCertificate)
                .FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);

            if (form == null)
                return NotFound(new { message = "Không tìm thấy hồ sơ để cập nhật." });

            var summary = await _context.Summarization
                .Include(s => s.StudentInfor)
                .Include(s => s.ContactInfor)
                .Include(s => s.UniversityInfor)
                .Include(s => s.HighStudyInfor)
                .Include(s => s.EnglishCertificate)
                .FirstOrDefaultAsync(s => s.EnrollmentCode == dto.EnrollmentCode);

            var appUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (summary?.AppUserId != appUserId)
                return Forbid();

            // Basic Info
            if (dto.StudentFirstName != null) form.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) form.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) form.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) form.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) form.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) form.AspirationMajor = dto.AspirationMajor;

            if (dto.StudentFirstName != null) summary.StudentFirstName = dto.StudentFirstName;
            if (dto.StudentLastName != null) summary.StudentLastName = dto.StudentLastName;
            if (dto.StudentPhone != null) summary.StudentPhone = dto.StudentPhone;
            if (dto.StudentEmail != null) summary.StudentEmail = dto.StudentEmail;
            if (dto.TrainingSystemType != null) summary.TrainingSystemType = dto.TrainingSystemType;
            if (dto.AspirationMajor != null) summary.AspirationMajor = dto.AspirationMajor;

            // Related entities
            TryUpdateDual<StudentInformation, StudentInforUpdateDto>(form.StudentInfor, summary.StudentInfor, dto.StudentInfor);
            TryUpdateDual<ContactInformation, ContactInformation>(form.ContactInfor, summary.ContactInfor, dto.ContactInfor);
            TryUpdateDual<UniversityInformation, UniversityInformation>(form.UniversityInfor, summary.UniversityInfor, dto.UniversityInfor);
            TryUpdateDual<EnglishCertificate, EnglishCertificate>(form.EnglishCertificate, summary.EnglishCertificate, dto.EnglishCertificate);
            TryUpdateDual<HighStudyInformation, HighStudyInformationDto>(form.HighStudyInfor, summary.HighStudyInfor, dto.HighStudyInfor);

            if (!string.IsNullOrEmpty(form.EnglishCertificate?.EnglishCertificateFilePath))
            {
                if (form.EnglishCertificate.EnglishCertificateFilePath.Contains("/uploads/tmp/"))
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = MoveFromTmpAndReplace(
                        form.EnglishCertificate.EnglishCertificateFilePath,
                        "saudaihoc/chung-chi/tieng-anh",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.EnglishCertificate.EnglishCertificateFilePath = EnsureAbsoluteUrl(form.EnglishCertificate.EnglishCertificateFilePath);
                }
            }

            if (!string.IsNullOrEmpty(form.UniversityInfor?.UniversityDegree))
            {
                if (form.UniversityInfor.UniversityDegree.Contains("/uploads/tmp/"))
                {
                    form.UniversityInfor.UniversityDegree = MoveFromTmpAndReplace(
                        form.UniversityInfor.UniversityDegree,
                        "saudaihoc/bang-cap/dai-hoc",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.UniversityInfor.UniversityDegree = EnsureAbsoluteUrl(form.UniversityInfor.UniversityDegree);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyDegreeFile))
            {
                if (form.HighStudyInfor.HighStudyDegreeFile.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyDegreeFile = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyDegreeFile,
                        "saudaihoc/bang-cap/cao-hoc",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyDegreeFile = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyDegreeFile);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyTranscript))
            {
                if (form.HighStudyInfor.HighStudyTranscript.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyTranscript = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyTranscript,
                        "saudaihoc/bang-diem",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyTranscript = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyTranscript);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyApplication))
            {
                if (form.HighStudyInfor.HighStudyApplication.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyApplication = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyApplication,
                        "saudaihoc/ho-so",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyApplication = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyApplication);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyBackground))
            {
                if (form.HighStudyInfor.HighStudyBackground.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyBackground = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyBackground,
                        "saudaihoc/ly-lich",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyBackground = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyBackground);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyReseachExperience))
            {
                if (form.HighStudyInfor.HighStudyReseachExperience.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyReseachExperience = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyReseachExperience,
                        "saudaihoc/kinh-nghiem",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyReseachExperience = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyReseachExperience);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyReseachProposal))
            {
                if (form.HighStudyInfor.HighStudyReseachProposal.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyReseachProposal = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyReseachProposal,
                        "saudaihoc/du-thao",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyReseachProposal = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyReseachProposal);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyPlan))
            {
                if (form.HighStudyInfor.HighStudyPlan.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyPlan = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyPlan,
                        "saudaihoc/ke-hoach",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyPlan = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyPlan);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyRecommendationLetter))
            {
                if (form.HighStudyInfor.HighStudyRecommendationLetter.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyRecommendationLetter = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyRecommendationLetter,
                        "saudaihoc/thu-gioi-thieu",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyRecommendationLetter = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyRecommendationLetter);
                }
            }

            if (!string.IsNullOrEmpty(form.HighStudyInfor?.HighStudyLetterForStudy))
            {
                if (form.HighStudyInfor.HighStudyLetterForStudy.Contains("/uploads/tmp/"))
                {
                    form.HighStudyInfor.HighStudyLetterForStudy = MoveFromTmpAndReplace(
                        form.HighStudyInfor.HighStudyLetterForStudy,
                        "saudaihoc/cv-di-hoc",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.HighStudyInfor.HighStudyLetterForStudy = EnsureAbsoluteUrl(form.HighStudyInfor.HighStudyLetterForStudy);
                }
            }

            if (!string.IsNullOrEmpty(form.FeeFile))
            {
                if (form.FeeFile.Contains("uploads/tmp/"))
                {
                    form.FeeFile = MoveFromTmpAndReplace(
                        form.FeeFile,
                        "saudaihoc/hoa-don",
                        form.EnrollmentCode
                    );
                }
                else
                {
                    form.FeeFile = EnsureAbsoluteUrl(form.FeeFile);
                }
            }

            if (form.EnglishCertificate != null && summary.EnglishCertificate != null)
                summary.EnglishCertificate.EnglishCertificateFilePath = form.EnglishCertificate.EnglishCertificateFilePath;

            if (form.UniversityInfor != null && summary.UniversityInfor != null)
                summary.UniversityInfor.UniversityDegree = form.UniversityInfor.UniversityDegree;

            if (form.HighStudyInfor != null && summary.HighStudyInfor != null)
            {
                summary.HighStudyInfor.HighStudyDegreeFile = form.HighStudyInfor.HighStudyDegreeFile;
                summary.HighStudyInfor.HighStudyTranscript = form.HighStudyInfor.HighStudyTranscript;
                summary.HighStudyInfor.HighStudyApplication = form.HighStudyInfor.HighStudyApplication;
                summary.HighStudyInfor.HighStudyBackground = form.HighStudyInfor.HighStudyBackground;
                summary.HighStudyInfor.HighStudyReseachExperience = form.HighStudyInfor.HighStudyReseachExperience;
                summary.HighStudyInfor.HighStudyReseachProposal = form.HighStudyInfor.HighStudyReseachProposal;
                summary.HighStudyInfor.HighStudyPlan = form.HighStudyInfor.HighStudyPlan;
                summary.HighStudyInfor.HighStudyRecommendationLetter = form.HighStudyInfor.HighStudyRecommendationLetter;
                summary.HighStudyInfor.HighStudyLetterForStudy = form.HighStudyInfor.HighStudyLetterForStudy;
            }

            form.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
            summary.EditDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");

            await _context.SaveChangesAsync();

            var subject = "[ULAW - Đăng ký xét tuyển] - Người dùng cập nhật hồ sơ";
            var body = $@"
                        <p>Mã hồ sơ: <strong>{form.EnrollmentCode}</strong> vừa được cập nhật bởi người dùng.</p>
                        <p>Vui lòng đăng nhập hệ thống để kiểm tra thay đổi.</p>
                        <p>
                            ➤ <a href='https://dkxt.hcmulaw.edu.vn/quanly-hoso/{form.EnrollmentCode}' target='_blank'>
                                Xem chi tiết hồ sơ
                                </a>
                        </p>
                        <p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

            _emailQueueService.EnqueueWithEnrollmentCode(summary.EnrollmentCode, "thenbius1401@gmail.com", subject, body);

            await _hubContext.Clients.All.SendAsync("enrollmentDetailDataChanged", form.EnrollmentCode);

            return Ok(new { message = "Cập nhật hồ sơ Sau Đại Học thành công" });
        }

        [HttpPut("{educationType}/admin-update")]
        public async Task<IActionResult> AdminUpdate([FromBody] AdminUpdateDto dto, string educationType)
        {
            var summary = await _context.Summarization.FirstOrDefaultAsync(s => s.EnrollmentCode == dto.EnrollmentCode);

            switch (educationType.ToLower())
            {
                case "daihoc":
                    {
                        var form = await _context.DaiHocEnrollments.FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);
                        if (form == null) return NotFound(new { message = "Không tìm thấy hồ sơ." });

                        form.AdminMess = dto.AdminMess ?? form.AdminMess;
                        form.Step = dto.Step ?? form.Step;
                        form.AdminProcessTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
                        form.AdminName = dto.AdminName ?? form.AdminName;
                        form.AdminUsername = dto.AdminUsername ?? form.AdminUsername;

                        if (summary != null)
                        {
                            summary.AdminMess = form.AdminMess;
                            summary.Step = form.Step;
                            summary.AdminProcessTime = form.AdminProcessTime;
                            summary.AdminName = form.AdminName;
                            summary.AdminUsername = form.AdminUsername;
                        }

                        break;
                    }

                case "lienthong":
                    {
                        var form = await _context.LienThongEnrollments.FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);
                        if (form == null) return NotFound(new { message = "Không tìm thấy hồ sơ." });

                        form.AdminMess = dto.AdminMess ?? form.AdminMess;
                        form.Step = dto.Step ?? form.Step;
                        form.AdminProcessTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
                        form.AdminName = dto.AdminName ?? form.AdminName;
                        form.AdminUsername = dto.AdminUsername ?? form.AdminUsername;

                        if (summary != null)
                        {
                            summary.AdminMess = form.AdminMess;
                            summary.Step = form.Step;
                            summary.AdminProcessTime = form.AdminProcessTime;
                            summary.AdminName = form.AdminName;
                            summary.AdminUsername = form.AdminUsername;
                        }

                        break;
                    }

                case "vanbang2":
                    {
                        var form = await _context.VanBang2Enrollments.FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);
                        if (form == null) return NotFound(new { message = "Không tìm thấy hồ sơ." });

                        form.AdminMess = dto.AdminMess ?? form.AdminMess;
                        form.Step = dto.Step ?? form.Step;
                        form.AdminProcessTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
                        form.AdminName = dto.AdminName ?? form.AdminName;
                        form.AdminUsername = dto.AdminUsername ?? form.AdminUsername;

                        if (summary != null)
                        {
                            summary.AdminMess = form.AdminMess;
                            summary.Step = form.Step;
                            summary.AdminProcessTime = form.AdminProcessTime;
                            summary.AdminName = form.AdminName;
                            summary.AdminUsername = form.AdminUsername;
                        }

                        break;
                    }

                case "saudaihoc":
                    {
                        var form = await _context.SauDaiHocEnrollments.FirstOrDefaultAsync(x => x.EnrollmentCode == dto.EnrollmentCode);
                        if (form == null) return NotFound(new { message = "Không tìm thấy hồ sơ" });

                        form.AdminMess = dto.AdminMess ?? form.AdminMess;
                        form.Step = dto.Step ?? form.Step;
                        form.AdminProcessTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
                        form.AdminName = dto.AdminName ?? form.AdminName;
                        form.AdminUsername = dto.AdminUsername ?? form.AdminUsername;

                        if (summary != null)
                        {
                            summary.AdminMess = form.AdminMess;
                            summary.Step = form.Step;
                            summary.AdminProcessTime = form.AdminProcessTime;
                            summary.AdminName = form.AdminName;
                            summary.AdminUsername = form.AdminUsername;
                        }

                        break;
                    }

                default:
                    return BadRequest(new { message = "Loại hình đào tạo không hợp lệ." });
            }

            await _context.SaveChangesAsync();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == summary.AppUserId);
            if (user != null && !string.IsNullOrEmpty(user.Email))
            {
                var subject = "[ULAW - Đăng ký xét tuyển] - Cập nhật trạng thái hồ sơ đăng ký";
                var body = $@"
                            <p>Xin chào <strong>{user.LastName} {user.FirstName}</strong>,</p>
                            <p>Hồ sơ của bạn với mã: <strong>{summary.EnrollmentCode}</strong> đã được cập nhật trạng thái mới.</p>
                            <p>Vui lòng đăng nhập hệ thống để xem chi tiết.</p>
                            <p>
                            ➤ <a href='https://dkxt.hcmulaw.edu.vn/thongtin-canhan/{summary.EnrollmentCode}' target='_blank'>
                                Xem chi tiết hồ sơ
                                </a>
                            </p>
                            <p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

                _emailQueueService.EnqueueWithEnrollmentCode(summary.EnrollmentCode, user.Email, subject, body);
            }

            await _hubContext.Clients.All.SendAsync("enrollmentDetailDataChanged", summary.EnrollmentCode);

            return Ok(new { message = "Admin cập nhật hồ sơ thành công." });
        }
    }
}
