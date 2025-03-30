using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.RequestModels;
using NextGenTech.Server.Models;

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

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser(CreateUserModel createUserModel )
        {
            
            var signUpModel = new SignUpModel
            {
                Email = createUserModel.Email,
                Password = "12345678",
            };
            var result = await userRepository.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok(new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Sign-up successful.",
                    Data = true
                });
            }

            return Unauthorized(new ApiResponse<bool>
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                Message = "Create failed.",
                Data = false
            });
        }

        [HttpPost("SignUp")]

        public async Task<IActionResult> SignUp(SignUpModel signUpModel)
        {
            var result = await userRepository.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok(new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Sign-up successful.",
                    Data = true
                });
            }

            return Unauthorized(new ApiResponse<bool>
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                Message = "Sign-up failed.",
                Data = false
            });
        }

    }
}