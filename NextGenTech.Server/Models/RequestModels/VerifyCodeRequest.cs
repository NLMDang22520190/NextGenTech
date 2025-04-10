namespace NextGenTech.Server.Models.RequestModels
{
    public class VerifyCodeRequest
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }
}
