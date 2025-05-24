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
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(IUserRepository userRepository,IOrderRepository orderRepository, IMemoryCache cache, IMapper mapper, ITokenService tokenService) : ControllerBase
    {
        private readonly IUserRepository userRepository = userRepository;
        private readonly IOrderRepository orderRepository = orderRepository;
        private readonly IMemoryCache _cache = cache;
        private readonly IMapper _mapper = mapper;
        private readonly ITokenService tokenService = tokenService;
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
            // Kiểm tra email đã tồn tại chưa
            bool emailExists = await userRepository.IsEmailExistsAsync(request.Email);
            if (emailExists)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác."
                });
            }

            var hashPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email,
                PasswordHash = hashPassword
            };

            var result = await userRepository.RegisterUserAsync(user);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await userRepository.AuthenticateAsync(request.Email, request.Password);
            if (user != null)
            {
                var role = await userRepository.GetUserRole(user.UserId);
                if (role != null)
                {
                    // create token
                    var jwttoken = tokenService.CreateJWTToken(user, role.ToList());
                    var loginResponse = new LoginRespondDto
                    {
                        UserId = user.UserId,
                        JwtToken = jwttoken,
                    };
                    return Ok(loginResponse);
                }
            }
            return BadRequest("Username or password incorrect");
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.CurrentPassword) || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Email, mật khẩu hiện tại và mật khẩu mới không được để trống."
                });
            }

            try
            {
                var userToChangePassword = await userRepository.GetUserByEmailAsync(request.Email);

                if (userToChangePassword == null)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng với Email đã cung cấp."
                    });
                }

                // Kiểm tra mật khẩu hiện tại
                bool passwordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, userToChangePassword.PasswordHash);
                if (!passwordValid)
                {
                    return BadRequest(new
                    {
                        status = "error",
                        message = "Mật khẩu hiện tại không chính xác."
                    });
                }

                // Mã hóa và cập nhật mật khẩu mới
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
                _cache.Set(email, code, TimeSpan.FromMinutes(5));

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

            if (_cache.TryGetValue(request.Email, out string? storedCode) && storedCode != null)
            {
                if (storedCode == request.Code)
                {
                    _cache.Remove(request.Email);
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

        [HttpGet("GetUserById/{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Không tìm thấy người dùng."
                });
            }
            var userDTO = _mapper.Map<UserInfoDTO>(user);
            return Ok(userDTO);
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

            // Kiểm tra validation
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new
                {
                    status = "error",
                    message = "Dữ liệu không hợp lệ.",
                    errors = errors
                });
            }

            try
            {
                // Kiểm tra user có tồn tại không
                var existingUser = await userRepository.GetUserByIdAsync(userId);
                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng với ID đã cung cấp."
                    });
                }

                var success = await userRepository.UpdateUserInfo(userId, request);
                if (!success)
                {
                    return BadRequest(new
                    {
                        status = "error",
                        message = "Không thể cập nhật thông tin người dùng."
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
                // Log chi tiết lỗi để debug
                Console.WriteLine($"Error updating user info: {ex}");

                return StatusCode(500, new
                {
                    status = "error",
                    message = "Lỗi khi cập nhật thông tin người dùng.",
                    details = ex.Message
                });
            }
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] AdminAddUserDTO request)
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
                // Kiểm tra email đã tồn tại chưa
                bool emailExists = await userRepository.IsEmailExistsAsync(request.Email);
                if (emailExists)
                {
                    return BadRequest(new
                    {
                        status = "error",
                        message = "Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác."
                    });
                }

                var user = _mapper.Map<User>(request);
                var result = await userRepository.AddUserAsync(user);
                return Ok(_mapper.Map<AdminUserDTO>(result));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Lỗi khi thêm người dùng.",
                    details = ex.Message
                });
            }
        }

        [HttpPut("UpdateUser/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] AdminUpdateUserDTO request)
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
                var user = _mapper.Map<User>(request);
                var result = await userRepository.UpdateUserAsync(userId, user);
                if (result == null)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng."
                    });
                }
                return Ok(_mapper.Map<AdminUserDTO>(await userRepository.GetByIdAsync(p => p.UserId == userId)));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Lỗi khi cập nhật người dùng.",
                    details = ex.Message
                });
            }
        }

        [HttpPut("Admin-Update-info/{userId}")]
        public async Task<IActionResult> AdminUpdateUserInfo(int userId, [FromBody] UpdateUserInfoRequestDTO request)
        {
            Console.WriteLine($"AdminUpdateUserInfo called with userId: {userId}");
            Console.WriteLine($"Request object: {System.Text.Json.JsonSerializer.Serialize(request)}");

            if (request == null)
            {
                Console.WriteLine("Request is null");
                return BadRequest(new
                {
                    status = "error",
                    message = "Dữ liệu gửi lên không hợp lệ."
                });
            }

            // Kiểm tra validation
            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState is invalid");
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                Console.WriteLine($"Validation errors: {string.Join(", ", errors)}");

                return BadRequest(new
                {
                    status = "error",
                    message = "Dữ liệu không hợp lệ.",
                    errors = errors
                });
            }

            try
            {
                // Kiểm tra user có tồn tại không
                var existingUser = await userRepository.GetUserByIdAsync(userId);
                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng với ID đã cung cấp."
                    });
                }

                Console.WriteLine($"Admin updating user info for userId: {userId}");
                var success = await userRepository.UpdateUserInfo(userId, request);
                if (!success)
                {
                    return BadRequest(new
                    {
                        status = "error",
                        message = "Không thể cập nhật thông tin người dùng."
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
                // Log chi tiết lỗi để debug
                Console.WriteLine($"Error in AdminUpdateUserInfo: {ex}");

                return StatusCode(500, new
                {
                    status = "error",
                    message = "Lỗi khi cập nhật thông tin người dùng.",
                    details = ex.Message
                });
            }
        }

        [HttpDelete("DeleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var result = await userRepository.DeleteUserAsync(userId);
                if (result == null)
                {
                    return NotFound(new
                    {
                        status = "error",
                        message = "Không tìm thấy người dùng."
                    });
                }
                return Ok(new
                {
                    status = "success",
                    message = "Xóa người dùng thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Lỗi khi xóa người dùng.",
                    details = ex.Message
                });
            }
        }
    }
}