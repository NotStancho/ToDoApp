using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TodoApp.DTOs.Tasks;
using TodoApp.Interfaces;

namespace TodoApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : BaseController
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] int? categoryId = null, 
            [FromQuery] string? search = null, 
            [FromQuery] bool? isCompleted = null)
        {
            var tasks = await _taskService.GetTasksAsync(UserId, page, pageSize, categoryId, search, isCompleted);
            return Ok(tasks);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentTasks([FromQuery] int limit = 5)
        {
            var tasks = await _taskService.GetRecentTasksAsync(UserId, limit);
            return Ok(tasks);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTasksById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(UserId, id);
            return Ok(task);
        }


        [HttpPost]
        public async Task<IActionResult> CreateTask(TaskCreateDTO dto)
        {
            var task = await _taskService.CreateTaskAsync(UserId, dto);
            return CreatedAtAction(nameof(GetTasksById), new { id = task.Id }, task);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask(int id, TaskUpdateDTO dto)
        {
            var task = await _taskService.UpdateTaskAsync(UserId, id, dto);
            return Ok(task);
        }

        [HttpPatch("{id:int}/complete")]
        public async Task<IActionResult> UpdateTaskComplete(int id, TaskCompleteDTO dto)
        {
            await _taskService.UpdateTaskCompleteAsync(UserId, id, dto.IsCompleted);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskService.DeleteTaskAsync(UserId, id);
            return NoContent();
        }
    }
}
