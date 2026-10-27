using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryApi.Controllers;
using InventoryApi.Data;
using InventoryApi.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace InventoryApi.Tests;

public class ControllerTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _db;

    public ControllerTests()
    {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        _db = new AppDbContext(options);
        _db.Database.EnsureCreated();

        SeedDatabase();
    }

    private void SeedDatabase()
    {
        var keyboard = new Product
        {
            Name = "Keyboard",
            Sku = "KB-001",
            Category = "Accessories",
            Price = 25.00m,
            StockQuantity = 5,
            LowStockThreshold = 10
        };

        var mouse = new Product
        {
            Name = "Mouse",
            Sku = "MS-001",
            Category = "Accessories",
            Price = 15.00m,
            StockQuantity = 25,
            LowStockThreshold = 5
        };

        _db.Products.AddRange(keyboard, mouse);
        _db.SaveChanges();

        var order = new Order
        {
            CustomerName = "Seed Customer",
            TotalAmount = keyboard.Price,
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductId = keyboard.Id,
                    Quantity = 1,
                    UnitPrice = keyboard.Price
                }
            }
        };

        _db.Orders.Add(order);
        _db.SaveChanges();
    }

    [Fact]
    public async Task GetProducts_ReturnsAllProducts()
    {
        var controller = new ProductsController(_db);

        var result = await controller.GetProducts();

        Assert.NotNull(result.Value);
        Assert.Equal(2, result.Value.Count());

        Assert.Equal(
            new[] { "Keyboard", "Mouse" },
            result.Value.Select(p => p.Name).ToArray());
    }

    [Fact]
    public async Task GetProduct_ExistingId_ReturnsProduct()
    {
        var controller = new ProductsController(_db);
        var productId = _db.Products
            .Single(p => p.Name == "Keyboard").Id;

        var result = await controller.GetProduct(productId);

        Assert.NotNull(result.Value);
        Assert.Equal("Keyboard", result.Value.Name);
    }

    [Fact]
    public async Task GetProduct_MissingId_ReturnsNotFound()
    {
        var controller = new ProductsController(_db);

        var result = await controller.GetProduct(999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetLowStock_ReturnsProductsBelowThreshold()
    {
        var controller = new ProductsController(_db);

        var result = await controller.GetLowStock();

        Assert.NotNull(result.Value);

        var products = result.Value.ToList();

        Assert.Single(products);
        Assert.Equal("Keyboard", products[0].Name);
        Assert.True(
            products[0].StockQuantity <= products[0].LowStockThreshold);
    }

    [Fact]
    public async Task GetOrders_ReturnsExistingOrders()
    {
        var controller = new OrdersController(_db);

        var result = await controller.GetOrders();

        Assert.NotNull(result.Value);

        var orders = result.Value.ToList();

        Assert.Single(orders);
        Assert.Equal("Seed Customer", orders[0].CustomerName);
        Assert.Single(orders[0].Items);
    }

    [Fact]
    public async Task CreateOrder_WithoutItems_ReturnsBadRequest()
    {
        var controller = new OrdersController(_db);

        var request = new CreateOrderRequest
        {
            CustomerName = "Test Customer",
            Items = new List<OrderItemRequest>()
        };

        var result = await controller.CreateOrder(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(
            result.Result);

        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task CreateOrder_ValidOrder_ReducesStockAndCalculatesTotal()
    {
        var product = new Product
        {
            Name = "Test Laptop",
            Sku = "LAP-001",
            Category = "Electronics",
            Price = 100m,
            StockQuantity = 10,
            LowStockThreshold = 2
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        var controller = new OrdersController(_db);

        var request = new CreateOrderRequest
        {
            CustomerName = "Test Customer",
            Items = new List<OrderItemRequest>
            {
                new OrderItemRequest
                {
                    ProductId = product.Id,
                    Quantity = 3
                }
            }
        };

        var result = await controller.CreateOrder(request);

        Assert.IsType<CreatedAtActionResult>(result.Result);

        var updatedProduct = await _db.Products.FindAsync(product.Id);
        Assert.NotNull(updatedProduct);
        Assert.Equal(7, updatedProduct.StockQuantity);

        var savedOrder = await _db.Orders
            .Include(o => o.Items)
            .SingleAsync(o => o.CustomerName == "Test Customer"
                && o.Items.Any(i => i.ProductId == product.Id));

        Assert.Equal(300m, savedOrder.TotalAmount);
        Assert.Equal(3, savedOrder.Items.Single().Quantity);
    }

    public void Dispose()
    {
        _db.Dispose();
        _connection.Dispose();
    }
}