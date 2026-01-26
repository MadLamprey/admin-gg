"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/reusable/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    price: "",
    discount: "",
    keywords: "",
    description: "",
    brand: "",
    category: "",
    ageGroup: "",
    metaTitle: "",
    metaDesc: "",
  })

  const [brands, setBrands] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [ageGroups, setAgeGroups] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, brandsRes, categoriesRes, ageGroupsRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/brands"),
          fetch("/api/categories"),
          fetch("/api/ageGroups"),
        ])

        const [productData, brandsData, categoriesData, ageGroupsData] = await Promise.all([
          productRes.json(),
          brandsRes.json(),
          categoriesRes.json(),
          ageGroupsRes.json(),
        ])

        setProduct(productData)
        setExistingImages(productData.images?.map((img: any) => img.url) || [])
        setBrands(brandsData.map((b: any) => b.name))
        setCategories(categoriesData.map((c: any) => c.name))
        setAgeGroups(ageGroupsData.map((a: any) => a.label))
      } catch (err) {
        console.error("Error loading product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files))
    }
  }

  async function uploadImagesToSupabase(files: File[]) {
    const urls: string[] = []

    for (const file of files) {
      const ext = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file)

      console.log("Upload response:", data, error);

      if (error) {
        console.error("Upload error:", error)
        continue
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path)

      if (publicUrlData?.publicUrl) {
        urls.push(publicUrlData.publicUrl)
      }
    }

    return urls
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageUrls: string[] = []

      if (newImages.length > 0) {
        imageUrls = await uploadImagesToSupabase(newImages)
      }

      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, imageUrls }),
      })

      router.push("/dashboard")
    } catch (err) {
      console.error("Failed to update product", err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96"><Loader className="animate-spin" size={32} /></div>
  }

  return (
    <div className="p-8">
      <Card className="max-w-3xl mx-auto shadow-xl rounded-[2rem] bg-white border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#1a1a2e]">Edit Product</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            {[
              ["name", "Product Name"],
              ["sku", "SKU"],
              ["price", "Price"],
              ["discount", "Discount %"],
              ["keywords", "Keywords (comma-separated)"],
              ["description", "Description"],
              ["metaTitle", "Meta Title"],
              ["metaDesc", "Meta Description"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={key} className="text-sm font-bold text-[#1a1a2e]">{label}</Label>
                <Input
                  id={key}
                  name={key}
                  type={key === "discount" || key === "price" ? "number" : "text"}
                  value={(product as any)[key]}
                  onChange={handleChange}
                  className="rounded-full border-gray-200 focus:border-[#00d3d5] focus:ring-[#00d3d5]/20"
                />
              </div>
            ))}

            {[
              { label: "Brand", options: brands, field: "brand" },
              { label: "Category", options: categories, field: "category" },
              { label: "Age Group", options: ageGroups, field: "ageGroup" },
            ].map(({ label, options, field }) => (
              <div key={field} className="space-y-1">
                <Label className="text-sm font-bold text-[#1a1a2e]">{label}</Label>
                <Select value={(product as any)[field]} onValueChange={val => setProduct(prev => ({ ...prev, [field]: val }))}>
                  <SelectTrigger className="rounded-full border-gray-200">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <div className="space-y-1">
              <Label className="text-sm font-bold text-[#1a1a2e]">Existing Images</Label>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} className="w-20 h-20 rounded-md object-cover border" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="images" className="text-sm font-bold text-[#1a1a2e]">Upload New Images</Label>
              <Input type="file" id="images" multiple accept="image/*" onChange={handleFileChange} />
            </div>
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
