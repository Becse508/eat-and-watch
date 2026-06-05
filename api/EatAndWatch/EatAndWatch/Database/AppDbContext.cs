using Entities;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Database
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        /// <summary>
        /// Always use this for modifications. Use <i>OrdersWithIncludes</i> for getting data.
        /// </summary>
        public DbSet<Order> Orders => Set<Order>();
        /// <summary>
        /// Always use this for getting data. Use <i>Orders</i> for modifications.
        /// </summary>
        public IQueryable<Order> OrdersWithIncludes => Orders.Include(o => o.Transaction)
                                                             .Include(o => o.Products)
                                                             .ThenInclude(op => op.Product)
                                                             .ThenInclude(p => p.Ingredients);
        public DbSet<Product> Products => Set<Product>();
        public IQueryable<Product> ProductsWithIncludes => Products.Include(o => o.Ingredients);

        public DbSet<Transaction> Transactions => Set<Transaction>();
        public DbSet<OrderProduct> OrderProducts => Set<OrderProduct>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                        .HasMany(o => o.Products)
                        .WithOne(op => op.Order)
                        .HasForeignKey(op => op.OrderId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                        .HasOne(o => o.Transaction)
                        .WithOne()
                        .HasForeignKey<Order>(o => o.TransactionId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductIngredient>()
                        .HasOne<Product>()
                        .WithMany(p => p.Ingredients)
                        .HasForeignKey(pi => pi.ProductId)
                        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
