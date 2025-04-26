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
            CreateMap<AdminAddProductDTO, Product>()
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.Colors.Sum(c => c.StockQuantity))) // Map total stock quantity
                .ForMember(dest => dest.ProductImages, opt => opt.Ignore()) // Ignore ProductImages
                .ForMember(dest => dest.ProductColors, opt => opt.Ignore()) // Ignore ProductColors
                .ReverseMap();
            CreateMap<AdminUpdateProductDTO, Product>()
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.Colors.Sum(c => c.StockQuantity))) // Map total stock quantity
                .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(src => src.ImageUrls.Select(url => new ProductImage { ImageUrl = url })))
                .ForMember(dest => dest.ProductColors, opt => opt.MapFrom(src => src.Colors.Select(color => new ProductColor
                {
                    Color = color.Color,
                    ColorCode = color.ColorCode,
                    StockQuantity = color.StockQuantity
                })))
                .ReverseMap();

            CreateMap<ProductImage, ProductImageDTO>().ReverseMap();
            CreateMap<ProductColor, ProductColorDTO>().ReverseMap();

            CreateMap<Promotion, CustomerProductPromotionDTO>().ReverseMap();
            CreateMap<Promotion, CustomerPromotionDTO>().ReverseMap();
            CreateMap<Promotion, AdminPromotionDTO>()
                .ForMember(dest => dest.ProductIDs, opt => opt.MapFrom(src => src.Products.Select(p => p.ProductId.ToString())))
                .ReverseMap();
            CreateMap<Promotion, AdminAddPromotionDTO>()
                .ForMember(dest => dest.ProductIDs, opt => opt.MapFrom(src => src.Products.Select(p => p.ProductId.ToString())))
                .ReverseMap();
            CreateMap<Promotion, AdminUpdatePromotionDTO>()
                .ForMember(dest => dest.ProductIDs, opt => opt.MapFrom(src => src.Products.Select(p => p.ProductId.ToString())))
                .ReverseMap();

            CreateMap<Brand, BrandDTO>().ReverseMap();
            CreateMap<Brand, AdminBrandDTO>().ReverseMap();
            CreateMap<Brand, AdminAddBrandDTO>().ReverseMap();
            CreateMap<Brand, AdminUpdateBrandDTO>().ReverseMap();

            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<Category, AdminCategoryDTO>().ReverseMap();
            CreateMap<Category, AdminAddCategoryDTO>().ReverseMap();
            CreateMap<Category, AdminUpdateCategoryDTO>().ReverseMap();

            CreateMap<Order, OrderDTO>().ReverseMap();
            CreateMap<OrderDetail, OrderDetailDTO>().ReverseMap();
            CreateMap<CartDetail, CartItemDetailDTO>().ReverseMap();
            CreateMap<ProductColor, CartItemDTO>().ReverseMap();
            CreateMap<AddItemToCartRequestDTO, CartDetail>().ReverseMap();
            CreateMap<CartDetail, UpdateCartItemRequestDTO>().ReverseMap();

            CreateMap<User, AdminUserDTO>().ReverseMap();
            CreateMap<User, AdminAddUserDTO>()
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ReverseMap()
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Password)));
            CreateMap<User, AdminUpdateUserDTO>().ReverseMap();
            CreateMap<Order, OrderWithOrderDetailDTO>().ReverseMap();
            CreateMap<Promotion, PromotionDTO>().ReverseMap();
            CreateMap<ProductImage, ProductImageDTO>().ReverseMap();
        }
    }
}