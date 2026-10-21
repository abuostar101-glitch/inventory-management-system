using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Controllers;

public class OrderItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public List<OrderItemRequest> Items { get; set; } = new();
}

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    // POST: api/orders
    // Creates an order and atomically deducts stock for each line item.
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderRequest request)
    {
        if (request.Items == null || request.Items.Count == 0)
            return BadRequest("Order must contain at least one item.");

        using var transaction = await _db.Database.BeginTransactionAsync();

        var order = new Order { CustomerName = request.CustomerName };
        decimal total = 0;

        foreach (var item in request.Items)
        {
            var product = await _db.Products.FindAsync(item.ProductId);
            if (product == null)
                return BadRequest($"Product with ID {item.ProductId} not found.");
            if (item.Quantity <= 0)
                return BadRequest($"Invalid quantity for {product.Name}.");
            if (product.StockQuantity < item.Quantity)
                return BadRequest($"Insufficient stock for {product.Name}. Available: {product.StockQuantity}, requested: {item.Quantity}.");

            product.StockQuantity -= item.Quantity;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });

            total += product.Price * item.Quantity;
        }

        order.TotalAmount = total;
        _db.Orders.Add(order);

        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
    }
}
