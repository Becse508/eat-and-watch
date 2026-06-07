namespace Entities.DTO
{
    public class OrderDto
    {
        public TransactionDto Transaction { get; set; }
        public List<OrderProductDto> OrderProducts { get; set; } = new();
        public bool? CouponApplied { get; set; }
        public int Room { get; set; }
        public int Table { get; set; }
    }
}
