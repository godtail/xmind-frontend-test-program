export enum ColumnType {
  String,
  Integer,
  Float,
  Date,
  Timestamp,
}

class SimpleCsvParse {
  parseCsv(
    csv: string,
    ColumnSetting?: { [key: string]: ColumnType }
  ): object[] {
    const rows = csv.split('\n')
    let data: object[] = []
    let columnMapping: string[] = []
    let isFirstLine: boolean = true

    rows.forEach((row) => {
      row = row.trim()
      if (!row) {
        return
      }
      if (isFirstLine) {
        // record mapping
        row.split(',').forEach((column) => {
          columnMapping.push(column)
        })
        isFirstLine = false
      } else {
        // append data
        const rowData: { [key: string]: any } = {}
        row.split(',').forEach((column, index) => {
          const columnKey = columnMapping[index]
          // format by columnSetting
          if (ColumnSetting) {
            const columnType = ColumnSetting[columnKey] || ColumnType.String
            let formatColumn: any
            switch (columnType) {
              case ColumnType.String:
                formatColumn = column
                break
              case ColumnType.Integer:
                formatColumn = parseInt(column, 10)
                break
              case ColumnType.Float:
                formatColumn = parseFloat(column)
                break
              case ColumnType.Date:
                formatColumn = new Date(column)
                break
              case ColumnType.Timestamp:
                formatColumn = new Date(parseInt(column, 10))
                break
            }
            rowData[columnKey] = formatColumn
          } else {
            rowData[columnKey] = column
          }
        })
        data.push(rowData)
      }
    })
    return data
  }
}

export default new SimpleCsvParse()
