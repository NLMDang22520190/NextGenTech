using NextGenTech.Server.Models.Domain;
using Microsoft.AspNetCore.Identity;
using NextGenTech.Server.Models.RequestModels;
using NextGenTech.Server.Models.DTOs;
using NextGenTech.Server.Models.DTO.UPDATE;
using NextGenTech.Server.Models.DTO.ADD;

namespace NextGenTech.Server.Repositories
{
    public interface IUserRepository : INextGenTechRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> RegisterUserAsync(User user);
        Task<bool> IsEmailExistsAsync(string email);
        Task<User?> AuthenticateAsync(string email, string password);
        Task<User?> GetUserByIdAsync(int userId);
        Task<bool> UpdatePassword(User user, string newPassword);
        Task<bool> UpdateUserInfo(int userId, UpdateUserInfoRequestDTO request);
        Task<ICollection<string>> GetUserRole(int userId);

        Task<List<User>> AdminGetAllUsersAsync();
        Task<User> AddUserAsync(User user);
        Task<User> DeleteUserAsync(int userId);
        Task<User?> UpdateUserAsync(int userId, User updatedUser);
    }
}