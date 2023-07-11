using IndustrialHolding.Data.Npg.Entities;
using Microsoft.EntityFrameworkCore;

namespace IndustrialHolding.Data.Npg.Context
{
    public class DataContext : DbContext
    {
        public DbSet<Wagon> Wagon { get; set; }

        public DbSet<Way> Way { get; set; }

        public DbSet<Operation> Operation { get; set; }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public");
            base.OnModelCreating(modelBuilder);
        }
    }
}
