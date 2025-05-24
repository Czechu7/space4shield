using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSensorEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sensors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Street = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Latitude = table.Column<double>(type: "float(10)", precision: 10, scale: 8, nullable: false),
                    Longitude = table.Column<double>(type: "float(11)", precision: 11, scale: 8, nullable: false),
                    Temperature = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: true),
                    Humidity = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: true),
                    AirPressure = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    PM1_0 = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    PM2_5 = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    PM10 = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    WaterLevel = table.Column<double>(type: "float(8)", precision: 8, scale: 2, nullable: true),
                    Precipitation = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    UVRadiation = table.Column<double>(type: "float(4)", precision: 4, scale: 2, nullable: true),
                    LastMeasurement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Active"),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sensors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SensorReadings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SensorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReadingDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Temperature = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: true),
                    Humidity = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: true),
                    AirPressure = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    PM1_0 = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    PM2_5 = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    PM10 = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    WaterLevel = table.Column<double>(type: "float(8)", precision: 8, scale: 2, nullable: true),
                    Precipitation = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: true),
                    UVRadiation = table.Column<double>(type: "float(4)", precision: 4, scale: 2, nullable: true),
                    ReadingSource = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Automatic"),
                    IsValid = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorReadings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SensorReadings_Sensors_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SensorReadings_IsValid",
                table: "SensorReadings",
                column: "IsValid");

            migrationBuilder.CreateIndex(
                name: "IX_SensorReadings_ReadingDateTime",
                table: "SensorReadings",
                column: "ReadingDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_SensorReadings_SensorId",
                table: "SensorReadings",
                column: "SensorId");

            migrationBuilder.CreateIndex(
                name: "IX_SensorReadings_SensorId_ReadingDateTime",
                table: "SensorReadings",
                columns: new[] { "SensorId", "ReadingDateTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_City",
                table: "Sensors",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_Coordinates",
                table: "Sensors",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_SerialNumber",
                table: "Sensors",
                column: "SerialNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_Status",
                table: "Sensors",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SensorReadings");

            migrationBuilder.DropTable(
                name: "Sensors");
        }
    }
}
