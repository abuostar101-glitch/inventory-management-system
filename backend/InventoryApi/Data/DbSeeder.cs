using InventoryApi.Models;

namespace InventoryApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Products.Any()) return;

        db.Products.AddRange(
            new Product { Name = "Wireless Mouse", Sku = "WM-001", Category = "Electronics", Price = 599, StockQuantity = 45, LowStockThreshold = 10 },
            new Product { Name = "Mechanical Keyboard", Sku = "MK-002", Category = "Electronics", Price = 2499, StockQuantity = 8, LowStockThreshold = 10 },
            new Product { Name = "USB-C Cable", Sku = "UC-003", Category = "Accessories", Price = 299, StockQuantity = 120, LowStockThreshold = 20 },
            new Product { Name = "Laptop Stand", Sku = "LS-004", Category = "Accessories", Price = 1199, StockQuantity = 5, LowStockThreshold = 10 },
            new Product { Name = "Webcam HD 1080p", Sku = "WC-005", Category = "Electronics", Price = 1899, StockQuantity = 25, LowStockThreshold = 15 },
            new Product { Name = "Desk Lamp LED", Sku = "DL-006", Category = "Office", Price = 899, StockQuantity = 3, LowStockThreshold = 10 }
        );

        db.SaveChanges();
    }
}
