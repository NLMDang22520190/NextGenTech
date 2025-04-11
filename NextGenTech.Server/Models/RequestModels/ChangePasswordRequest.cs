using System.ComponentModel.DataAnnotations;

namespace NextGenTech.Server.Models.RequestModels
{
    public class ChangePasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
