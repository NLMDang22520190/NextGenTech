using NextGenTech.Server.Models.Domain;
using Microsoft.AspNetCore.Identity;
using NextGenTech.Server.Models.RequestModels;
using NextGenTech.Server.Models.DTOs;

namespace NextGenTech.Server.Repositories
{
    public interface IUserRepository : INextGenTechRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> RegisterUserAsync(User user);
        Task<bool> IsEmailExistsAsync(string email);
        Task<User?> AuthenticateAsync(string email, string password);
        Task<User?> GetUserByIdAsync(int userId);

    }
}