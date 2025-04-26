using Microsoft.AspNetCore.Identity;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface ITokenService
    {
        string CreateJWTToken(User user, List<string> roles);
    }
}
