using ClosedXML.Excel;
using IndustrialHolding.Console.Test;
using IndustrialHolding.Data.Npg.Context;
using IndustrialHolding.Data.Npg.Entities;
using Microsoft.AspNetCore.Mvc;
using IndustrialHolding.Common.Excel;
using Microsoft.EntityFrameworkCore;
using System.Net.Mime;
using System.IO.Compression;

namespace IndustrialHolding.API.Controllers
{
    /// <summary>
    /// Обработка запросов для работы с файлами
    /// </summary>
    [Route("api/files")]
    [ApiController]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public class FilesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<FilesController> _logger;

        /// <summary>
        /// Инициализация
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="context"></param>
        public FilesController(
            ILogger<FilesController> logger,
            DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Получить список всех загруженных файлов
        /// </summary>
        /// <returns></returns>
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
                var files = fileDir.GetFiles("*.xlsx");
                return Ok(files.Select(x => x.Name));
            }
        }

        /// <summary>
        /// Загрузить файл с срвера
        /// </summary>
        /// <param name="fileName">Имя файла</param>
        /// <returns></returns> 
        [HttpGet("download/file")]
        [Produces(MediaTypeNames.Application.Octet)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileContentResult))]
        public IActionResult Download([FromQuery] string fileName)
        {
            DirectoryInfo fileDir = GetLocalDirectory();
            if (!fileDir.Exists)
                throw new Exception("Директория не найдена");

            var files = fileDir.GetFiles(fileName, SearchOption.AllDirectories);

            if (!files.Any())
                throw new Exception("файл не найден");

            var file = files.First();
            var bytes = System.IO.File.ReadAllBytes(file.FullName);
            return File(bytes, MediaTypeNames.Application.Octet, file.Name);
        }

        /// <summary>
        /// Загрузить все фйлы с сервера в формате .zip
        /// </summary>
        /// <returns></returns> 
        [HttpGet("download/all/zip")]
        [Produces(MediaTypeNames.Application.Zip)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileContentResult))]
        public IActionResult DownloadAllZip()
        {
            DirectoryInfo fileDir = GetLocalDirectory();
            if (!fileDir.Exists)
                throw new Exception("Директория не найдена");

            var zipName = $"files_{DateTime.Now:yyyy-MM-dd-HH-mm:ss}.zip";
            var zipPath = Path.Combine(fileDir.Parent.FullName, zipName);
            FileInfo zipFileInfo = new(zipPath);
            if (zipFileInfo.Exists)
                zipFileInfo.Delete();

            ZipFile.CreateFromDirectory(fileDir.FullName, zipPath, CompressionLevel.Optimal, false);

            var bytes = System.IO.File.ReadAllBytes(zipPath);
            return File(bytes, MediaTypeNames.Application.Zip, zipName);
        }

        /// <summary>
        /// Удаление файла с сервера
        /// </summary>
        /// <param name="fileName">Имя файла</param>
        /// <returns></returns> 
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

        /// <summary>
        /// Загрузить файл на сервер для обработки
        /// </summary>
        /// <param name="files">Файлы</param>
        /// <returns></returns>
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

            return Ok("accepted");
        }

        /// <summary>
        /// ПОлучение директории - хрнилище файлов
        /// </summary>
        /// <returns></returns>
        private DirectoryInfo GetLocalDirectory()
        {
            string directoryPath = Path.Combine(AppContext.BaseDirectory, $"Files");
            return new(directoryPath);
        }
    }
}
