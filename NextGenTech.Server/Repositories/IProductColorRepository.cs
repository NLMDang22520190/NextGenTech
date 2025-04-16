using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IProductColorRepository : INextGenTechRepository<ProductColor>
    {
        Task AddProductColorsAsync(List<ProductColor> productColors);

        Task<List<ProductColor>> GetProductColorsByProductIdAsync(int productId);
    }
}