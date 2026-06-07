namespace Entities.DTO.Get
{
    public class ScreeningNoMovieDto
    {
        public int Id { get; set; }
        public DateTime Time { get; set; }
        public int Price { get; set; }
        public int Room { get; set; }
        public ICollection<int> TableReservation { get; set; }
    }
}
