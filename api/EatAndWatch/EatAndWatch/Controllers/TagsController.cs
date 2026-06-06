using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<TagsController> _logger;

        public TagsController(AppDbContext db, ILogger<TagsController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<List<Tag>> GetAll()
        {
            return await _db.Tags.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] TagGenreDto tagDto)
        {
            Tag tag = new()
            {
                Name = tagDto.Name
            };

            await _db.Tags.AddAsync(tag);
            await _db.SaveChangesAsync();
            return Ok(tag.Id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            int removed = await _db.Tags.Where(x => x.Id == id)
                                        .ExecuteDeleteAsync();
            await _db.SaveChangesAsync();

            if (removed == 0)
                return NotFound();
            return Ok();
        }
    }
}
