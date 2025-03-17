using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<NextGenTechContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NextGenTech"), sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
