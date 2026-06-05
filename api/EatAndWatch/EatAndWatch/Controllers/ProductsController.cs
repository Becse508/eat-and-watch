using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(AppDbContext db, ILogger<ProductsController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<List<Product>> GetAll()
        {
            return await _db.ProductsWithIncludes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> Get(int id)
        {
            var product = await _db.ProductsWithIncludes.FirstOrDefaultAsync(o => o.Id == id);
            if (product == null)
                return NotFound();
            return product;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] ProductDto productDto)
        {
            List<ProductIngredient> ingredients = productDto.Ingredients.Select(
                piDto => new ProductIngredient()
                {
                    Item = piDto.Item,
                    Quantity = piDto.Quantity,
                    Unit = piDto.Unit ?? "db"
                }
            ).ToList();

            Product product = new()
            {
                Name = productDto.Name,
                Note = productDto.Note ?? "",
                Ingredients = ingredients,
                Image = productDto.Image ?? "https://rotatingsandwiches.com/wp-content/uploads/2023/04/bub-and-pops-italian-hoagie.gif",
                Type = productDto.Type,
                Price = productDto.Price,
            };

            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();
            return Ok(product.Id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var removed = await _db.Products.Where(x => x.Id == id)
                                            .ExecuteDeleteAsync();
            await _db.SaveChangesAsync();

            if (removed == 0)
                return NotFound();
            return Ok();
        }
    }
}
