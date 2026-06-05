namespace Entities.DTO
{
    public class ProductDto
    {
        public List<ProductIngredientDto> Ingredients { get; set; }
        public string Name { get; set; }
        public ProductType Type { get; set; }
        public int Price { get; set; }
        public string? Note { get; set; }
        public string? Image { get; set; }
    }
}
