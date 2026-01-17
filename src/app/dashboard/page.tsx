"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Pencil, Trash, Eye, Upload, Plus } from "lucide-react";
import Image from "next/image";
import BulkUploadDialog from "@/components/BulkUploadDialog"

type Product = { id: string; name: string; isActive: boolean };
type Brand = { id: string; name: string; isActive: boolean };
type Category = { id: string; name: string; isActive: boolean };

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "brands" | "categories">("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  function handleAddClick() {
    router.push(`/dashboard/${activeTab}/new`);
  }

  function handleView(id: string) {
    router.push(`/dashboard/${activeTab}/${id}/view`);
  }

  function handleEdit(id: string) {
    router.push(`/dashboard/${activeTab}/${id}/edit`);
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`);
    if (!confirmDelete) return;
    
    try {
        console.log("Deleting", id, "from", activeTab);
        const res = await fetch(`/api/${activeTab}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        if (activeTab === "products") {
            setProducts(prev => prev.filter(p => p.id !== id));
        } else if (activeTab === "brands") {
            setBrands(prev => prev.filter(b => b.id !== id));
        } else {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
        } catch (error) {
        console.error("Error deleting item:", error);
        alert("Something went wrong while deleting.");
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) router.push("/login");

    async function fetchData() {
      try {
        const [prodRes, brandRes, categoryRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const [prodData, brandData, categoryData] = await Promise.all([
          prodRes.json(),
          brandRes.json(),
          categoryRes.json(),
        ]);

        setProducts(prodData.filter((p: Product) => p.isActive));
        setBrands(brandData.filter((b: Brand) => b.isActive).sort((a: Brand, b: Brand) => a.name.localeCompare(b.name)));
        setCategories(categoryData.filter((c: Category) => c.isActive).sort((a: Category, b: Category) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error("Error fetching data", err);
      }
    }

    fetchData();
  }, []);

  const dataList = activeTab === "products" ? products : activeTab === "brands" ? brands : categories;
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Image src="/logo.png" alt="GiggleGlory" width={160} height={50} />
        <div className="flex gap-4">
          <BulkUploadDialog entity={activeTab} />
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus size={16} /> Add New {activeTab === "products" ? "Product" : activeTab === "brands" ? "Brand" : "Category"}
          </Button>
        </div>
      </div>

      <div className="flex gap-6 border-b mb-6">
        {["products", "brands", "categories"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "products" | "brands" | "categories")}
            className={
              `b-2 text-lg font-medium ${activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"}`
            }
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {dataList.length === 0 ? (
        <p className="text-center text-gray-500">No {activeTab} found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">S.No</TableHead>
              <TableHead>{activeTab === "products" ? "Product Name" : activeTab === "brands" ? "Brand Name" : "Category Name"}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataList.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="outline" onClick={() => handleView(item.id)}><Eye size={16} /></Button>
                  <Button size="icon" variant="outline" onClick={() => handleEdit(item.id)}><Pencil size={16} /></Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
