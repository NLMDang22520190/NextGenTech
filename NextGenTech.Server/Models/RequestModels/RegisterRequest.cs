using System.ComponentModel.DataAnnotations;

namespace NextGenTech.Server.Models.RequestModels
{
    public class RegisterRequest
{
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
}
}
