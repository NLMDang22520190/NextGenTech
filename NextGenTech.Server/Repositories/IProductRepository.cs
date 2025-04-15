using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IProductRepository : INextGenTechRepository<Product>
    {
        Task<List<Product>> CustomerGetAllProductAsync();

        Task<Product> CustomerGetProductByIdAsync(int id);

        Task<List<Product>> AdminGetAllProductAsync();

        Task<Product> AdminGetProductByIdAsync(int id);

        Task<Product> AddProductAsync(Product product);

        Task<Product> DeleteProductAsync(int productId);

        Task<Product?> UpdateProductAsync(int productId, Product updatedProduct);
    }
}