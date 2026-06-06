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
        public async Task<List<Movie>> GetAll()
        {
            return await _db.MoviesWithIncludes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> Get(int id)
        {
            var movie = await _db.MoviesWithIncludes.FirstOrDefaultAsync(o => o.Id == id);
            if (movie == null)
                return NotFound();
            return movie;
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
                Tags = tags
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
                movie.DeleteTime = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
