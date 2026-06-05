namespace Entities
{
    public class Transaction
    {
        public int Id { get; set; } // PK
        public string Cashier { get; set; }
        public int Tip { get; set; }
        public int Amount { get; set; }
    }
}
