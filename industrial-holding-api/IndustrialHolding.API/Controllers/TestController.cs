using ClosedXML.Excel;
using IndustrialHolding.Console.Test;
using Microsoft.AspNetCore.Mvc;
using IndustrialHolding.Common.Excel;
using IndustrialHolding.Data.Npg.Context;
using Microsoft.EntityFrameworkCore;
using IndustrialHolding.Data.Npg.Entities;
using System.Net.Mime;

namespace IndustrialHolding.API.Controllers
{
    public class WagonItem
    {
        public required long Number { get; set; }
        public List<VoyagesItem> Voyages { get; set; }
        public WagonItem()
        {
            Voyages = new();
        }
    }
    public class VoyagesItem
    {
        public required DateTime StartDate { get; set; }
        public string StartStation { get; set; }
        public string? EndStation { get; set; }
        public List<OperationsItem> Operations { get; set; }
        public VoyagesItem()
        {
            Operations = new();
        }
    }
    public class OperationsItem
    {
        public string Name { get; set; }
        public string OperStation { get; set; }
        public DateTime OperDate { get; set; }
        public double DaysWithoutMovement { get; set; }
        public double RemainingDistance { get; set; }
    }


    [Route("api/test")]
    [ApiController]
    //[Produces("application/json")]
    [Produces(MediaTypeNames.Application.Json)]
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
        [ProducesResponseType(typeof(IEnumerable<WagonItem>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Do()
        {
            var list = await _context.Wagon
                .Include(x => x.Voyages)
                .ThenInclude(x => x.Operations)
                .Select(x => new WagonItem
                {
                    Number = x.Number,
                    Voyages = x.Voyages.Select(y => new VoyagesItem
                    {
                        StartDate = y.StartDate,
                        StartStation = y.StartStation,
                        EndStation = y.EndStation,
                        Operations = y.Operations.Select(z => new OperationsItem
                        {
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

        [HttpPost("parse")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Get(IFormFile file)
        {
            string filesPath = Path.Combine(AppContext.BaseDirectory, $"Files");
            DirectoryInfo fileDir = new(filesPath);
            if (!fileDir.Exists) fileDir.Create();

            string pathToFile = Path.Combine(filesPath, $"{file.FileName}");
            using FileStream fileStream = new(pathToFile, FileMode.Create);
            await file.CopyToAsync(fileStream);
            fileStream.Flush();
            fileStream.Dispose();

            using var reader = new BinaryReader(file.OpenReadStream());
            byte[] data = reader.ReadBytes((int)file.Length);
            using MemoryStream steam = new(data);

            XLWorkbook workbook = new(steam);
            var worksheet = workbook.Worksheet(1);

            var opertions = worksheet.MapExcel<TrainCarriage>();
            //opertions = opertions.Where(x => !x.StartStation.Equals("Шахунья"));
            foreach (var opertion in opertions)
            {
                opertion.EndStation = opertion.EndStation != null && opertion.EndStation.Equals("0") ? null : opertion.EndStation;
            }

            foreach (var operation in opertions)
            {
                var wagon = await _context.Wagon
                    .FirstOrDefaultAsync(x => x.Number == operation.WagonNumber);

                if (wagon == null)
                {
                    wagon = new Wagon()
                    {
                        Number = operation.WagonNumber
                    };

                    await _context.AddAsync(wagon);
                    await _context.SaveChangesAsync();
                }

                var voyage = await _context.Way
                    .FirstOrDefaultAsync(x
                    => x.StartDate == operation.FlightStart
                    && x.EndStation == operation.EndStation
                    && x.StartStation == operation.StartStation
                    && x.WagonId == wagon.Id);

                if (voyage == null)
                {
                    voyage = new Way()
                    {
                        StartDate = operation.FlightStart,
                        EndStation = operation.EndStation,
                        StartStation = operation.StartStation
                    };

                    wagon.Voyages.Add(voyage);
                    await _context.SaveChangesAsync();
                }

                var action = await _context.Operation
                    .FirstOrDefaultAsync(x => x.Name == operation.OperationName && x.VoyageId == voyage.Id);

                if (action == null)
                {
                    action = new Operation()
                    {
                        Name = operation.OperationName,
                        OperStation = operation.OperStation,
                        OperDate = operation.OperDateTime,
                        DaysWithoutMovement = operation.DaysWithoutMovement,
                        RemainingDistance = operation.RemainingDistance,
                        TrainNumber = operation.TrainNumber
                    };

                    voyage.Operations.Add(action);
                    await _context.SaveChangesAsync();
                }


            }

            return Ok(200);
        }
    }
}