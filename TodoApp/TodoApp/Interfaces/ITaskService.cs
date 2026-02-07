using TodoApp.DTOs.Common;
using TodoApp.DTOs.Tasks;

namespace TodoApp.Interfaces
{
    public interface ITaskService
    {
        Task<PagedResult<TaskListDTO>> GetTasksAsync(int userId, int page, int pageSize, int? categoryId = null, string? search = null, bool? isCompleted = null);
        Task<List<RecentTaskDTO>> GetRecentTasksAsync(int userId, int limit);
        Task<TaskDetailsDTO> GetTaskByIdAsync(int userId, int taskId);

        Task<TaskDetailsDTO> CreateTaskAsync(int userId, TaskCreateDTO taskCreateDto);
        Task<TaskDetailsDTO> UpdateTaskAsync(int userId, int taskId, TaskUpdateDTO taskUpdateDto);
        Task UpdateTaskCompleteAsync(int userId, int taskId, bool isCompleted);
        Task DeleteTaskAsync(int userId, int taskId);
    }
}
