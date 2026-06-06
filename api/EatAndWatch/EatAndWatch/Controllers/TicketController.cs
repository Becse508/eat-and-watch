using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Entities.DTO.Patch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatAndWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<TicketController> _logger;
        public TicketController(AppDbContext db, ILogger<TicketController> logger)
        {
            _logger = logger;
            _db = db;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] TicketDto ticketDto)
        {
            if (ticketDto.Amount < 1)
                return BadRequest("You cannot buy less than 1 tickets");

            var screening = await _db.Screenings.FirstOrDefaultAsync(x => x.Id == ticketDto.ScreeningId);
            if (screening == null)
                return NotFound("Scheduled screening not found!");

            Transaction transaction = new()
            {
                Amount = screening.Price * ticketDto.Amount,
                Cashier = "",
                Tip = 0
            };

            Ticket[] tickets = new Ticket[ticketDto.Amount];
            for (int i = 0; i < ticketDto.Amount; i++)
            {
                tickets[i] = new()
                {
                    ScreeningId = ticketDto.ScreeningId,
                    Transaction = transaction
                };
            }

            await _db.Tickets.AddRangeAsync(tickets);
            await _db.SaveChangesAsync();

            for (int i = 0; i < ticketDto.Amount; i++)
            {
                tickets[i].QRCode = $"{tickets[i].Id}-{TicketTools.CreateHmac(tickets[i].Id.ToString())}";
            }
            await _db.SaveChangesAsync();
            return Ok(tickets.Select(x => x.QRCode));
        }

        [HttpPost("validate")]
        public async Task<ActionResult<int>> Validate([FromBody] TicketValidationInfo ticketInfo)
        {
            var parts = ticketInfo.QRCode.Split('-', 2);
            if (parts.Length < 2 || !int.TryParse(parts[0], out int id))
                return BadRequest("Invalid");

            if (!TicketTools.ValidateTicket(id, parts[1]))
                return BadRequest("Invalid");

            var ticket = await _db.Tickets.FindAsync(id);
            if (ticket == null)
                return BadRequest("Invalid");

            if (ticket.IsUsed)
                return BadRequest("Already used");

            if (ticket.ScreeningId != ticketInfo.ScreeningId)
                return BadRequest("Not for this screening");

            ticket.UsedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ticket = await _db.Tickets.FirstOrDefaultAsync(x => x.Id == id);
            if (ticket == null) return NotFound();

            ticket.RefundTime = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
