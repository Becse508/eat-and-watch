using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EatAndWatch.Migrations
{
    /// <inheritdoc />
    public partial class migrans3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Orders",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Orders");
        }
    }
}
