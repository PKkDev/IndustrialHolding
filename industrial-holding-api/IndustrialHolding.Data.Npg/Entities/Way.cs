using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IndustrialHolding.Data.Npg.Entities
{
    [Table("voyage")]
    public class Way
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        //TypeName = "TIMESTAMP WITHOUT TIME ZONE"
        [Column("start")]
        public DateTime StartDate { get; set; }

        [Column("startStation")]
        public string StartStation { get; set; }

        [Column("endStation")]
        public string? EndStation { get; set; }

        public List<Operation> Operations { get; set; }

        [Column("wagonId")]
        public long WagonId { get; set; }
        public Wagon Wagon { get; set; }

        public Way()
        {
            Operations = new();
        }
    }
}
