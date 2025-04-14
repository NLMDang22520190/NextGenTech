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

        Task AddProductImagesAsync(List<ProductImage> productImages);

        Task AddProductColorsAsync(List<ProductColor> productColors);

        Task<List<ProductImage>> GetProductImagesByProductIdAsync(int productId);

        Task<List<ProductColor>> GetProductColorsByProductIdAsync(int productId);

        Task<Product> DeleteProductAsync(int productId);
    }
}