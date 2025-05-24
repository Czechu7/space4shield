using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class SensorReadingConfiguration : IEntityTypeConfiguration<SensorReading>
{
    public void Configure(EntityTypeBuilder<SensorReading> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ReadingDateTime)
            .IsRequired();

        builder.Property(x => x.Temperature)
            .HasPrecision(5, 2);

        builder.Property(x => x.Humidity)
            .HasPrecision(5, 2);

        builder.Property(x => x.AirPressure)
            .HasPrecision(6, 2);

        builder.Property(x => x.PM1_0)
            .HasPrecision(6, 2);

        builder.Property(x => x.PM2_5)
            .HasPrecision(6, 2);

        builder.Property(x => x.PM10)
            .HasPrecision(6, 2);

        builder.Property(x => x.WaterLevel)
            .HasPrecision(8, 2);

        builder.Property(x => x.Precipitation)
            .HasPrecision(6, 2);

        builder.Property(x => x.UVRadiation)
            .HasPrecision(4, 2);

        builder.Property(x => x.ReadingSource)
            .HasMaxLength(50)
            .HasDefaultValue("Automatic");



        // Indeksy
        builder.HasIndex(x => x.SensorId)
            .HasDatabaseName("IX_SensorReadings_SensorId");

        builder.HasIndex(x => x.ReadingDateTime)
            .HasDatabaseName("IX_SensorReadings_ReadingDateTime");

        builder.HasIndex(x => new { x.SensorId, x.ReadingDateTime })
            .HasDatabaseName("IX_SensorReadings_SensorId_ReadingDateTime");

        builder.HasIndex(x => x.IsValid)
            .HasDatabaseName("IX_SensorReadings_IsValid");
    }
}