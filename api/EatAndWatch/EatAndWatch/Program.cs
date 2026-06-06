using EatAndWatch;
using EatAndWatch.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

TicketTools.Secret = builder.Configuration["TicketSecret"]
    ?? throw new Exception("'TicketSecret' not set in configuration.");

builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseSqlite(
        builder.Configuration.GetConnectionString("Orders"),
        sql => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
    );
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API");
        c.RoutePrefix = "";
    });
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

