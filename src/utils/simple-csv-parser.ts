class SimpleCsvParse {
  parseCsv(csv: string): object[] {
    const rows = csv.split('\n')
    let data: object[] = []
    let columnMapping: string[] = []
    let isFirstLine: boolean = true

    rows.forEach((row) => {
      // avoid space
      row = row.trim()
      // skip empty row
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
        const rowData: { [key: string]: string } = {}
        row.split(',').forEach((column, index) => {
          rowData[columnMapping[index]] = column
        })
        data.push(rowData)
      }
    })
    return data
  }
}

export default new SimpleCsvParse()
