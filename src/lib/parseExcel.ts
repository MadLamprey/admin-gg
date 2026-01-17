import * as XLSX from "xlsx"

export function parseExcelFile(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const json = XLSX.utils.sheet_to_json(sheet)
  return json
}
