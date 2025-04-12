using AutoMapper;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.DTO.UPDATE;
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
            CreateMap<Product, AdminProductDTO>().ReverseMap();
            CreateMap<Product, AdminDetailProductDTO>().ReverseMap();
            CreateMap<ProductImage, ProductImageDTO>().ReverseMap();
            CreateMap<ProductColor, ProductColorDTO>().ReverseMap();
            CreateMap<Promotion, CustomerProductPromotionDTO>().ReverseMap();
            CreateMap<Promotion, AdminPromotionDTO>().ReverseMap();
            CreateMap<Brand, BrandDTO>().ReverseMap();
            CreateMap<Brand, AdminBrandDTO>().ReverseMap();
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<Category, AdminCategoryDTO>().ReverseMap();
            CreateMap<Promotion, CustomerPromotionDTO>().ReverseMap();
            CreateMap<Order, OrderDTO>().ReverseMap();
            CreateMap<CartDetail, CartItemDetailDTO>().ReverseMap();
            CreateMap<ProductColor, CartItemDTO>().ReverseMap();
            CreateMap<AddItemToCartRequestDTO, CartDetail>().ReverseMap();
            CreateMap<CartDetail, UpdateCartItemRequestDTO>().ReverseMap();
            CreateMap<User, AdminUserDTO>().ReverseMap();
        }
    }
}