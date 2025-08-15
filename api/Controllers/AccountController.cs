using api.Data;
using api.Dtos.Account;
using api.Dtos.Common;
using api.Dtos.User;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]

    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly ApplicationDBContext _context;
        private readonly IEmailQueueService _emailQueueService;
        private readonly IHubContext<UserHub> _hubContext;

        public AccountController(UserManager<AppUser> userManager,
                                 ITokenService tokenService,
                                 SignInManager<AppUser> signInManager,
                                 IEmailService emailService,
                                 ApplicationDBContext context,
                                 IEmailQueueService emailQueueService,
                                 IHubContext<UserHub> hubContext
                                 )
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailService = emailService;
            _context = context;
            _emailQueueService = emailQueueService;
            _hubContext = hubContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new ApiResponseDto
                    {
                        Code = 400,
                        Message = "Lỗi dữ liệu đầu vào!"
                    });
                }

                var userExistsByUsername = await _userManager.FindByNameAsync(registerDto.Username);
                if (userExistsByUsername != null)
                {
                    return BadRequest(new ApiResponseDto { Code = 400, Message = "Tên đăng nhập đã tồn tại! Vui lòng sử dụng Tên đăng nhập khác!" });
                }

                var userExistsByEmail = await _userManager.FindByEmailAsync(registerDto.Email);
                if (userExistsByEmail != null)
                {
                    return BadRequest(new ApiResponseDto { Code = 400, Message = "Email đã tồn tại! Vui lòng sử dụng Email khác!" });
                }

                string finalRole = "user";
                if (!string.IsNullOrEmpty(registerDto.Role))
                {
                    finalRole = registerDto.Role;
                }

                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    PhoneNumber = registerDto.PhoneNumber,
                    Role = finalRole
                };

                string generatedPassword = GenerateStrongRandomPassword(10);

                var createdUser = await _userManager.CreateAsync(appUser, generatedPassword);

                if (createdUser.Succeeded)
                {
                    var emailSubject = "[ULAW - Đăng ký xét tuyển] - Thông tin tài khoản đăng nhập";
                    var emailBody = $@"
                                    <p>Xin chào <strong>{appUser.LastName} {appUser.FirstName}</strong>,<br/><br/></p>
                                    <p>Tài khoản của bạn đã được tạo thành công.</p>
                                    <p>➤ Tên đăng nhập: <strong>{appUser.UserName}</strong></p>
                                    <p>➤ Mật khẩu: <strong>{generatedPassword}</strong><br/><br/></p>
                                    <p>Vui lòng thay đổi mật khẩu sau lần đăng nhập đầu tiên để bảo mật tài khoản của bạn.<br/><br/></p>
                                    <p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

                    _emailQueueService.Enqueue(appUser.Email, emailSubject, emailBody);

                    await _hubContext.Clients.All.SendAsync("userDataChanged");

                    return Ok(new ApiResponseDto
                    {
                        Code = 200,
                        Message = "Đăng ký thành công! Thông tin tài khoản đã được gửi đến Email của bạn!"
                    });
                }
                else
                {
                    var identityErrors = createdUser.Errors.Select(e => e.Description).ToList();
                    return StatusCode(500, new ApiResponseDto { Code = 500, Message = "Đăng ký thất bại!" });
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new ApiResponseDto { Code = 500, Message = $"Lỗi máy chủ nội bộ: {e.Message}" });
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new ApiResponseDto
                {
                    Code = 400,
                    Message = "Lỗi dữ liệu đầu vào!"
                });
            }

            var user = await _userManager.Users
                                         .Include(u => u.Summarization)
                                            .ThenInclude(s => s.StudentInfor)
                                         .FirstOrDefaultAsync(u => u.UserName == loginDto.Username); //


            if (user == null)
            {
                return Unauthorized(new ApiResponseDto { Code = 401, Message = "Tên đăng nhập hoặc Mật khẩu không đúng!" });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new ApiResponseDto { Code = 401, Message = "Tên đăng nhập hoặc Mật khẩu không đúng!" });
            }

            var latestSummary = user.Summarization?.OrderByDescending(s => s.EnrollmentCode).FirstOrDefault();
            string? studentAvatar = latestSummary?.StudentInfor?.StudentAvatar;

            return Ok(
                new ApiResponseDto<LoginResponseDto>
                {
                    Code = 200,
                    Message = "Đăng nhập thành công!",
                    Data = new LoginResponseDto
                    {
                        Username = user.UserName,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Token = _tokenService.CreateToken(user),
                        StudentAvatar = studentAvatar,
                        Role = user.Role
                    }
                }
            );
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new ApiResponseDto
                {
                    Code = 400,
                    Message = "Lỗi dữ liệu đầu vào!"
                });
            }

            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);

            if (user == null)
            {
                return Ok(new ApiResponseDto
                {
                    Code = 200,
                    Message = "Mật khẩu mới đã được gửi vào Email đăng ký!"
                });
            }

            string newPassword = GenerateStrongRandomPassword(10);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetResult = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!resetResult.Succeeded)
            {
                var identityErrors = resetResult.Errors.Select(e => e.Description).ToList();
                return StatusCode(500, new ApiResponseDto { Code = 500, Message = "Lỗi khi đặt lại mật khẩu: " + string.Join("; ", identityErrors) });
            }

            var emailSubject = "[ULAW - Đăng ký xét tuyển] - Cấp lại mật khẩu mới";
            var emailBody = $"<p>Xin chào <strong>{user.LastName} {user.FirstName}</strong>,<br/><br/></p>" +
                            $"<p>Bạn đã yêu cầu đặt lại mật khẩu. Thông tin đăng nhập mới nhất của bạn là:</p>" +
                            $"<p>➤ Tên đăng nhập: <strong>{user.UserName}</strong></p>" +
                            $"<p>➤ Mật khẩu mới: <strong>{newPassword}</strong><br/><br/></p>" +
                            $"<p>Vui lòng thay đổi mật khẩu sau lần đăng nhập đầu tiên để bảo mật tài khoản của bạn.<br/><br/></p>" +
                            $"<p>Trân trọng ./.<br />Hệ thống Đăng ký xét tuyển</p>";

            _emailQueueService.Enqueue(user.Email, emailSubject, emailBody);

            return Ok(new ApiResponseDto
            {
                Code = 200,
                Message = "Mật khẩu mới đã được gửi vào Email đăng ký!"
            });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto changePasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByNameAsync(changePasswordDto.Username);

            if (user == null)
            {
                return Unauthorized(new ApiResponseDto
                {
                    Code = 401,
                    Message = "Tên đăng nhập hoặc Mật khẩu hiện tại không đúng!"
                });
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new ApiResponseDto
                {
                    Code = 200,
                    Message = "Thay đổi Mật khẩu thành công!"
                });
            }
            else
            {
                var errorMessages = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new ApiResponseDto
                {
                    Code = 400,
                    Message = "Đổi mật khẩu thất bại! Vui lòng kiểm tra lại thông tin!"
                });
            }
        }

        [HttpGet("info")]
        [Authorize]
        public async Task<IActionResult> RequestInfo()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.GivenName)?.Value;
                var user = await _userManager.Users
                                                .Include(u => u.Summarization)
                                                    .ThenInclude(s => s.StudentInfor)
                                                .Include(u => u.Summarization)
                                                    .ThenInclude(s => s.HighSchoolInfor)
                                                .Include(u => u.Summarization)
                                                    .ThenInclude(s => s.ContactInfor)
                                                .Include(u => u.Summarization)
                                                    .ThenInclude(s => s.UniversityInfor)
                                                .FirstOrDefaultAsync(u => u.UserName == username);

                if (user == null)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = "Không tìm thấy người dùng!" });
                }

                var latestSummary = user.Summarization.OrderByDescending(s => s.EnrollmentCode).FirstOrDefault();

                return Ok(new ApiResponseDto<RequestInfoResponseDto>
                {
                    Code = 200,
                    Message = "Lấy thông tin người dùng thành công!",
                    Data = new RequestInfoResponseDto
                    {
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Username = user.UserName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        StudentIdCard = latestSummary?.StudentInfor?.StudentIdCard,
                        StudentDob = latestSummary?.StudentInfor?.StudentDob,
                        StudentEthnicity = latestSummary?.StudentInfor?.StudentEthnicity,
                        StudentGender = latestSummary?.StudentInfor?.StudentGender,
                        StudentFullContactAddress = latestSummary?.ContactInfor?.StudentFullContactAddress,
                        StudentContactAddress = latestSummary?.ContactInfor.StudentContactAddress,
                        StudentAvatar = latestSummary?.StudentInfor.StudentAvatar,
                        HighSchoolProvince = latestSummary?.HighSchoolInfor?.HighSchoolProvince,
                        HighSchoolWard = latestSummary?.HighSchoolInfor?.HighSchoolWard,
                        StudentContactProvince = latestSummary?.ContactInfor.StudentContactProvince,
                        StudentContactWard = latestSummary?.ContactInfor.StudentContactWard,
                        Role = user.Role
                    }
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new ApiResponseDto { Code = 500, Message = $"Lỗi máy chủ nội bộ: {e.Message}" });
            }
        }

        [HttpPost("users-by-role")]
        [Authorize]
        public async Task<IActionResult> GetUsersByRole([FromBody] GetUserByRoleDto requestDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new ApiResponseDto
                    {
                        Code = 400,
                        Message = "Lỗi dữ liệu khi phân trang!",
                    });
                }

                IQueryable<AppUser> query = _userManager.Users;

                if (!string.IsNullOrEmpty(requestDto.Role))
                {
                    query = query.Where(u => u.Role == requestDto.Role);
                }

                if (!string.IsNullOrEmpty(requestDto.SearchQuery))
                {
                    string searchLower = requestDto.SearchQuery.ToLower();
                    query = query.Where(u =>
                        (u.Email != null && u.Email.ToLower().Contains(searchLower)) ||
                        (u.FirstName != null && u.FirstName.ToLower().Contains(searchLower))
                    );
                }


                if (!string.IsNullOrEmpty(requestDto.SortOrder))
                {
                    if (requestDto.SortOrder.Equals("descending", StringComparison.OrdinalIgnoreCase))
                    {
                        query = query.OrderByDescending(u => u.FirstName);
                    }
                    else
                    {
                        query = query.OrderBy(u => u.FirstName);
                    }
                }
                else
                {
                    query = query.OrderBy(u => u.UserName);
                }

                var totalCount = await query.CountAsync();

                var skip = (requestDto.PageNumber - 1) * requestDto.PageSize;

                var users = await query
                    .Skip(skip)
                    .Take(requestDto.PageSize)
                    .Select(u => new AllUserInfoDto
                    {
                        Username = u.UserName,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Role = u.Role
                    })
                    .ToListAsync();

                if (!users.Any() && totalCount > 0)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = "Trang yêu cầu không có dữ liệu!" });
                }
                else if (!users.Any() && totalCount == 0)
                {
                    return NotFound(new ApiResponseDto { Code = 404, Message = "Không tìm thấy người dùng!" });
                }

                var paginationMetaData = new PaginationMetaDataDto(requestDto.PageNumber, requestDto.PageSize, totalCount);

                return Ok(new ApiResponseDto<List<AllUserInfoDto>>
                {
                    Code = 200,
                    Message = "Lấy danh sách người dùng thành công!",
                    Data = users,
                    Pagination = paginationMetaData
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new ApiResponseDto { Code = 500, Message = $"Lỗi máy chủ nội bộ: {e.Message}" });
            }
        }

        [HttpGet("admin-list-by-role")]
        [Authorize]
        public async Task<IActionResult> GetAdminListByRole([FromQuery] string role)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return BadRequest(new ApiResponseDto
                {
                    Code = 400,
                    Message = "Vai trò không hợp lệ!"
                });
            }

            var admins = await _context.Users
                .Where(u => u.Role == role)
                .Select(u => u.LastName + " " + u.FirstName)
                .ToListAsync();

            return Ok(admins);
        }

        private string GenerateStrongRandomPassword(int length)
        {
            const string charsLower = "abcdefghijklmnopqrstuvwxyz";
            const string charsUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string charsDigit = "0123456789";
            const string charsSpecial = "@#$%&";

            var password = new char[length];
            var random = new Random();


            password[0] = charsLower[random.Next(charsLower.Length)];
            password[1] = charsUpper[random.Next(charsUpper.Length)];
            password[2] = charsDigit[random.Next(charsDigit.Length)];
            password[3] = charsSpecial[random.Next(charsSpecial.Length)];

            const string allChars = charsLower + charsUpper + charsDigit + charsSpecial;
            for (int i = 4; i < length; i++)
            {
                password[i] = allChars[random.Next(allChars.Length)];
            }

            return new string(password.OrderBy(c => random.Next()).ToArray());
        }
    }
}