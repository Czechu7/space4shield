using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class SensorConfiguration : IEntityTypeConfiguration<Sensor>
{
    public void Configure(EntityTypeBuilder<Sensor> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SerialNumber)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Street)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.PostalCode)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(x => x.Latitude)
            .IsRequired()
            .HasPrecision(10, 8);

        builder.Property(x => x.Longitude)
            .IsRequired()
            .HasPrecision(11, 8);

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

        builder.Property(x => x.Status)
            .HasMaxLength(50)
            .HasDefaultValue("Active");

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        // Indeksy
        builder.HasIndex(x => x.SerialNumber)
            .IsUnique()
            .HasDatabaseName("IX_Sensors_SerialNumber");

        builder.HasIndex(x => new { x.Latitude, x.Longitude })
            .HasDatabaseName("IX_Sensors_Coordinates");

        builder.HasIndex(x => x.City)
            .HasDatabaseName("IX_Sensors_City");
        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_Sensors_UserId");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Sensors_Status");

        // Relacje

        builder.HasOne(x => x.User)
            .WithMany(x => x.Sensors)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(x => x.SensorReadings)
            .WithOne(x => x.Sensor)
            .HasForeignKey(x => x.SensorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}