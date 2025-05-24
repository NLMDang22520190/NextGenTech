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
            try
            {
                Console.WriteLine($"UpdateUserInfo called for userId: {userId}");
                Console.WriteLine($"Request data: FullName={request.FullName}, Phone={request.Phone}, City={request.City}, District={request.District}, Ward={request.Ward}, PhotoUrl={request.PhotoUrl}");

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    Console.WriteLine($"User with ID {userId} not found");
                    return false;
                }

                Console.WriteLine($"Found user: ID={user.UserId}, FullName={user.FullName}, Role={user.Role}, Email={user.Email}");

                // Lưu giá trị cũ để so sánh
                var oldFullName = user.FullName;
                var oldPhone = user.Phone;
                var oldCity = user.City;
                var oldDistrict = user.District;
                var oldWard = user.Ward;
                var oldAvatarUrl = user.AvatarImageUrl;

                // Chỉ cập nhật các trường cần thiết, không động đến Role
                user.FullName = request.FullName;
                user.Phone = request.Phone;
                user.City = request.City;
                user.District = request.District;
                user.Ward = request.Ward;
                user.AvatarImageUrl = request.PhotoUrl;

                Console.WriteLine($"Updated values: FullName={user.FullName}, Phone={user.Phone}, City={user.City}, District={user.District}, Ward={user.Ward}, AvatarUrl={user.AvatarImageUrl}");

                // Thử phương pháp cập nhật trực tiếp bằng SQL
                Console.WriteLine("About to save changes...");

                // Sử dụng ExecuteSqlRaw để cập nhật trực tiếp
                var sql = @"UPDATE Users
                           SET FullName = {0},
                               Phone = {1},
                               City = {2},
                               District = {3},
                               Ward = {4},
                               AvatarImageUrl = {5}
                           WHERE UserID = {6}";

                var result = await _context.Database.ExecuteSqlRawAsync(sql,
                    request.FullName ?? (object)DBNull.Value,
                    request.Phone ?? (object)DBNull.Value,
                    request.City ?? (object)DBNull.Value,
                    request.District ?? (object)DBNull.Value,
                    request.Ward ?? (object)DBNull.Value,
                    request.PhotoUrl ?? (object)DBNull.Value,
                    userId);

                Console.WriteLine($"ExecuteSqlRaw result: {result}");

                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateUserInfo: {ex}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
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

            // Cập nhật các trường thông tin cơ bản
            existingUser.FullName = updatedUser.FullName;
            existingUser.Phone = updatedUser.Phone;
            existingUser.City = updatedUser.City;
            existingUser.District = updatedUser.District;
            existingUser.Ward = updatedUser.Ward;
            existingUser.AvatarImageUrl = updatedUser.AvatarImageUrl;

            // Chỉ cập nhật Role nếu có giá trị hợp lệ
            if (!string.IsNullOrEmpty(updatedUser.Role))
            {
                existingUser.Role = updatedUser.Role;
            }

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<ICollection<string>> GetUserRole(int userId)
        {
            var result = await _context.Users
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role)
                .ToListAsync();
            return result;
        }
    }

}