"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    createdAt: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        // First try to get user data from auth check endpoint
        const authCheckResponse = await fetch("/api/auth/check", {
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        const authData = await authCheckResponse.json()

        if (authData.authenticated && authData.user) {
          setUserData({
            firstName: authData.user.firstName || "",
            lastName: authData.user.lastName || "",
            email: authData.user.email || "",
            phoneNumber: authData.user.phoneNumber || "",
            createdAt: authData.user.createdAt ? new Date(authData.user.createdAt).toLocaleDateString() : "N/A",
          })
          setIsLoading(false)
          return
        }

        // If auth check doesn't return user data, try user-specific endpoint
        const userId = localStorage.getItem("userId")

        if (!userId) {
          console.error("User ID not found")
          throw new Error("User ID not found")
        }

        const response = await fetch(`/api/user/${userId}`, {
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setUserData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            phoneNumber: data.user.phoneNumber || "",
            createdAt: data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : "N/A",
          })
        } else {
          throw new Error(data.message || "Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)

        // Use localStorage data as fallback
        const storedFirstName = localStorage.getItem("userFirstName") || ""
        const storedLastName = localStorage.getItem("userLastName") || ""
        const storedEmail = localStorage.getItem("userEmail") || ""

        setUserData({
          firstName: storedFirstName,
          lastName: storedLastName,
          email: storedEmail,
          phoneNumber: "",
          createdAt: "",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Handle login button click
  const handleLoginClick = () => {
    router.push("/Login")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-2">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading your information...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <Input id="firstName" value={userData.firstName} readOnly className="pl-10" />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <Input id="lastName" value={userData.lastName} readOnly className="pl-10" />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input id="email" value={userData.email} readOnly className="pl-10" />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input id="phone" value={userData.phoneNumber} readOnly className="pl-10" />
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Member Since
                    </span>
                    <span className="font-medium">{userData.createdAt || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Account Type
                    </span>
                    <span className="font-medium">Patient</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => router.push("/appointments")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    View My Appointments
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Login Required Dialog */}
      {showLoginDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-6">You need to login to access healthcare features. Please log in to continue.</p>
            <div className="flex justify-end">
              <Button onClick={handleLoginClick} className="bg-blue-600 hover:bg-blue-700">
                Login Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
