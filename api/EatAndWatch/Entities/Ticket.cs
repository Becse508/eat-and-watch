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
        [JsonIgnore]
        public int? ScreeningId { get; set; }
        public MovieScreening? Screening { get; set; }
        public int Table { get; set; }
        public string? QRCode { get; set; }
        [JsonIgnore]
        public DateTime? UsedAt { get; set; }
        [JsonIgnore]
        public bool IsUsed => UsedAt.HasValue;
    }
}
