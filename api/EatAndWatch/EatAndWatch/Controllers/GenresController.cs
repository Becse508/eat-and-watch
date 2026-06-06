using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<GenresController> _logger;

        public GenresController(AppDbContext db, ILogger<GenresController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<List<Genre>> GetAll()
        {
            return await _db.Genres.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] TagGenreDto genreDto)
        {
            Genre genre = new()
            {
                Name = genreDto.Name
            };

            await _db.Genres.AddAsync(genre);
            await _db.SaveChangesAsync();
            return Ok(genre.Id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            int removed = await _db.Genres.Where(x => x.Id == id)
                                          .ExecuteDeleteAsync();
            await _db.SaveChangesAsync();

            if (removed == 0)
                return NotFound();
            return Ok();
        }
    }
}
