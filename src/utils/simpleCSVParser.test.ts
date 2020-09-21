import simpleCsvParser, { ColumnType } from './simpleCSVParser'

describe('Simple CSV Parser', () => {
  it('csv parse correctly (no columnSetting)', () => {
    const csv = `
    name,age
    liming,20
    lili,18
    `
    const parseResult = [
      {
        name: 'liming',
        age: '20',
      },
      {
        name: 'lili',
        age: '18',
      },
    ]
    expect(simpleCsvParser.parseCsv(csv)).toEqual(parseResult)
  })

  it('csv parse correctly (with columnSetting)', () => {
    const csv = `
    name,age,birthday,money,update
    liming,20,2020-07-07,534.45,1598009388
    lili,18,2012-06-12,423.54,1597894280
    `
    const columnSetting = {
      name: ColumnType.String,
      age: ColumnType.Integer,
      birthday: ColumnType.Date,
      money: ColumnType.Float,
      update: ColumnType.Timestamp,
    }

    const parseResult = [
      {
        name: 'liming',
        age: 20,
        birthday: new Date('2020-07-07'),
        money: 534.45,
        update: new Date('2020-08-21 19:29:48'),
      },
      {
        name: 'lili',
        age: 18,
        birthday: new Date('2012-06-12'),
        money: 423.54,
        update: new Date('2020-08-20 11:31:20'),
      },
    ]
    expect(simpleCsvParser.parseCsv(csv, columnSetting)).toEqual(parseResult)
  })
})
