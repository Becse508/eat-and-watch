using System.Text.Json.Serialization;

namespace Entities
{
    public class Ticket
    {
        [JsonIgnore]
        public DateTime? RefundTime { get; set; }
        [JsonIgnore]
        public bool IsRefunded => RefundTime.HasValue;
        public int Id { get; set; }
        [JsonIgnore]
        public int TransactionId { get; set; }
        [JsonIgnore]
        public Transaction Transaction { get; set; }
        public int? ScreeningId { get; set; }
        public MovieScreening? Screening { get; set; }
    }
}
