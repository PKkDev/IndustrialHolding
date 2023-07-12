using Microsoft.AspNetCore.Mvc;
using IndustrialHolding.Data.Npg.Context;
using Microsoft.EntityFrameworkCore;
using System.Net.Mime;

namespace IndustrialHolding.API.Controllers
{
    public class WagonItem
    {
        public required long Id { get; set; }
        public required long Number { get; set; }
        public required List<VoyagesItem> Voyages { get; set; }
        public WagonItem()
        {
            Voyages = new();
        }
    }
    public class VoyagesItem
    {
        public required long Id { get; set; }
        public required DateTime StartDate { get; set; }
        public required string StartStation { get; set; }
        public required string EndStation { get; set; }
        public List<OperationsItem> Operations { get; set; }
        public VoyagesItem()
        {
            Operations = new();
        }
    }
    public class OperationsItem
    {
        public required long Id { get; set; }
        public required string Name { get; set; }
        public required string OperStation { get; set; }
        public required DateTime OperDate { get; set; }
        public required double DaysWithoutMovement { get; set; }
        public required double RemainingDistance { get; set; }
    }


    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<TestController> _logger;

        public TestController(
            ILogger<TestController> logger,
            DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("list")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IEnumerable<WagonItem>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Do()
        {
            var list = await _context.Wagon
                .Include(x => x.Voyages)
                .ThenInclude(x => x.Operations)
                .Select(x => new WagonItem
                {
                    Id = x.Id,
                    Number = x.Number,
                    Voyages = x.Voyages.Select(y => new VoyagesItem
                    {
                        Id = y.Id,
                        StartDate = y.StartDate,
                        StartStation = y.StartStation,
                        EndStation = y.EndStation ?? "Не указано",
                        Operations = y.Operations.Select(z => new OperationsItem
                        {
                            Id = z.Id,
                            Name = z.Name,
                            OperStation = z.OperStation,
                            OperDate = z.OperDate,
                            DaysWithoutMovement = z.DaysWithoutMovement,
                            RemainingDistance = z.RemainingDistance
                        })
                        .ToList()
                    })
                    .ToList()
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}