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

        // movies
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<Movie> Movies => Set<Movie>();
        public IQueryable<Movie> MoviesWithIncludes => Movies.Include(m => m.Genres)
                                                             .Include(m => m.Tags)
                                                             .Include(m => m.Screenings);
        // --

        public DbSet<MovieScreening> Screenings => Set<MovieScreening>();
        public IQueryable<MovieScreening> ScreeningsWithIncludes => Screenings.Include(s => s.Movie);

        public DbSet<Ticket> Tickets => Set<Ticket>();
        public IQueryable<Ticket> TicketsWithIncludes => Tickets.Include(t => t.Transaction)
                                                                .Include(t => t.Screening);


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var now = DateTime.UtcNow;

            modelBuilder.Entity<Movie>().HasQueryFilter(m => !m.DeleteTime.HasValue);
            modelBuilder.Entity<MovieScreening>().HasQueryFilter(m => !m.CancelledTime.HasValue && m.Time >= now);
            modelBuilder.Entity<Ticket>().HasIndex(t => t.QRCode).IsUnique();

            modelBuilder.Entity<Genre>().HasData(
                new Genre { Id = 1, Name = "Action" },
                new Genre { Id = 2, Name = "Adventure" },
                new Genre { Id = 3, Name = "Animation" },
                new Genre { Id = 4, Name = "Comedy" },
                new Genre { Id = 5, Name = "Crime" },
                new Genre { Id = 6, Name = "Documentary" },
                new Genre { Id = 7, Name = "Drama" },
                new Genre { Id = 8, Name = "Family" },
                new Genre { Id = 9, Name = "Fantasy" },
                new Genre { Id = 10, Name = "History" },
                new Genre { Id = 11, Name = "Horror" },
                new Genre { Id = 12, Name = "Music" },
                new Genre { Id = 13, Name = "Mystery" },
                new Genre { Id = 14, Name = "Romance" },
                new Genre { Id = 15, Name = "Science Fiction" },
                new Genre { Id = 16, Name = "Thriller" },
                new Genre { Id = 17, Name = "War" },
                new Genre { Id = 18, Name = "Western" }
            );

            modelBuilder.Entity<Movie>()
                        .HasMany(m => m.Genres)
                        .WithMany()
                        .UsingEntity(j => j.ToTable("MovieGenres"));
            modelBuilder.Entity<Movie>()
                        .HasMany(m => m.Tags)
                        .WithMany()
                        .UsingEntity(j => j.ToTable("MovieTags"));

            modelBuilder.Entity<Order>()
                        .HasMany(o => o.Products)
                        .WithOne(op => op.Order)
                        .HasForeignKey(op => op.OrderId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                        .HasOne(o => o.Transaction)
                        .WithOne()
                        .HasForeignKey<Order>(o => o.TransactionId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductIngredient>()
                        .HasOne<Product>()
                        .WithMany(p => p.Ingredients)
                        .HasForeignKey(pi => pi.ProductId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MovieScreening>()
                        .HasOne(ms => ms.Movie)
                        .WithMany(m => m.Screenings)
                        .HasForeignKey(ms => ms.MovieId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                        .HasOne(t => t.Screening)
                        .WithMany(s => s.Tickets)
                        .HasForeignKey(t => t.ScreeningId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                        .HasOne(t => t.Transaction)
                        .WithMany()
                        .HasForeignKey(t => t.TransactionId)
                        .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
