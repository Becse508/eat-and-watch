using EatAndWatch.Database;
using Entities;
using Entities.DTO;
using Entities.DTO.Get;
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
            var tables = ticketDto.Tables.ToArray();
            if (tables.Length < 1)
                return BadRequest("You cannot buy less than 1 tickets");
            if (tables.Length > 23)
                return BadRequest("You cannot buy more than 23 tickets at once");
            if (tables.Any(x => x < 1 || x > 23))
                return BadRequest("Invalid table number");


            var screening = await _db.Screenings.FirstOrDefaultAsync(x => x.Id == ticketDto.ScreeningId);
            if (screening == null)
                return NotFound("Scheduled screening not found!");
            if (screening.TableReservation.Any(x => tables.Contains(x)))
                return BadRequest("Trying to reserve an already reserved table");

            Transaction transaction = new()
            {
                Amount = screening.Price * tables.Length,
                Cashier = "",
                Tip = 0
            };

            Ticket[] tickets = new Ticket[tables.Length];
            for (int i = 0; i < tables.Length; i++)
            {
                tickets[i] = new()
                {
                    ScreeningId = ticketDto.ScreeningId,
                    Transaction = transaction,
                    Table = tables[i]
                };
                screening.TableReservation.Add(tables[i]);
            }

            await _db.Tickets.AddRangeAsync(tickets);
            await _db.SaveChangesAsync();

            for (int i = 0; i < tables.Length; i++)
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
            Ticket ticket;
            try
            {
                ticket = await _db.Tickets.Include(x => x.Screening).FirstAsync(x => x.Id == id);
            }
            catch
            {
                return BadRequest("Invalid");
            }

            if (ticket.IsUsed)
                return BadRequest("Already used");

            ticket.UsedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(new
            {
                ticket.Table,
                Screening = new ScreeningNoMovieDto()
                {
                    Id = ticket.Screening.Id,
                    Price = ticket.Screening.Price,
                    Room = ticket.Screening.Room,
                    TableReservation = ticket.Screening.TableReservation,
                    Time = ticket.Screening.Time
                }
            });
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
