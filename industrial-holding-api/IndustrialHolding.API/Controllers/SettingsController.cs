using IndustrialHolding.Data.Npg.Context;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace IndustrialHolding.API.Controllers
{
    [Route("api/settings")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public class SettingsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<SettingsController> _logger;

        public SettingsController(
            ILogger<SettingsController> logger,
            DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> RestoreDB()
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            string directoryPath = Path.Combine(AppContext.BaseDirectory, $"Files");
            DirectoryInfo directory = new(directoryPath);
            directory.Delete(true);

            return Ok();
        }
    }
}
