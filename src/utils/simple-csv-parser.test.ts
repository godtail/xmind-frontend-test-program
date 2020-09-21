import simpleCsvParser from './simple-csv-parser'

describe('Simple CSV Parser', () => {
  it('csv parse correctly', () => {
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
})
