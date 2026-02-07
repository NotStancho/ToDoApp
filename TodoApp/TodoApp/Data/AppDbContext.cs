using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TodoApp.Data.Entities;

namespace TodoApp.Data
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Nickname).IsRequired().HasMaxLength(100);
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasOne(c => c.User)
                      .WithMany()
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasIndex(c => new { c.UserId, c.Name }).IsUnique();
            });

            modelBuilder.Entity<TaskItem>(entity => {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Title).IsRequired().HasMaxLength(200);
                entity.Property(t => t.Description).HasMaxLength(2000);
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasOne(t => t.User)
                      .WithMany()
                      .HasForeignKey(t => t.UserId)
                      .OnDelete(DeleteBehavior.NoAction);
                
                entity.HasOne(t => t.Category)
                      .WithMany()
                      .HasForeignKey(t => t.CategoryId)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(t => new { t.UserId, t.CategoryId, t.IsCompleted });
                entity.HasIndex(t => new { t.UserId, t.Title });
            });
        }
    }
}
