namespace IndustrialHolding.Common.Operations
{
    public enum WagonOperationType
    {
        KON = 0,

        PGR1 = 10,
        PGR2 = 11,
        PRMN = 12,
        PGR4 = 13,
        PGR5 = 14,
        PGR6 = 15,
        PRMI = 16,
        PGR8 = 17,
        PGR0 = 18,
        PGR9 = 19,
        OTPR = 2
    }

    public class WagonOperation
    {
        public string Group { get; set; }

        public string FullName { get; set; }

        public string Name { get; set; }

        public string ShortName { get; set; }

        public WagonOperationType OperationType { get; set; }
    }

    public static class WagonOperationExtensions
    {
        public static List<WagonOperation> WagonOperationDict = new();

        public static void InitDictionary()
        {
            if (WagonOperationDict.Any())
                return;

            #region Операции с вагонами в поездах

            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции с вагонами в поездах",
                FullName = "Окончание перевозки груза на своих осях",
                Name = "ОКОНЧАНИЕ ПЕРЕВОЗКИ ГРУЗА НА СВ.ОСЯХ",
                ShortName = "КОН",
                OperationType = WagonOperationType.KON,
            });

            #endregion Операции с вагонами в поездах

            #region Операции погрузки

            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Погрузка вагона на местах общего пользования",
                Name = "ПОГРУЗКА НА МЕСТАХ ОБЩ.ПОЛЬЗОВАНИЯ",
                ShortName = "ПГР1",
                OperationType = WagonOperationType.PGR1,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Погрузка вагона на подъездных путях",
                Name = "ПОГРУЗКА НА ПП",
                ShortName = "ПГР2",
                OperationType = WagonOperationType.PGR2,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Прием вагона с новостройки",
                Name = "ПРИЕМ С НОВОСТРОЙКИ",
                ShortName = "ПРМН",
                OperationType = WagonOperationType.PRMN,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Прием вагона с водного транспорта",
                Name = "ПРИЕМ С ВОДНОГО ТРАНСПОРТА",
                ShortName = "ПГР4",
                OperationType = WagonOperationType.PGR4,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Прием вагона с автотранспорта",
                Name = "ПРИЕМ С АВТОТРАНСПОРТА",
                ShortName = "ПГР5",
                OperationType = WagonOperationType.PGR5,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Перегруз из вагона иностранной железной дороги",
                Name = "ПЕРЕГРУЗ ИЗ ВАГОНОВ ИНОСТРАННОЙ Ж.Д.",
                ShortName = "ПГР6",
                OperationType = WagonOperationType.PGR6,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Прием вагона с иностранной железной дороги",
                Name = "ПРИЕМ С ИНОСТРАННОЙ Ж.Д.",
                ShortName = "ПРМИ",
                OperationType = WagonOperationType.PRMI,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Перегруз вагона с узкой колеи",
                Name = "ПЕРЕГРУЗ С УЗКОЙ КОЛЕИ",
                ShortName = "ПГР8",
                OperationType = WagonOperationType.PGR8,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Погрузка вагона без зачета в погрузку",
                Name = "ПОГРУЗКА БЕЗ ЗАЧЕТА В ПОГРУЗКУ",
                ShortName = "ПГР0",
                OperationType = WagonOperationType.PGR0,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Погрузка вагона без зачета в погрузку на подъездных путях",
                Name = "ПОГРУЗКА БЕЗ ЗАЧЕТА В ПОГРУЗКУ НА ПП",
                ShortName = "ПГР9",
                OperationType = WagonOperationType.PGR9,
            });
            WagonOperationDict.Add(new WagonOperation()
            {
                Group = "Операции погрузки",
                FullName = "Отправление вагона в составе поезда со станции",
                Name = "ОТПРАВЛЕНИЕ ВАГОНА СО СТАНЦИИ",
                ShortName = "ОТПР",
                OperationType = WagonOperationType.OTPR,
            });

            #endregion Операции погрузки

            #region операции выгрузки

            #endregion операции выгрузки

            #region операции занятия вагона, не учитываемые, как погрузка

            #endregion операции занятия вагона, не учитываемые, как погрузка

            #region операции освобождения вагона, не учитываемые как выгрузка

            #endregion операции освобождения вагона, не учитываемые как выгрузка

            #region осмотр и перечисление в нпр

            #endregion осмотр и перечисление в нпр

            #region выход из ремонта, обслуживания и нрп

            #endregion выход из ремонта, обслуживания и нрп

            #region изменение инвентарного парка вагонов, аренда

            #endregion изменение инвентарного парка вагонов, аренда

            #region другие операции с вагонами, регистрируемые в вмд

            #endregion другие операции с вагонами, регистрируемые в вмд
        }
    }
}

/*
 
WagonOperationDict.Add(new WagonOperation()
{
    Group = "xxxxxx",
    FullName = "xxxxxxxxxx",
    Name = "xxxxxxxxxxxxxx",
    ShortName = "xxxxxxxxxxxx",
    OperationType = null,
});

*/
