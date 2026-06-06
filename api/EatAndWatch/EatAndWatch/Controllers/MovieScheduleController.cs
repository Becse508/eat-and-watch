using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Entities.DTO.Patch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieScheduleController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<MovieScheduleController> _logger;

        public MovieScheduleController(AppDbContext db, ILogger<MovieScheduleController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<List<MovieScreening>> GetAll()
        {
            return await _db.ScreeningsWithIncludes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieScreening>> Get(int id)
        {
            var screening = await _db.ScreeningsWithIncludes.FirstOrDefaultAsync(o => o.Id == id);
            if (screening == null)
                return NotFound();
            return screening;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] MovieScreeningDto screeningDto)
        {
            if (!_db.Movies.Any(x => x.Id == screeningDto.MovieId))
                return NotFound("Movie not found!");

            MovieScreening screening = new()
            {
                MovieId = screeningDto.MovieId,
                Time = screeningDto.Time
            };

            await _db.Screenings.AddAsync(screening);
            await _db.SaveChangesAsync();
            return Ok(screening.Id);
        }

        [HttpPatch]
        public async Task<ActionResult<int>> Patch(int id, [FromBody] MovieScreeningPatchDto screeningDto)
        {
            var screening = await _db.Screenings.Include(m => m.Movie)
                                                .FirstOrDefaultAsync(x => x.Id == id);

            if (screening == null) return NotFound("Scheduled screening not found!");
            if (screeningDto.MovieId != null && !_db.Movies.Any(x => x.Id == screeningDto.MovieId))
                return NotFound("Movie not found!");

            PatchHelper.ApplyPatch(screening, screeningDto);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var screening = await _db.Screenings.Include(m => m.Movie)
                                                .FirstOrDefaultAsync(x => x.Id == id);

            if (screening == null) return NotFound();

            screening.CancelledTime = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
