using MimeKit;
using MailKit.Net.Smtp;
using System.Net.Mail;

namespace NextGenTech.Server.Services
{
    public class EmailService
    {
        private readonly string _smtpServer = "smtp.gmail.com"; // Thay bằng SMTP server bạn sử dụng
        private readonly int _smtpPort = 587; // Cổng SMTP
        private readonly string _emailFrom = "dangbui2004123@gmail.com"; // Email của bạn
        private readonly string _emailPassword = "sdrl qnxt dlqy uxoc"; // Mật khẩu ứng dụng

        public async Task<string> SendVerificationCodeAsync(string emailTo)
        {
            // Tạo mã xác nhận 6 chữ số
            var random = new Random();
            string verificationCode = random.Next(100000, 999999).ToString();

            // Tạo nội dung email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("RiseAndDrink", _emailFrom));
            message.To.Add(new MailboxAddress("", emailTo));
            message.Subject = "Mã xác nhận của bạn";

            message.Body = new TextPart("plain")
            {
                Text = $"Mã xác nhận của bạn là: {verificationCode}"
            };

            // Gửi email
            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_emailFrom, _emailPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi gửi email: " + ex.ToString());
                    throw new InvalidOperationException("Không thể gửi email.", ex);
                }
            }

            // Trả về mã xác nhận
            return verificationCode;
        }
    }
}
