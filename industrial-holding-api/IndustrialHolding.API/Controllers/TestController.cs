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
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK, MediaTypeNames.Application.Json)]
        public async Task<IActionResult> Do()
        {
            var list = await _context.Wagon
                .Include(x => x.Voyages)
                .ThenInclude(x => x.Operations)
                .Select(x => new
                {
                    x.Number,
                    Voyages = x.Voyages.Select(y => new
                    {
                        y.StartDate,
                        y.StartStation,
                        y.EndStation,
                        Operations = y.Operations.Select(z => new
                        {
                            z.Name,
                            z.OperStation,
                            z.OperDate,
                            z.DaysWithoutMovement,
                            z.RemainingDistance
                        })
                    })
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost("parse")]
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