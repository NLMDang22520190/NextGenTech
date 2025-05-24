using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NextGenTech.Server.Models.DTO.UPDATE
{
    public class UpdateUserInfoRequestDTO
    {
        [StringLength(255, ErrorMessage = "Họ tên không được vượt quá 255 ký tự")]
        [JsonPropertyName("fullName")]
        public string? FullName { get; set; }

        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự")]
        [JsonPropertyName("phone")]
        public string? Phone { get; set;}

        [StringLength(255, ErrorMessage = "Thành phố không được vượt quá 255 ký tự")]
        [JsonPropertyName("city")]
        public string? City { get; set;}

        [StringLength(255, ErrorMessage = "Quận/Huyện không được vượt quá 255 ký tự")]
        [JsonPropertyName("district")]
        public string? District { get; set;}

        [StringLength(255, ErrorMessage = "Phường/Xã không được vượt quá 255 ký tự")]
        [JsonPropertyName("ward")]
        public string? Ward { get; set;}

        [JsonPropertyName("photoUrl")]
        public string? PhotoUrl { get; set;}
    }
}