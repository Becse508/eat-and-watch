using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext db, ILogger<OrdersController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<List<Order>> GetAll() {
            return await _db.OrdersWithIncludes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> Get(int id)
        {
            var order = await _db.OrdersWithIncludes.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();
            return order;
        }


        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] OrderDto orderDto)
        {
            if (orderDto.OrderProducts.Count == 0)
                return BadRequest(new
                {
                    error = "EmptyOrder",
                    message = "You cannot post an empty order."
                });

            if (orderDto.Room < 1 || orderDto.Room > 3)
                return BadRequest("Invalid room number");
            if (orderDto.Table < 1 || orderDto.Table > 23)
                return BadRequest("Invalid table number");
            

            var orderProducts = new List<OrderProduct>();
            int amount = 0;
            foreach (var opDto in orderDto.OrderProducts)
            {
                var product = await _db.Products.FindAsync(opDto.ProductId);
                if (product == null)
                    return BadRequest($"Product {opDto.ProductId} does not exist");

                amount += product.Price * opDto.Quantity;
                orderProducts.Add(new OrderProduct
                {
                    ProductId = product.Id,
                    Quantity = opDto.Quantity
                });
            }
            var transaction = new Transaction
            {
                Cashier = orderDto.Transaction.Cashier ?? "AP12345",
                Tip = orderDto.Transaction.Tip,
                Amount = (int)(amount * ((orderDto.CouponApplied ?? false) ? 0.8 : 1))
            };
            await _db.Transactions.AddAsync(transaction);

            var order = new Order {
                Transaction = transaction,
                Products = orderProducts,
                CouponApplied = orderDto.CouponApplied ?? false,
                Room = orderDto.Room,
                Table = orderDto.Table
            };

            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();
            return Ok(order.Id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) {
            var removed = await _db.Orders.Where(x => x.Id == id)
                                          .ExecuteDeleteAsync();

            if (removed == 0)
                return NotFound();
            return Ok();
        }
    }
}
