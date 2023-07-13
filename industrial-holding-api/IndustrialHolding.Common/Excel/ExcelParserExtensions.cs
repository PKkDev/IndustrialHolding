using ClosedXML.Excel;
using System.Reflection;
using IndustrialHolding.Common.Excel.Attributes;

namespace IndustrialHolding.Common.Excel
{
    public static class ExcelParserExtensions
    {
        public static IEnumerable<T> MapExcel<T>(this IXLWorksheet worksheet, int skeepRow = 1)
            where T : new()
        {
            try
            {
                var columns = typeof(T)
                    .GetProperties()
                    .Where(x => x.CustomAttributes.Any(y => y.AttributeType == typeof(ExcelColumn)))
                    .Select(x => new
                    {
                        Poperty = x,
                        ColumnOpt = x.GetCustomAttribute<ExcelColumn>() ?? throw new Exception("ExcelColumn не найден")
                    })
                    .ToList();

                var rowsCount = worksheet
                    .RangeUsed()
                    .RowCount();

                List<T> result = new();

                var start = 1 + skeepRow;
                for (int i = start; i <= rowsCount; i++)
                {
                    T item = new();

                    foreach (var column in columns)
                    {
                        try
                        {
                            var value = worksheet.Cell(i, column.ColumnOpt.Index).Value;
                            column.Poperty.SetValue(item, MapValue(column.Poperty.PropertyType, column.ColumnOpt, value));
                        }
                        catch (Exception ex)
                        {
                            var msg = $"строка: {i}, колонка: {column.ColumnOpt.Index} - {ex.Message}";
                            throw new Exception(msg);
                        }
                    }

                    result.Add(item);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private static object? MapValue(Type propertyType, ExcelColumn columnOpt, XLCellValue cell)
        {
            string? value = cell.ToString();

            if (string.IsNullOrEmpty(value))
            {
                if (columnOpt.CanNull)
                    return null;
                else
                    throw new Exception("не может быть null или empty");
            }

            if (propertyType == typeof(Int64) || propertyType == typeof(Nullable<Int64>))
                return Convert.ToInt64(value);

            if (propertyType == typeof(String))
                return value;

            if (propertyType == typeof(Double) || propertyType == typeof(Nullable<Double>))
                return Convert.ToDouble(value);

            if (propertyType == typeof(DateTime))
            {
                var date = Convert.ToDateTime(value);
                return DateTime.SpecifyKind(date, DateTimeKind.Utc);
            }

            throw new Exception("не определённый тип");
        }
    }
}
