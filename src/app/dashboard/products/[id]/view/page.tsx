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

export default function ViewProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    ageGroup: "",
    price: "",
    discount: "",
    keywords: "",
    description: "",
    metaTitle: "",
    metaDesc: "",
    images: [] as { url: string; alt?: string }[],
  })

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        setProduct(data)
        console.log(data)
      } catch (err) {
        console.error("Error fetching product", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
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
          <CardTitle className="text-2xl font-bold text-center text-[#1a1a2e]">
            Product Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          {[
            ["name", "Product Name"],
            ["sku", "SKU"],
            ["brand", "Brand"],
            ["category", "Category"],
            ["ageGroup", "Age Group"],
            ["price", "Price"],
            ["discount", "Discount %"],
            ["keywords", "Keywords (comma-separated)"],
            ["description", "Description"],
            ["metaTitle", "Meta Title"],
            ["metaDesc", "Meta Description"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-sm font-bold text-[#1a1a2e]">
                {label}
              </Label>
              <Input
                id={key}
                name={key}
                value={(product as any)[key] || ""}
                readOnly
                className="rounded-full border-gray-200 bg-gray-100 text-gray-700 cursor-default"
              />
            </div>
          ))}

          {product.images?.length > 0 && (
            <div className="space-y-1">
              <Label className="text-sm font-bold text-[#1a1a2e]">Product Images</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {product.images.map((img, idx) => (
                  <div key={idx} className="w-24 h-24 rounded-md overflow-hidden border">
                    <img
                      src={img.url}
                      alt={img.alt || `Product Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
            onClick={() => router.push(`/dashboard/products/${id}/edit`)}
            className="rounded-full font-semibold"
          >
            Edit
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
