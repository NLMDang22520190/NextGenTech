using AutoMapper;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.GET;
// using NextGenTech.Server.Models.DTO;
// using NextGenTech.Server.Models.DTO.ADD;
// using NextGenTech.Server.Models.DTO.GET;
// using NextGenTech.Server.Models.DTO.UPDATE;

namespace HealthBuddy.Server.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, CustomerProductDTO>().ReverseMap();
            CreateMap<Product, CustomerDetailProductDTO>().ReverseMap();
            CreateMap<ProductImage, ProductImageDTO>().ReverseMap();
            CreateMap<ProductColor, ProductColorDTO>().ReverseMap();
            CreateMap<Brand, BrandDTO>().ReverseMap();
            CreateMap<Category, CategoryDTO>().ReverseMap();
        }
    }
}