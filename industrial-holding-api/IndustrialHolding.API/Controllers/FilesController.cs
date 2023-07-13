using ClosedXML.Excel;
using IndustrialHolding.Console.Test;
using IndustrialHolding.Data.Npg.Context;
using IndustrialHolding.Data.Npg.Entities;
using Microsoft.AspNetCore.Mvc;
using IndustrialHolding.Common.Excel;
using Microsoft.EntityFrameworkCore;
using System.Net.Mime;

namespace IndustrialHolding.API.Controllers
{
    [Route("api/files")]
    [ApiController]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public class FilesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<FilesController> _logger;

        public FilesController(
            ILogger<FilesController> logger,
            DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("list")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
        public IActionResult List()
        {
            DirectoryInfo fileDir = GetLocalDirectory();

            if (!fileDir.Exists)
            {
                fileDir.Create();
                return Ok(new List<string>());
            }
            else
            {
                var files = fileDir.GetFiles();
                return Ok(files.Select(x => x.Name));
            }
        }

        [HttpGet("download")]
        [Produces(MediaTypeNames.Application.Octet)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileContentResult))]
        public IActionResult Download([FromQuery] string fileName)
        {
            DirectoryInfo fileDir = GetLocalDirectory();
            if (!fileDir.Exists)
                throw new Exception("файл не найден");

            var files = fileDir.GetFiles(fileName, SearchOption.AllDirectories);

            if (!files.Any())
                throw new Exception("файл не найден");

            var file = files.First();
            var bytes = System.IO.File.ReadAllBytes(file.FullName);
            return File(bytes, MediaTypeNames.Application.Octet, file.Name);
            // return File(bytes, "application/vnd.ms-excel");
        }

        [HttpGet("remove")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Remove([FromQuery] string fileName)
        {
            DirectoryInfo fileDir = GetLocalDirectory();
            if (!fileDir.Exists)
                throw new Exception("файл не найден");

            var files = fileDir.GetFiles(fileName, SearchOption.AllDirectories);

            if (!files.Any())
                throw new Exception("файл не найден");

            var file = files.First();
            file.Delete();

            return Ok();
        }

        [HttpPost("upload")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] IFormFileCollection files)
        {
            var file = files[0];

            DirectoryInfo fileDir = GetLocalDirectory();
            if (!fileDir.Exists) fileDir.Create();

            string pathToFile = Path.Combine(fileDir.FullName, $"{file.FileName}");
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
                opertion.RemainingDistance ??= 0;
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

                var way = await _context.Way
                    .FirstOrDefaultAsync(x
                    => x.StartDate == operation.FlightStart
                    && x.StartStation == operation.StartStation
                    && x.WagonId == wagon.Id);

                if (way == null)
                {
                    way = new Way()
                    {
                        StartDate = operation.FlightStart,
                        EndStation = operation.EndStation,
                        StartStation = operation.StartStation,

                        LastOperDate = operation.OperDateTime,
                        HourInWay = (int)(operation.OperDateTime - operation.FlightStart).TotalHours
                    };

                    wagon.Voyages.Add(way);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    if (string.IsNullOrEmpty(way.EndStation) && !string.IsNullOrEmpty(operation.EndStation))
                    {
                        way.EndStation = operation.EndStation;

                        _context.Way.Update(way);
                        await _context.SaveChangesAsync();
                    }

                    if (operation.OperDateTime > way.LastOperDate)
                    {
                        way.LastOperDate = operation.OperDateTime;
                        way.HourInWay = (int)(operation.OperDateTime - operation.FlightStart).TotalHours;

                        _context.Way.Update(way);
                        await _context.SaveChangesAsync();
                    }
                }

                var action = await _context.Operation
                    .FirstOrDefaultAsync(x => x.Name == operation.OperationName && x.VoyageId == way.Id);

                if (action == null)
                {
                    action = new Operation()
                    {
                        Name = operation.OperationName,
                        OperStation = operation.OperStation,
                        OperDate = operation.OperDateTime,
                        DaysWithoutMovement = operation.DaysWithoutMovement,
                        RemainingDistance = operation.RemainingDistance ?? 0,
                        TrainNumber = operation.TrainNumber
                    };

                    way.Operations.Add(action);
                    await _context.SaveChangesAsync();
                }


            }

            return Ok(200);
        }

        private DirectoryInfo GetLocalDirectory()
        {
            string directoryPath = Path.Combine(AppContext.BaseDirectory, $"Files");
            DirectoryInfo directory = new(directoryPath);
            return directory;
        }
    }
}
