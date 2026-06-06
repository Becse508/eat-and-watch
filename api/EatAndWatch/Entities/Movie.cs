using System.Text.Json.Serialization;

namespace Entities
{
    public class Movie
    {
        [JsonIgnore]
        public DateTime? DeleteTime { get; set; }
        [JsonIgnore]
        public bool IsDeleted => DeleteTime.HasValue;

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        public ICollection<Genre> Genres { get; set; } = [];
        public ICollection<Tag> Tags { get; set; } = [];
        public string Image { get; set; }
        [JsonIgnore]
        public ICollection<MovieScreening> Screenings { get; set; } = [];
    }
}
