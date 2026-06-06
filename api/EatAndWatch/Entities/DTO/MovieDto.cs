using System.Text.Json.Serialization;

namespace Entities.DTO
{
    public class MovieDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public float Rating { get; set; } = 0;
        public IEnumerable<int> GenreIds { get; set; } = [];
        public IEnumerable<int> TagIds { get; set; } = [];
        public string? Image { get; set; }
        public TimeOnly Length { get; set; }
        public DateOnly ReleaseDate { get; set; }
        public string OriginalTitle { get; set; }
        public string Director { get; set; }
        public IEnumerable<string> MainCharacters { get; set; } = [];
        public int AgeRestriction { get; set; }
    }
}
