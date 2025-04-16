using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.UPDATE;
using NextGenTech.Server.Models.DTO.ADD;

namespace NextGenTech.Server.Repositories
{
    public interface IProductRepository : INextGenTechRepository<Product>
    {
        Task<List<Product>> CustomerGetAllProductAsync();

        Task<List<Product>> AdminGetAllProductAsync();

        Task<Product> CustomerGetProductByIdAsync(int id);

        Task<Product> AddProductAsync(AddProductRequestDTO request);

        Task<Product?> UpdateProductAsync(int productId, UpdateProductRequestDTO request);
    }
}