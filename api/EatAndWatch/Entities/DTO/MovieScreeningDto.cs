using System.Text.Json.Serialization;

namespace Entities.DTO
{
    public class MovieScreeningDto
    {
        public int MovieId { get; set; }
        public DateTime Time { get; set; }
    }
}
