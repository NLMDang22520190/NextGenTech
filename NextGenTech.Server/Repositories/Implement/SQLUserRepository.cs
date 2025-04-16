using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.UPDATE;
using NextGenTech.Server.Models.RequestModels;
using NextGenTech.Server.Hepers;
using NextGenTech.Server.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using AutoMapper;
using System.Text.RegularExpressions;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLUserRepository : NextGenTechRepository<User>, IUserRepository
    {
        private readonly NextGenTechContext _context;
        public SQLUserRepository(NextGenTechContext dbContext)
            : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<User> RegisterUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
         

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }


        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            
            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
                return null;

            Console.WriteLine($"Hash value: {user.PasswordHash}");

            try
            {
                var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                Console.WriteLine($"Password match: {isPasswordValid}");
                return isPasswordValid ? user : null;
            }
            catch (BCrypt.Net.SaltParseException ex)
            {
                // Log lỗi để dễ debug nếu có
                Console.WriteLine($"Invalid BCrypt hash: {user.PasswordHash}");
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }   
        }

        public async Task<bool> UpdatePassword(User user, string newPassword)
        {
            user.PasswordHash = newPassword;
            _context.Entry(user).Property(u => u.PasswordHash).IsModified = true;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateUserInfo(int userId, UpdateUserInfoRequestDTO request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.FullName = request.FullName;
            user.Phone = request.Phone;
            user.City = request.City;
            user.District=request.District;
            user.Ward = request.Ward;
            user.AvatarImageUrl = request.PhotoUrl;

            _context.Users.Update(user);
            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<List<User>> AdminGetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> DeleteUserAsync(int userId)
        {
            return await DeleteAsync(p => p.UserId == userId);
        }

        public async Task<User?> UpdateUserAsync(int userId, User updatedUser)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(p => p.UserId == userId);
            if (existingUser == null)
            {
                return null;
            }
            existingUser.FullName = updatedUser.FullName;
            existingUser.Phone = updatedUser.Phone;
            existingUser.City = updatedUser.City;
            existingUser.District = updatedUser.District;
            existingUser.Ward = updatedUser.Ward;
            existingUser.AvatarImageUrl = updatedUser.AvatarImageUrl;
            existingUser.Role = updatedUser.Role;
            
            await _context.SaveChangesAsync();
            return existingUser;
        }
    }
    
}