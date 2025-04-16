using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IProductImageRepository : INextGenTechRepository<ProductImage>
    {
        Task AddProductImagesAsync(List<ProductImage> productImages);

        Task<List<ProductImage>> GetProductImagesByProductIdAsync(int productId);
    }
}