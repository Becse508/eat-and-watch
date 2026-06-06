using System.Text.Json.Serialization;

namespace Entities.DTO
{
    public class MovieDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public int Rating { get; set; } = 0;
        public IEnumerable<int> GenreIds { get; set; } = [];
        public IEnumerable<int> TagIds { get; set; } = [];
        public string? Image { get; set; }
        public TimeOnly Length { get; set; }
    }
}
