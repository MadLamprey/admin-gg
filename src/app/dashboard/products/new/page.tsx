"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/reusable/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewProductPage() {
  const router = useRouter()

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    price: 0,
    discount: 0,
    brand: "",
    category: "",
    ageGroup: "",
    keywords: "",
  })

  const [brands, setBrands] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [ageGroups, setAgeGroups] = useState<string[]>([])

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [brandsRes, categoriesRes, ageGroupsRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
          fetch("/api/ageGroups"),
        ])
        const [brandsData, categoriesData, ageGroupsData] = await Promise.all([
          brandsRes.json(),
          categoriesRes.json(),
          ageGroupsRes.json(),
        ])

        setBrands(brandsData.map((b: any) => b.name))
        setCategories(categoriesData.map((c: any) => c.name))
        setAgeGroups(ageGroupsData.map((a: any) => a.label))
      } catch (err) {
        console.error("Error fetching dropdown data:", err)
      }
    }

    fetchOptions()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      router.push("/dashboard")
    } catch (err) {
      console.error("Failed to create product", err)
    }
  }

  return (
    <div className="p-8">
      <Card className="max-w-3xl mx-auto shadow-xl rounded-[2rem] bg-white border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#1a1a2e]">Add New Product</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            {[
              ["name", "Product Name"],
              ["sku", "SKU"],
              ["price", "Price"],
              ["discount", "Discount (%)"],
              ["keywords", "Keywords (comma separated)"],
              ["description", "Description"]
            ].map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={key} className="text-sm font-bold text-[#1a1a2e]">
                  {label}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type={key === "discount" || key === "price" ? "number" : "text"}
                  value={(product as any)[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="rounded-full border-gray-200 focus:border-[#00d3d5] focus:ring-[#00d3d5]/20"
                />
              </div>
            ))}

            <div className="space-y-1">
              <Label className="text-sm font-bold text-[#1a1a2e]">Brand</Label>
              <Select value={product.brand} onValueChange={(val) => setProduct((p) => ({ ...p, brand: val }))}>
                <SelectTrigger className="rounded-full border-gray-200">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-bold text-[#1a1a2e]">Category</Label>
              <Select value={product.category} onValueChange={(val) => setProduct((p) => ({ ...p, category: val }))}>
                <SelectTrigger className="rounded-full border-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-bold text-[#1a1a2e]">Age Group</Label>
              <Select value={product.ageGroup} onValueChange={(val) => setProduct((p) => ({ ...p, ageGroup: val }))}>
                <SelectTrigger className="rounded-full border-gray-200">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="justify-end px-8 py-6">
            <Button type="submit" className="rounded-full bg-[#00d3d5] hover:bg-[#00b5b7] text-white font-semibold">
              Add Product
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
