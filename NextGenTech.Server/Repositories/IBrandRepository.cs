using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IBrandRepository : INextGenTechRepository<Brand>
    {
        Task<List<Brand>> AdminGetAllBrandAsync();
        Task<Brand> AddBrandAsync(Brand brand);
        Task<Brand> DeleteBrandAsync(int brandId);
    }
}