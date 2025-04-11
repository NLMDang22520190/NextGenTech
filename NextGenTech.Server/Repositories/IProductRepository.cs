using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IProductRepository : INextGenTechRepository<Product>
    {
        Task<List<Product>> CustomerGetAllProductAsync();

        Task<Product> CustomerGetProductByIdAsync(int id);

        Task<List<Product>> AdminGetAllProductAsync();
    }
}