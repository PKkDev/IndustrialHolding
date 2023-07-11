using IndustrialHolding.Data.Npg;
using IndustrialHolding.Data.Npg.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.private.json", optional: false, reloadOnChange: true);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "IndustrialHolding", Version = "v1" });
});


builder.Services.Configure<DbConnectOptions>(builder.Configuration.GetSection("NpgSql"));
builder.Services.AddDbContext<DataContext>(opt
    => opt.UseNpgsql(builder.Configuration["NpgSql:ConnectionString"]));

var app = builder.Build();

app.UseExceptionHandler("/error");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
