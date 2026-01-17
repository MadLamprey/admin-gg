"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/reusable/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

export default function ViewCategoryPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState({
    name: "",
  })

  useEffect(() => {
    async function fetchCategory() {
      try {
        console.log("Fetching category with ID:", id, typeof id);
        const res = await fetch(`/api/categories/${id}`)
        const data = await res.json()
        setCategory(data)
      } catch (err) {
        console.error("Error fetching category", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="p-8">
      <Card className="max-w-3xl mx-auto shadow-xl rounded-[2rem] bg-white border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#1a1a2e]">Category Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          {[
            ["name", "Category Name"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-sm font-bold text-[#1a1a2e]">
                {label}
              </Label>
              <Input
                id={key}
                name={key}
                value={(category as any)[key]}
                readOnly
                className="rounded-full border-gray-200 bg-gray-100 text-gray-700 cursor-default"
              />
            </div>
          ))}
        </CardContent>

        <CardFooter className="justify-end px-8 pb-6 space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard")}
            className="rounded-full font-semibold"
          >
            Back to Dashboard
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/dashboard/categories/${id}/edit`)}
            className="rounded-full font-semibold"
          >
            Edit
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
