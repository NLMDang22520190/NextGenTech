using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace NextGenTech.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Không có file được tải lên");
                }

                // Kiểm tra loại file
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                {
                    return BadRequest("Chỉ chấp nhận file hình ảnh (jpg, jpeg, png)");
                }

                // Tạo đường dẫn đến thư mục Images trong dự án
                var imagesFolder = Path.Combine(_environment.ContentRootPath, "Images", "Products");

                // Tạo thư mục lưu trữ nếu chưa tồn tại
                if (!Directory.Exists(imagesFolder))
                {
                    Directory.CreateDirectory(imagesFolder);
                }

                // Tính toán hash của file để kiểm tra trùng lặp
                string fileHash;
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    ms.Position = 0;
                    using (var sha256 = SHA256.Create())
                    {
                        var hashBytes = sha256.ComputeHash(ms);
                        fileHash = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
                    }
                }

                // Tạo tên file dựa trên hash
                var fileName = $"{fileHash}{extension}";

                // Tạo thư mục con dựa trên 2 ký tự đầu của hash để tổ chức file
                var subFolder = fileHash.Substring(0, 2);
                var subFolderPath = Path.Combine(imagesFolder, subFolder);

                // Tạo thư mục con nếu chưa tồn tại
                if (!Directory.Exists(subFolderPath))
                {
                    Directory.CreateDirectory(subFolderPath);
                }

                var filePath = Path.Combine(subFolderPath, fileName);

                // Kiểm tra xem file đã tồn tại chưa
                if (!System.IO.File.Exists(filePath))
                {
                    // Nếu chưa tồn tại, lưu file mới
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    Console.WriteLine($"Saved new image: {fileName}");
                }
                else
                {
                    Console.WriteLine($"Image already exists, reusing: {fileName}");
                }

                // Trả về đường dẫn tương đối để lưu vào database
                // Không cần thêm thư mục con vào đường dẫn vì GetImage sẽ tự tìm
                var relativePath = $"/api/Upload/GetImage/{fileName}";

                return Ok(new { imageUrl = relativePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tải ảnh lên: {ex.Message}");
            }
        }

        [HttpGet("GetImage/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            try
            {
                // Đường dẫn đến thư mục Images trong dự án
                var imagesFolder = Path.Combine(_environment.ContentRootPath, "Images", "Products");

                // Kiểm tra thư mục có tồn tại không
                if (!Directory.Exists(imagesFolder))
                {
                    Console.WriteLine($"Images folder does not exist: {imagesFolder}");
                    Directory.CreateDirectory(imagesFolder);
                    return NotFound("Không tìm thấy thư mục ảnh");
                }

                // Kiểm tra xem file có phải là file hash không (ít nhất 64 ký tự cho SHA-256)
                if (fileName.Length >= 64)
                {
                    // Lấy 2 ký tự đầu của hash để xác định thư mục con
                    var subFolder = fileName.Substring(0, 2);
                    var subFolderPath = Path.Combine(imagesFolder, subFolder);

                    // Đường dẫn đầy đủ đến file ảnh trong thư mục con
                    var filePath = Path.Combine(subFolderPath, fileName);

                    Console.WriteLine($"Requesting image from subfolder: {filePath}");

                    // Kiểm tra xem file có tồn tại không
                    if (System.IO.File.Exists(filePath))
                    {
                        // Xác định loại MIME dựa trên phần mở rộng của file
                        var extension = Path.GetExtension(fileName).ToLower();
                        string contentType = extension switch
                        {
                            ".jpg" or ".jpeg" => "image/jpeg",
                            ".png" => "image/png",
                            _ => "application/octet-stream"
                        };

                        // Trả về file ảnh
                        return PhysicalFile(filePath, contentType);
                    }
                }

                // Nếu không tìm thấy trong thư mục con, thử tìm trong thư mục gốc (cho các file cũ)
                var oldFilePath = Path.Combine(imagesFolder, fileName);

                Console.WriteLine($"Trying old path: {oldFilePath}");

                // Kiểm tra xem file có tồn tại không
                if (System.IO.File.Exists(oldFilePath))
                {
                    // Xác định loại MIME dựa trên phần mở rộng của file
                    var extension = Path.GetExtension(fileName).ToLower();
                    string contentType = extension switch
                    {
                        ".jpg" or ".jpeg" => "image/jpeg",
                        ".png" => "image/png",
                        _ => "application/octet-stream"
                    };

                    // Trả về file ảnh
                    return PhysicalFile(oldFilePath, contentType);
                }

                Console.WriteLine($"Image not found: {fileName}");
                return NotFound("Không tìm thấy ảnh");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error serving image: {ex.Message}");
                return StatusCode(500, $"Lỗi khi tải ảnh: {ex.Message}");
            }
        }
    }
}



