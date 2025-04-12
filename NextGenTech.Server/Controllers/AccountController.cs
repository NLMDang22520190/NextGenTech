using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.RequestModels;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.DTO.UPDATE;
using NextGenTech.Server.Models.DTOs;
using System.Drawing;
using System.Reflection.Metadata.Ecma335;
using NextGenTech.Server.Services;
using System.Runtime.CompilerServices;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(IUserRepository userRepository,IOrderRepository orderRepository, IMemoryCache cache, IMapper mapper) : ControllerBase
    {
        private readonly IUserRepository userRepository = userRepository;
        private readonly IOrderRepository orderRepository = orderRepository;
        private readonly IMemoryCache _cache = cache;
        private readonly IMapper _mapper = mapper;
        private readonly EmailService _emailService = new EmailService();

        [HttpGet("AdminGetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await userRepository.AdminGetAllUsersAsync();
            var userDTOs = _mapper.Map<List<AdminUserDTO>>(users);
            return Ok(userDTOs);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var hashPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email,
                PasswordHash =hashPassword
            };

            var result = await userRepository.RegisterUserAsync(user);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await userRepository.AuthenticateAsync(request.Email, request.Password);
            if (user == null)
                return Unauthorized("Invalid email or password");
            return Ok(user);
        }

        [HttpPost("ChangePassword")]

        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Email và mật khẩu mới không được để trống."
                });
            }

            try{
                var userToChangePassword = await userRepository.GetUserByEmailAsync(request.Email);

                if (userToChangePassword == null)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng với Email đã cung cấp."
                    });
                }

                var hashPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                await userRepository.UpdatePassword(userToChangePassword, hashPassword);
                return Ok(new
                {
                    status = "success",
                    message = "Đổi mật khẩu thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = ex.Message
                });
            }
        }

        [HttpPost("validateUser")]
        public async Task<IActionResult> ValidateUser([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Email và mật khẩu không được để trống."
                });
            }

            try
            {
                var user = await userRepository.AuthenticateAsync(request.Email, request.Password);

                if (user == null)
                {
                    return Unauthorized(new
                    {
                        status = "error",
                        message = "Email hoặc mật khẩu không đúng."
                    });
                }

                return Ok(new
                {
                    status = "success",
                    message = "Xác thực thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = ex.Message
                });
            }
        }


        [HttpPost("send-verification-code/{email}")]
        public async Task<IActionResult> SendVerificationCode(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Email không được để trống."
                });
            }

            try
            {
                var code = await _emailService.SendVerificationCodeAsync(email);
                cache.Set(email, code, TimeSpan.FromMinutes(5));

                return Ok(new
                {
                    status = "success",
                    message = "Mã xác nhận đã được gửi đến email của bạn."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Đã xảy ra lỗi khi gửi mã xác nhận.",
                    details = ex.Message // (tuỳ chọn)
                });
            }
        }

        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Email và mã xác nhận không được để trống."
                });
            }

            if (cache.TryGetValue(request.Email, out string storedCode))
            {
                if (storedCode == request.Code)
                {
                    cache.Remove(request.Email);
                    return Ok(new
                    {
                        status = "success",
                        message = "Mã xác nhận chính xác. Bạn có thể tiếp tục."
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        status = "error",
                        message = "Mã xác nhận không đúng. Vui lòng thử lại."
                    });
                }
            }

            return BadRequest(new
            {
                status = "expired",
                message = "Mã xác nhận đã hết hạn hoặc không tồn tại."
            });
        }

        [HttpPut("Update-info/{userId}")]
        public async Task<IActionResult> UpdateUserInfo(int userId, [FromBody] UpdateUserInfoRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Dữ liệu gửi lên không hợp lệ."
                });
            }

            try
            {
                var success = await userRepository.UpdateUserInfo(userId, request);
                if (!success)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng hoặc không thể cập nhật."
                    });
                }

                return Ok(new
                {
                    status = "success",
                    message = "Cập nhật thông tin người dùng thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Lỗi khi cập nhật thông tin người dùng.",
                    details = ex.Message
                });
            }
        }

    }
}