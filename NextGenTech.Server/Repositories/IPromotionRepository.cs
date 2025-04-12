using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IPromotionRepository : INextGenTechRepository<Promotion>
    {
        Task<List<Promotion>> CustomerGetAllAvailablePromotionAsync();
        Task<List<Promotion>> AdminGetAllPromotionsAsync();
        Task<Promotion> AdminGetPromotionByIdAsync(int id);        
    }
}