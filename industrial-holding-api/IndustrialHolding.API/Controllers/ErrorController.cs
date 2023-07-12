using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace IndustrialHolding.API.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        public ErrorController() { }

        [Route("/error")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public IActionResult GetExceptionInfo()
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();

            var exception = context.Error;

            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "An unexpected error occurred",
                Detail = exception.Message
            };

            //if (exception is UnauthorizedAccessException)
            //{
            //    problemDetails.Status = StatusCodes.Status401Unauthorized;
            //    problemDetails.Title = "Unauthorized access";
            //}

            return StatusCode(StatusCodes.Status500InternalServerError, problemDetails);
        }
    }
}
