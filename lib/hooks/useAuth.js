"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Creating authentication context
export const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });
  const router = useRouter();

  // Checking if user is logged in on component mount (from localStorage and cookie)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Checking if token cookie exists by making a request to the server
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include", // Important for cookies
          cache: "no-store", // Prevent caching
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        const data = await response.json();

        if (data.authenticated) {
          setIsLoggedIn(true);
          setIsAuthenticated(true);

          // Setting user data from the response
          if (data.user) {
            setUserName({
              firstName: data.user.firstName || "",
              lastName: data.user.lastName || "",
            });

            // Updating localStorage with latest user data
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userFirstName", data.user.firstName || "");
            localStorage.setItem("userLastName", data.user.lastName || "");
            localStorage.setItem("userEmail", data.user.email || "");
            localStorage.setItem("userId", data.user._id || "");
          } else {
            // Fallback to localStorage if user data not in response
            const storedFirstName = localStorage.getItem("userFirstName");
            const storedLastName = localStorage.getItem("userLastName");

            if (storedFirstName && storedLastName) {
              setUserName({
                firstName: storedFirstName,
                lastName: storedLastName,
              });
            }
          }
        } else {
          // If server says not authenticated but localStorage says logged in,
          // try to use localStorage data as a fallback
          const loggedInStatus = localStorage.getItem("isLoggedIn");
          if (loggedInStatus === "true") {
            setIsLoggedIn(true);
            setIsAuthenticated(true);

            // Retrieving user name from localStorage if available
            const storedFirstName = localStorage.getItem("userFirstName");
            const storedLastName = localStorage.getItem("userLastName");

            if (storedFirstName && storedLastName) {
              setUserName({
                firstName: storedFirstName,
                lastName: storedLastName,
              });
            }
          } else {
            // Clearing localStorage if server says not authenticated
            setIsLoggedIn(false);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);

        // Fallback to localStorage if server check fails
        const loggedInStatus = localStorage.getItem("isLoggedIn");
        if (loggedInStatus === "true") {
          setIsLoggedIn(true);
          setIsAuthenticated(true);

          // Retrieve user name from localStorage if available
          const storedFirstName = localStorage.getItem("userFirstName");
          const storedLastName = localStorage.getItem("userLastName");

          if (storedFirstName && storedLastName) {
            setUserName({
              firstName: storedFirstName,
              lastName: storedLastName,
            });
          }
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Handle login with credentials
  const login = async (email, password) => {
    setLoading(true);

    try {
      // Make a real API call to your login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (data.success) {
        // Store user info - use empty string as fallback instead of 'User'
        setUserName({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
        });
        localStorage.setItem("userFirstName", data.user.firstName || "");
        localStorage.setItem("userLastName", data.user.lastName || "");
        localStorage.setItem("userEmail", data.user.email || "");
        localStorage.setItem("userId", data.user._id || "");

        // Set login state
        setIsLoggedIn(true);
        setIsAuthenticated(true);
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to stored path if exists
        if (redirectPath) {
          router.push(redirectPath);
          setRedirectPath("");
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Login failed. Please try again.",
        };
      }
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        error: err.message || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      // Call logout API to clear the cookie on server
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear local state regardless of API success
    setIsLoggedIn(false);
    setIsAuthenticated(false);
    setUserName({ firstName: "", lastName: "" });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");

    // Use capital L in Login
    router.push("/Login");
  };

  // Handle protected route access
  const requireAuth = (path) => {
    if (!isLoggedIn) {
      setShowAuthAlert(true);
      setRedirectPath(path);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthenticated,
        login,
        logout,
        requireAuth,
        loading,
        userName,
      }}
    >
      {children}

      {/* Authentication Alert Dialog */}
      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent className="bg-blue-50 border border-blue-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-900">
              Login Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-700">
              You need to login to access healthcare features. Please log in to
              continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setShowAuthAlert(false);
                router.push("/Login");
              }}
            >
              Login Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
