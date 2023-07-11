using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IndustrialHolding.Data.Npg.Entities
{
    [Table("wagon")]
    public class Wagon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Column("number")]
        [Required]
        public long Number { get; set; }

        public List<Way> Voyages { get; set; }

        public Wagon()
        {
            Voyages = new();
        }
    }
}
