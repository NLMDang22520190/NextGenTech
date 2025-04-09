using System.ComponentModel.DataAnnotations;

namespace NextGenTech.Server.Models.RequestModels
{
    public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
}