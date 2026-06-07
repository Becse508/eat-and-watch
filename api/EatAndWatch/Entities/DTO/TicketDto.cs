namespace Entities.DTO
{
    public class TicketDto
    {
        public int ScreeningId { get; set; }
        public IEnumerable<int> Tables { get; set; } = [];
    }
}
