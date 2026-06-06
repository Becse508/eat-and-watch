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
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<MoviesController> _logger;

        public MoviesController(AppDbContext db, ILogger<MoviesController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<List<MovieWithScreeningsDto>> GetAll()
        {
            var movies = await _db.MoviesWithIncludes.ToListAsync();

            return movies.Select(m => new MovieWithScreeningsDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Rating = m.Rating,
                Genres = m.Genres,
                Tags = m.Tags,
                Length = m.Length,
                Image = m.Image,

                Screenings = m.Screenings.Select(s => new ScreeningNoMovieDto
                {
                    Id = s.Id,
                    Time = s.Time,
                    Price = s.Price
                }).ToList()
            }).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieWithScreeningsDto>> Get(int id)
        {
            var m = await _db.MoviesWithIncludes
                .FirstOrDefaultAsync(o => o.Id == id);

            if (m == null)
                return NotFound();

            var dto = new MovieWithScreeningsDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Rating = m.Rating,
                Genres = m.Genres,
                Tags = m.Tags,
                Length = m.Length,
                Image = m.Image,

                Screenings = m.Screenings.Select(s => new ScreeningNoMovieDto
                {
                    Id = s.Id,
                    Time = s.Time,
                    Price = s.Price
                }).ToList()
            };

            return dto;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] MovieDto movieDto)
        {
            var genres = await _db.Genres.Where(g => movieDto.GenreIds.Contains(g.Id)).ToListAsync();
            var tags = await _db.Tags.Where(t => movieDto.TagIds.Contains(t.Id)).ToListAsync();

            Movie movie = new()
            {
                Name = movieDto.Name,
                Description = movieDto.Description ?? "",
                Image = movieDto.Image ?? "https://rotatingsandwiches.com/wp-content/uploads/2023/04/bub-and-pops-italian-hoagie.gif",
                Genres = genres,
                Tags = tags,
                Length = movieDto.Length,
                Rating = movieDto.Rating
            };

            await _db.Movies.AddAsync(movie);
            await _db.SaveChangesAsync();
            return Ok(movie.Id);
        }

        [HttpPatch]
        public async Task<ActionResult<int>> Patch(int id, [FromBody] MoviePatchDto movieDto)
        {
            var movie = await _db.Movies.Include(m => m.Screenings)
                                        .FirstOrDefaultAsync(x => x.Id == id);

            if (movie == null) return NotFound();
            PatchHelper.ApplyPatch(movie, movieDto);


            if (movieDto.GenreIds != null)
            {
                var genres = await _db.Genres.Where(g => movieDto.GenreIds.Contains(g.Id)).ToListAsync();
                PatchHelper.SyncGenres(movie, genres);
            }
            if (movieDto.TagIds != null)
            {
                var tags = await _db.Tags.Where(t => movieDto.TagIds.Contains(t.Id)).ToListAsync();
                PatchHelper.SyncTags(movie, tags);
            }
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var movie = await _db.Movies.Include(m => m.Screenings)
                                        .ThenInclude(s => s.Tickets)
                                        .Include(m => m.Genres)
                                        .Include(m => m.Tags)
                                        .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null) return NotFound();

            if (movie.Screenings.Count == 0)
            {
                movie.Genres.Clear();
                movie.Tags.Clear();
                _db.Movies.Remove(movie);
            }
            else
                movie.DeleteTime = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
