using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.RequestModels;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using System.Text.RegularExpressions;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLUserRepository : NextGenTechRepository<User>, IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public SQLUserRepository(NextGenTechContext dbContext, UserManager<User> userManager, SignInManager<User> signInManager)
            : base(dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Triển khai SignUpAsync
        public async Task<IdentityResult> SignUpAsync(SignUpModel model)
        {
            var user = new User
            {
                FullName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            return result;
        }

        // Triển khai SignInAsync
         public async Task<string> SignInAsync(SignInModel model)
{
            var result = await _signInManager.PasswordSignInAsync(
                model.Email, model.Password, model.ConfirmPassword, false);

            return result.Succeeded ? "Login successful" : "Invalid credentials";
        }

        
    }
    
}