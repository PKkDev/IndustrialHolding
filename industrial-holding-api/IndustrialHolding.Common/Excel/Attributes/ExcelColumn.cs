namespace IndustrialHolding.Common.Excel.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ExcelColumn : Attribute
    {
        public int Index { get; set; }

        public bool CanNull { get; set; }

        public ExcelColumn(int index, bool canNull = false)
        {
            Index = index;
            CanNull = canNull;
        }
    }
}
