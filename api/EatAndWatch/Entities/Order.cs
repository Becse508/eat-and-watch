using System.Text.Json.Serialization;

namespace Entities
{
    public class Order
    {
        public int Id { get; set; } // PK

        [JsonIgnore]
        public int TransactionId { get; set; } // FK
        public Transaction Transaction { get; set; }

        public List<OrderProduct> Products { get; set; } = [];
        public bool CouponApplied { get; set; }
        public int Room { get; set; }
        public int Table { get; set; }
    }
}
