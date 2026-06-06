using System.Text.Json.Serialization;

namespace Entities
{
    public class MovieScreening
    {
        [JsonIgnore]
        public DateTime? CancelledTime { get; set; }
        [JsonIgnore]
        public bool IsCancelled => CancelledTime.HasValue;
        public int Id { get; set; }
        [JsonIgnore]
        public int MovieId { get; set; }
        public Movie Movie { get; set; }
        public DateTime Time { get; set; }
        public int Price { get; set; }
        [JsonIgnore]
        public ICollection<Ticket> Tickets { get; set; } = [];
    }
}
