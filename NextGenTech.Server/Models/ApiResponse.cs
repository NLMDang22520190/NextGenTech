namespace NextGenTech.Server.Models
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public required string Message { get; set; }

        public  T? Data { get; set;}
        public string? JwtToken { get; set; }   
    }
}