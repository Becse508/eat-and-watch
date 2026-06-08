using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EatAndWatch.Migrations
{
    /// <inheritdoc />
    public partial class migrans4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeletedAt",
                table: "Orders",
                newName: "DeleteTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeleteTime",
                table: "Orders",
                newName: "DeletedAt");
        }
    }
}
