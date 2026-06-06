using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Entities.DTO.Get;
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
        public async Task<List<ScreeningWithMovieDto>> GetAll()
        {
            return await _db.Screenings
                .Include(s => s.Movie)
                .Select(s => new ScreeningWithMovieDto
                {
                    Id = s.Id,
                    Time = s.Time,
                    Price = s.Price,

                    Movie = new MovieNoScreeningsDto
                    {
                        Id = s.Movie.Id,
                        Name = s.Movie.Name,
                        Description = s.Movie.Description,
                        Rating = s.Movie.Rating,
                        Genres = s.Movie.Genres,
                        Tags = s.Movie.Tags,
                        Length = s.Movie.Length,
                        Image = s.Movie.Image
                    }
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScreeningWithMovieDto>> Get(int id)
        {
            var s = await _db.Screenings
                .Include(x => x.Movie)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (s == null)
                return NotFound();

            return new ScreeningWithMovieDto
            {
                Id = s.Id,
                Time = s.Time,
                Price = s.Price,

                Movie = new MovieNoScreeningsDto
                {
                    Id = s.Movie.Id,
                    Name = s.Movie.Name,
                    Description = s.Movie.Description,
                    Rating = s.Movie.Rating,
                    Genres = s.Movie.Genres,
                    Tags = s.Movie.Tags,
                    Length = s.Movie.Length,
                    Image = s.Movie.Image
                }
            };
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] MovieScreeningDto screeningDto)
        {
            if (!await _db.Movies.AnyAsync(x => x.Id == screeningDto.MovieId))
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
