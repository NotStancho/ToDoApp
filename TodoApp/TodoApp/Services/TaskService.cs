using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.DTOs.Common;
using TodoApp.DTOs.Tasks;
using TodoApp.Data.Entities;
using TodoApp.Interfaces;

namespace TodoApp.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _db;
        public TaskService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<PagedResult<TaskListDTO>> GetTasksAsync(int userId, int page, int pageSize, int? categoryId = null, string? search = null, bool? isCompleted = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var query = _db.Tasks
                .AsNoTracking()
                .Where(t => t.UserId == userId);

            if (categoryId.HasValue)
            {
                if (categoryId.Value == 0)
                {
                    query = query.Where(t => t.CategoryId == null);
                }
                else
                {
                    query = query.Where(t => t.CategoryId == categoryId);
                }
            }

            if (isCompleted.HasValue)
            {
                query = query.Where(t => t.IsCompleted == isCompleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();

                query = query.Where(t => t.Title.Contains(term));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TaskListDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsCompleted = t.IsCompleted,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category == null ? null : t.Category.Name,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .ToListAsync();

            return new PagedResult<TaskListDTO>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<List<RecentTaskDTO>> GetRecentTasksAsync(int userId, int limit = 5)
        {
            limit = Math.Clamp(limit, 1, 20);
            return await _db.Tasks
                .AsNoTracking()
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.UpdatedAt ?? t.CreatedAt)
                .Take(limit)
                .Select(t => new RecentTaskDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    UpdatedAt = t.UpdatedAt,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<TaskDetailsDTO> GetTaskByIdAsync(int userId, int taskId)
        {
            return await _db.Tasks
                .AsNoTracking()
                .Where(t => t.UserId == userId && t.Id == taskId)
                .Select(t => new TaskDetailsDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category == null ? null : t.Category.Name,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Task not found.");
        }


        public async Task<TaskDetailsDTO> CreateTaskAsync(int userId, TaskCreateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title cannot be empty or whitespace.");

            var title = dto.Title.Trim();
            var description = dto.Description?.Trim();

            if (dto.CategoryId.HasValue)
            {
                var categoryExists = await _db.Categories
                    .AnyAsync(c => c.Id == dto.CategoryId.Value && c.UserId == userId);

                if (!categoryExists)
                    throw new KeyNotFoundException("Category not found.");
            }

            var task = new TaskItem
            {
                Title = title,
                Description = description,
                CategoryId = dto.CategoryId,
                UserId = userId,
                IsCompleted = false,
                CreatedAt = DateTimeOffset.UtcNow
            };
            
            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            return await _db.Tasks
                .AsNoTracking()
                .Where(t => t.Id == task.Id)
                .Select(t => new TaskDetailsDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category != null ? t.Category.Name : null,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .FirstAsync();
        }

        public async Task<TaskDetailsDTO> UpdateTaskAsync(int userId, int taskId, TaskUpdateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title cannot be empty or whitespace.");

            var title = dto.Title.Trim();
            var description = dto.Description?.Trim();

            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId)
                ?? throw new KeyNotFoundException("Task not found");

            if (dto.CategoryId.HasValue)
            {
                var categoryExists = await _db.Categories
                    .AnyAsync(c => c.Id == dto.CategoryId.Value && c.UserId == userId);

                if (!categoryExists)
                    throw new KeyNotFoundException("Category not found.");
            }

            task.Title = title;
            task.Description = description;
            task.CategoryId = dto.CategoryId;
            task.IsCompleted = dto.IsCompleted;
            task.UpdatedAt = DateTimeOffset.UtcNow;
            
            await _db.SaveChangesAsync();

            return await _db.Tasks
                .AsNoTracking()
                .Where(t => t.Id == task.Id)
                .Select(t => new TaskDetailsDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category != null ? t.Category.Name : null,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .FirstAsync();
        }

        public async Task UpdateTaskCompleteAsync(int userId, int taskId, bool isCompleted)
        {
            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.UserId == userId && t.Id == taskId);

            if (task == null)
                throw new KeyNotFoundException("Task not found.");

            if (task.IsCompleted == isCompleted)
                return;

            task.IsCompleted = isCompleted;
            task.UpdatedAt = DateTimeOffset.UtcNow;
            
            await _db.SaveChangesAsync();
        }

        public async Task DeleteTaskAsync(int userId, int taskId)
        {
            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.UserId == userId && t.Id == taskId);

            if (task == null)
                throw new KeyNotFoundException("Task not found.");

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
        }
    }
}
