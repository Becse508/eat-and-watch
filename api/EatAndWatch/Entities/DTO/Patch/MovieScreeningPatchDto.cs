using System.Text.Json.Serialization;

namespace Entities.DTO.Patch
{
    public class MovieScreeningPatchDto
    {
        public int? MovieId { get; set; }
        public DateTime? Time { get; set; }
    }
}
