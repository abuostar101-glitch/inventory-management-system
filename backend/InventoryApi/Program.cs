
using Microsoft.EntityFrameworkCore;
using Npgsql;
using InventoryApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Read the Neon connection string from the environment.
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (string.IsNullOrWhiteSpace(databaseUrl))
{
    throw new InvalidOperationException(
        "DATABASE_URL is not configured. Set it before starting the API.");
}

// Convert Neon PostgreSQL URI to an Npgsql connection string.
var databaseUri = new Uri(databaseUrl);
var userInfo = databaseUri.UserInfo.Split(':', 2);

if (userInfo.Length != 2)
{
    throw new InvalidOperationException(
        "DATABASE_URL does not contain valid database credentials.");
}

var connectionStringBuilder = new NpgsqlConnectionStringBuilder
{
    Host = databaseUri.Host,
    Port = databaseUri.IsDefaultPort ? 5432 : databaseUri.Port,
    Username = Uri.UnescapeDataString(userInfo[0]),
    Password = Uri.UnescapeDataString(userInfo[1]),
    Database = databaseUri.AbsolutePath.TrimStart('/'),
    SslMode = SslMode.Require
};

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionStringBuilder.ConnectionString));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://abuostar101-glitch.github.io")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Seed sample products if the Products table is empty.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventoryApi.Data.AppDbContext>();
    InventoryApi.Data.DbSeeder.Seed(db);
}

app.Run();