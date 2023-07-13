using IndustrialHolding.Data.Npg.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Net.Mime;
using System.Reflection;

namespace IndustrialHolding.API.Controllers
{
    public static class WagonItemStatusExtensions
    {
        public static string GetDescription(this WagonItemStatus status)
        {
            var statusTxt = status.ToString();
            var atr = typeof(WagonItemStatus)
                .GetFields()
                .Where(x => x.CustomAttributes.Any(x => x.AttributeType == typeof(DescriptionAttribute)) && x.Name == statusTxt)
                .Select(x => x.GetCustomAttribute<DescriptionAttribute>())
                .FirstOrDefault();

            if (atr != null)
                return atr.Description;

            return statusTxt;
        }
    }

    public class WagonItemDto
    {
        public required long Id { get; set; }
        public required long Number { get; set; }
        public required int Voyages { get; set; }
        public required LastVoyagesItemDto? LastWay { get; set; }

        public WagonItemStatus Status { get; set; }
        public string StatusTxt { get; set; }
        public int Order { get; set; }

        public WagonItemDto()
        {
            Status = WagonItemStatus.None;
            Order = (int)Status;
            StatusTxt = string.Empty;
        }

        public void SetStatus(WagonItemStatus status)
        {
            Status = status;
            Order = (int)status;
            StatusTxt = status.GetDescription();
        }

    }
    public enum WagonItemStatus
    {
        /// <summary>
        /// Бросание поезда на станции
        /// </summary>
        [Description("Бросание поезда на станции")]
        BROS = 1,

        /// <summary>
        /// Обычное состояние
        /// </summary>
        [Description("Обычное состояние")]
        None = 10
    }
    public class LastVoyagesItemDto
    {
        public required long Id { get; set; }
        public required DateTime StartDate { get; set; }
        public required string StartStation { get; set; }
        public required string EndStation { get; set; }
        public required string LastOperations { get; set; }
        public required DateTime LastOperationsDate { get; set; }
        public required int HourInWay { get; set; }
        public LastVoyagesItemDto() { }
    }


    public class VoyagesItemDto
    {
        public required long Id { get; set; }
        public required DateTime StartDate { get; set; }
        public required string StartStation { get; set; }
        public required string EndStation { get; set; }
        public List<OperationsItemDto> Operations { get; set; }
        public VoyagesItemDto()
        {
            Operations = new();
        }
    }
    public class OperationsItemDto
    {
        public required long Id { get; set; }
        public required string Name { get; set; }
        public required string OperStation { get; set; }
        public required DateTime OperDate { get; set; }
        public required double DaysWithoutMovement { get; set; }
        public required double RemainingDistance { get; set; }
    }

    [Route("api/wagon")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public class WagonController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<WagonController> _logger;

        public WagonController(
            ILogger<WagonController> logger,
            DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("wagon-list")]
        [ProducesResponseType(typeof(IEnumerable<WagonItemDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> WagonList(CancellationToken ct = default)
        {
            var query = from x in _context.Wagon
                        let lastWay = x.Voyages.OrderByDescending(y => y.StartDate).FirstOrDefault()
                        select new WagonItemDto()
                        {
                            Id = x.Id,
                            Number = x.Number,
                            Voyages = x.Voyages.Count(),
                            LastWay = lastWay == null
                                ? null
                                : new LastVoyagesItemDto()
                                {
                                    Id = lastWay.Id,
                                    StartDate = lastWay.StartDate,
                                    StartStation = lastWay.StartStation,
                                    EndStation = lastWay.EndStation ?? "Не указано",
                                    LastOperations = lastWay.Operations.OrderByDescending(z => z.OperDate).First().Name,
                                    LastOperationsDate = lastWay.LastOperDate,
                                    HourInWay = lastWay.HourInWay
                                }
                        };

            var list = await query.ToListAsync(ct);

            foreach (var item in list)
            {
                if (item.LastWay != null && item.LastWay.LastOperations.Equals("БРОСАНИЕ ПОЕЗДА НА СТАНЦИИ"))
                    item.SetStatus(WagonItemStatus.BROS);
            }

            return Ok(list.OrderBy(x => x.Order).ThenByDescending(x => x.LastWay?.HourInWay));
        }

        [HttpGet("way-list")]
        [ProducesResponseType(typeof(IEnumerable<VoyagesItemDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> List([FromQuery] long wagonNumber, CancellationToken ct = default)
        {
            var list = await _context.Way
                .Where(x => x.Wagon.Number == wagonNumber)
                .Include(x => x.Operations)
                .Select(x => new VoyagesItemDto
                {
                    Id = x.Id,
                    StartDate = x.StartDate,
                    StartStation = x.StartStation,
                    EndStation = x.EndStation ?? "Не указано",
                    Operations = x.Operations
                        .OrderBy(x => x.OperDate)
                        .Select(z => new OperationsItemDto
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
                .ToListAsync(ct);

            return Ok(list);
        }
    }
}
