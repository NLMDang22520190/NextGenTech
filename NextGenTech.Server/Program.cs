using HealthBuddy.Server.Mapping;
using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Repositories;
using NextGenTech.Server.Repositories.Implement;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using NextGenTech.Server.Models.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<NextGenTechContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NextGenTech"), sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", builder =>
    {
        builder.WithOrigins(
                   "https://localhost:3000",
                   "http://localhost:3000",
                   "https://nexttgentech.netlify.app",
                   "https://nextgentech-73nf.onrender.com"
               )
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

builder.Services.AddScoped<IBrandRepository, SQLBrandRepository>();
builder.Services.AddScoped<ICategoryRepository, SQLCategoryRepository>();
builder.Services.AddScoped<IProductRepository, SQLProductRepository>();
builder.Services.AddScoped<IUserRepository, SQLUserRepository>();
builder.Services.AddScoped<IOrderRepository, SQLOrderRepository>();
builder.Services.AddScoped<IOrderDetailRepository, SQLOrderDetailRepository>();
builder.Services.AddScoped<ICartRepository, SQLCartRepository>();
builder.Services.AddScoped<ICartDetailRepository, SQLCartDetailRepository>();
builder.Services.AddScoped<IProductColorRepository, SQLProductColorRepository>();
builder.Services.AddScoped<IProductImageRepository, SQLProductImageRepository>();
builder.Services.AddScoped<IReviewRepository, SQLReviewRepository>();
builder.Services.AddScoped<IPromotionRepository, SQLPromotionRepository>();
builder.Services.AddScoped<IUserRepository, SQLUserRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();



builder.Services.AddScoped(typeof(INextGenTechRepository<>), typeof(NextGenTechRepository<>));
builder.Services.AddHttpClient();  // Đăng ký IHttpClientFactory

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddMemoryCache();



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigins");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
