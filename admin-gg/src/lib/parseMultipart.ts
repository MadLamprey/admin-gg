import { Readable } from "stream"
import { FormData } from "formdata-node"
import { Formidable, Fields, Files, IncomingForm } from "formidable"

export async function parseForm(request: Request): Promise<FormData> {
  const formData: FormData = await request.formData()
  return formData
}