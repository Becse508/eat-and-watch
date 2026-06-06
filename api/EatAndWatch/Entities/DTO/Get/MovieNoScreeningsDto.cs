namespace Entities.DTO.Get
{
    public class MovieNoScreeningsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        public ICollection<Genre> Genres { get; set; } = [];
        public ICollection<Tag> Tags { get; set; } = [];
        public TimeOnly Length { get; set; }
        public string Image { get; set; }
        public DateOnly ReleaseDate { get; set; }
    }
}
