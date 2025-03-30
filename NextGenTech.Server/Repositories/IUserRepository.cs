using NextGenTech.Server.Models.Domain;
using Microsoft.AspNetCore.Identity;
using NextGenTech.Server.Models.RequestModels;

namespace NextGenTech.Server.Repositories
{
    public interface IUserRepository : INextGenTechRepository<User>
    {
        public Task<IdentityResult> SignUpAsync(SignUpModel model);
        public Task<string> SignInAsync(SignInModel model);
    }
}