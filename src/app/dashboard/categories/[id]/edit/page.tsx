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

export default function EditCategoryPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState({
    name: "",
  })

  useEffect(() => {
    async function fetchCategory() {
      try {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })
      router.push("/dashboard")
    } catch (err) {
      console.error("Failed to update category", err)
    }
  }

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
          <CardTitle className="text-2xl font-bold text-center text-[#1a1a2e]">Edit Category</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
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
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="rounded-full border-gray-200 focus:border-[#00d3d5] focus:ring-[#00d3d5]/20"
                />
              </div>
            ))}
          </CardContent>

          <CardFooter className="justify-end px-8 py-6">
            <Button type="submit" className="rounded-full bg-[#00d3d5] hover:bg-[#00b5b7] text-white font-semibold">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
