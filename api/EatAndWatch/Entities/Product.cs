using System.Text.Json.Serialization;

namespace Entities
{
    public class Product
    {
        public int Id { get; set; } // PK
        public List<ProductIngredient> Ingredients { get; set; }
        public string Name { get; set; }
        public ProductType Type { get; set; }
        public int Price { get; set; }
        public string Note { get; set; }
        public string Image { get; set; }
    }

    public class ProductIngredient
    {
        [JsonIgnore]
        public int Id { get; set; }  // PK
        public string Item { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }

        [JsonIgnore]
        public int ProductId { get; set; } // FK
    }

    public class OrderProduct
    {
        [JsonIgnore]
        public int Id { get; set; }

        [JsonIgnore]
        public int OrderId { get; set; } // FK
        [JsonIgnore]
        public Order Order { get; set; } = null!;

        [JsonIgnore]
        public int ProductId { get; set; } // FK
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
    }

    public enum ProductType
    {
        Drink, Food, Sidedish
    }
}