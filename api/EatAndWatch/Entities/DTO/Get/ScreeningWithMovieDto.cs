namespace Entities.DTO.Get
{
    public class ScreeningWithMovieDto
    {
        public int Id { get; set; }
        public DateTime Time { get; set; }
        public int Price { get; set; }

        public MovieNoScreeningsDto Movie { get; set; }
    }
}
