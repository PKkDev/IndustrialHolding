using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IndustrialHolding.Data.Npg.Entities
{
    [Table("operation")]
    public class Operation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("operStation")]
        public string OperStation { get; set; }

        [Column("operDate")]
        public DateTime OperDate { get; set; }

        [Column("daysWithoutMovement")]
        public double DaysWithoutMovement { get; set; }

        [Column("remainingDistance")]
        public double RemainingDistance { get; set; }

        [Column("trainNumber")]
        public string? TrainNumber { get; set; }

        [Column("voyageId")]
        public long VoyageId { get; set; }
        public Way Voyage { get; set; }
    }
}
