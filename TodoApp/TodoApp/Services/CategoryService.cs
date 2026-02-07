using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.DTOs.Categories;
using TodoApp.Data.Entities;
using TodoApp.Interfaces;

namespace TodoApp.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _db;

        public CategoryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<CategoryListDTO>> GetAllAsync(int userId)
        {
            return await _db.Categories
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .OrderBy(c => c.Name)
                .Select(c => new CategoryListDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<CategoryDetailsDTO> GetByIdAsync(int userId, int categoryId)
        {
            var category = await _db.Categories
                .AsNoTracking()
                .Where(c => c.Id == categoryId && c.UserId == userId)
                .Select(c => new CategoryDetailsDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync()
                ?? throw new KeyNotFoundException("Category not found.");
            return category;
        }

        public async Task<CategoryDetailsDTO> CreateAsync(int userId, CategoryCreateDTO dto)
        {
            var name = dto.Name.Trim();

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name cannot be empty.");

            var exists = await _db.Categories
                .AnyAsync(c => c.UserId == userId && c.Name == name);

            if (exists)
                throw new InvalidOperationException("Category with this name already exists.");

            var category = new Category
            {
                Name = name,
                UserId = userId,
                CreatedAt = DateTimeOffset.UtcNow
            };

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            return new CategoryDetailsDTO
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }

        public async Task<CategoryDetailsDTO> UpdateAsync(int userId, int categoryId, CategoryUpdateDTO dto)
        {
            var name = dto.Name.Trim();

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name cannot be empty.");

            var category = await _db.Categories
                .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId)
                ?? throw new KeyNotFoundException("Category not found.");

            var exists = await _db.Categories
                .AnyAsync(c => 
                    c.UserId == userId &&
                    c.Name == name &&
                    c.Id != categoryId);

            if (exists)
                throw new InvalidOperationException("Category with this name already exists.");

            category.Name = name;
            category.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.SaveChangesAsync();

            return new CategoryDetailsDTO
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }

        public async Task DeleteAsync(int userId, int categoryId)
        {
            var category = await _db.Categories
                .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId)
                ?? throw new KeyNotFoundException("Category not found.");

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();
        }
    }
}
