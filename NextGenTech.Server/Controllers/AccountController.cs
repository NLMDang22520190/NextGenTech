using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.RequestModels;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.DTOs;
using System.Drawing;
using System.Reflection.Metadata.Ecma335;

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

    }
}