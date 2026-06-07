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
                    Room = s.Room,
                    TableReservation = s.TableReservation,

                    Movie = new MovieNoScreeningsDto
                    {
                        Id = s.Movie.Id,
                        Name = s.Movie.Name,
                        Description = s.Movie.Description,
                        Rating = s.Movie.Rating,
                        Genres = s.Movie.Genres,
                        Tags = s.Movie.Tags,
                        Length = s.Movie.Length,
                        Image = s.Movie.Image,
                        AgeRestriction = s.Movie.AgeRestriction,
                        Director = s.Movie.Director,
                        MainCharacters = s.Movie.MainCharacters,
                        OriginalTitle = s.Movie.OriginalTitle,
                        ReleaseDate = s.Movie.ReleaseDate
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
                Room = s.Room,
                TableReservation = s.TableReservation,

                Movie = new MovieNoScreeningsDto
                {
                    Id = s.Movie.Id,
                    Name = s.Movie.Name,
                    Description = s.Movie.Description,
                    Rating = s.Movie.Rating,
                    Genres = s.Movie.Genres,
                    Tags = s.Movie.Tags,
                    Length = s.Movie.Length,
                    Image = s.Movie.Image,
                    AgeRestriction = s.Movie.AgeRestriction,
                    Director = s.Movie.Director,
                    MainCharacters = s.Movie.MainCharacters,
                    OriginalTitle = s.Movie.OriginalTitle,
                    ReleaseDate = s.Movie.ReleaseDate
                }
            };
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] MovieScreeningDto screeningDto)
        {
            if (screeningDto.Room < 1 || screeningDto.Room > 3)
                return BadRequest("Invalid room number");
            if (!await _db.Movies.AnyAsync(x => x.Id == screeningDto.MovieId))
                return NotFound("Movie not found!");

            MovieScreening screening = new()
            {
                MovieId = screeningDto.MovieId,
                Time = screeningDto.Time,
                Price = screeningDto.Price,
                Room = screeningDto.Room
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
