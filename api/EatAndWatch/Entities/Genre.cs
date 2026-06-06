using System.Text.Json.Serialization;

namespace Entities
{
    public class Genre
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
