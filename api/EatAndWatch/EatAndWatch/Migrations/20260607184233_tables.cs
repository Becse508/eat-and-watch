using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EatAndWatch.Migrations
{
    /// <inheritdoc />
    public partial class tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Table",
                table: "Tickets",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Room",
                table: "Screenings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TableReservation",
                table: "Screenings",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<int>(
                name: "Room",
                table: "Orders",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Table",
                table: "Orders",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Table",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Room",
                table: "Screenings");

            migrationBuilder.DropColumn(
                name: "TableReservation",
                table: "Screenings");

            migrationBuilder.DropColumn(
                name: "Room",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Table",
                table: "Orders");
        }
    }
}
