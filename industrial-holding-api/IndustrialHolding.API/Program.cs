using IndustrialHolding.Data.Npg;
using IndustrialHolding.Data.Npg.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "appsettings.private.json"), optional: false, reloadOnChange: true);

builder.Services.AddControllers()
    .AddJsonOptions(option =>
    {
        option.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyMethod();
            policy.WithExposedHeaders("Content-Disposition");
        });
});

builder.Services.AddSwaggerGen(options =>
{
    options.SupportNonNullableReferenceTypes();

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "IndustrialHolding",
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});


builder.Services.Configure<DbConnectOptions>(builder.Configuration.GetSection("NpgSql"));
builder.Services.AddDbContext<DataContext>(opt
    => opt.UseNpgsql(builder.Configuration["NpgSql:ConnectionString"]));

var app = builder.Build();

app.UseExceptionHandler("/error");

app.UseSwagger(opt =>
{
    if (builder.Environment.IsProduction())
    {
        opt.PreSerializeFilters.Add((swagger, httpReq) =>
        {
            //var serverUrl = $"{httpReq.Scheme}://{httpReq.Host}/indastrial-holding-api/";
            var serverUrl = $"https://{httpReq.Host}/indastrial-holding-api/";
            swagger.Servers = new List<OpenApiServer> {
            new() { Url = serverUrl } };
        });
    }
});
app.UseSwaggerUI(opt =>
{
    if (builder.Environment.IsDevelopment())
        opt.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    else
        opt.SwaggerEndpoint("/indastrial-holding-api/swagger/v1/swagger.json", "v1");
});

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
