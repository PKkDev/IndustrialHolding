using IndustrialHolding.Common.Excel.Attributes;

namespace IndustrialHolding.Console.Test
{
    public class TrainCarriage
    {
        /// <summary>
        /// Номер вагона
        /// </summary>
        [ExcelColumn(1)]
        public long WagonNumber { get; set; }

        /// <summary>
        /// Признак5
        /// </summary>
        [ExcelColumn(2)]
        public string Sign5 { get; set; }

        /// <summary>
        /// Модель
        /// </summary>
        [ExcelColumn(3)]
        public string Model { get; set; }

        /// <summary>
        /// Дата следующего планового ремонта
        /// </summary>
        [ExcelColumn(4)]
        public DateTime NextScheduledRepairs { get; set; }

        /// <summary>
        /// Ост. пробег
        /// </summary>
        [ExcelColumn(5, true)]
        public string? RemainingMileage { get; set; }

        /// <summary>
        /// Станция начала рейса
        /// </summary>
        [ExcelColumn(6)]
        public string StartStation { get; set; }

        /// <summary>
        /// Время начала рейса
        /// </summary>
        [ExcelColumn(7)]
        public DateTime FlightStart { get; set; }

        /// <summary>
        /// Станция опер.
        /// </summary>
        [ExcelColumn(8)]
        public string OperStation { get; set; }

        /// <summary>
        /// Дата/время опер.
        /// </summary>
        [ExcelColumn(9)]
        public DateTime OperDateTime { get; set; }

        /// <summary>
        /// Наименование операции
        /// </summary>
        [ExcelColumn(10)]
        public string OperationName { get; set; }

        /// <summary>
        /// Номер поезда
        /// </summary>
        [ExcelColumn(11, true)]
        public string? TrainNumber { get; set; }

        /// <summary>
        /// Индекс
        /// </summary>
        [ExcelColumn(12, true)]
        public string? Index { get; set; }

        /// <summary>
        /// Дней без движ.(проверка)
        /// </summary>
        [ExcelColumn(13)]
        public double DaysWithoutMovement { get; set; }

        /// <summary>
        /// Оставшееся расстояние
        /// </summary>
        [ExcelColumn(14)]
        public double RemainingDistance { get; set; }

        /// <summary>
        /// Станция назначения
        /// </summary>
        [ExcelColumn(15, true)]
        public string? EndStation { get; set; }

        /// <summary>
        /// Дор. назн.
        /// </summary>
        [ExcelColumn(16)]
        public string DorNazn { get; set; }

        /// <summary>
        /// Груз
        /// </summary>
        [ExcelColumn(17, true)]
        public string? Cargo { get; set; }

        /// <summary>
        /// Фактический вес
        /// </summary>
        [ExcelColumn(18, true)]
        public double? Weight { get; set; }

        /// <summary>
        /// Г/п
        /// </summary>
        [ExcelColumn(19)]
        public string GP { get; set; }

        /// <summary>
        /// Грузоотправитель
        /// </summary>
        [ExcelColumn(20, true)]
        public string? Sender { get; set; }

        /// <summary>
        /// Грузополучатель
        /// </summary>
        [ExcelColumn(21, true)]
        public string? Recipient { get; set; }

        /// <summary>
        /// Накладная
        /// </summary>
        [ExcelColumn(22, true)]
        public string? Invoice { get; set; }
    }
}
