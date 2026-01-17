"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Lock, ArrowRight, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/reusable/card"
import { Outfit, Patrick_Hand, Rampart_One } from "next/font/google"

const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: ["400"], variable: "--font-patrick" })
const rampart = Rampart_One({ subsets: ["latin"], weight: ["400"], variable: "--font-rampart" })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" })

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push("/login")
    } else {
      const data = await res.json()
      setError(data.message || "Registration failed")
    }
  }

  return (
    <div className={`
      min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden gap-20
      ${outfit.variable} ${patrickHand.variable} ${rampart.variable}
    `}>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img src="/logo.png" alt="GiggleGlory" width={200} height={100} />
        </a>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#ec008c] w-18 h-18 rounded-full flex items-center justify-center border-8 border-[#f0fcff] shadow-lg z-20">
            <User className="text-white w-5 h-5" strokeWidth={2.5} />
        </div>

        <Card className="w-full bg-white/80 backdrop-blur-sm border-2 border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-[40px] pt-12 overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl md:text-4xl font-[family-name:var(--font-outfit)] text-[#1a1a2e] mb-2">
              Create Account
            </CardTitle>
            <CardDescription className="font-[family-name:var(--font-patrick)] text-xl text-gray-500">
              Sign up to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 px-8">
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            {["name", "email", "password"].map((field, idx) => (
              <div key={field} className="space-y-2">
                <label className="font-[family-name:var(--font-outfit)] font-bold text-[#1a1a2e] ml-4 text-sm">
                  {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Password"}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ec008c] transition-colors">
                    {field === "name" && <User size={20} />}
                    {field === "email" && <Mail size={20} />}
                    {field === "password" && <Lock size={20} />}
                  </div>
                  <input
                    name={field}
                    type={field === "password" ? "password" : "text"}
                    placeholder={field === "email" ? "name@example.com" : ""}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full h-14 bg-white border-2 border-gray-100 rounded-full pl-12 pr-4 outline-none focus:border-[#ec008c] focus:ring-4 focus:ring-[#ec008c]/10 transition-all font-[family-name:var(--font-outfit)] text-gray-700 placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleRegister}
              className="w-full h-14 bg-[#ec008c] hover:bg-[#d60080] text-white rounded-full font-[family-name:var(--font-outfit)] font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              Sign Up
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 bg-gray-50/50 pt-6 pb-8 border-t border-gray-100">
            <p className="text-center font-[family-name:var(--font-outfit)] text-gray-500 text-sm mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#ec008c] font-bold hover:underline">
                Log in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
