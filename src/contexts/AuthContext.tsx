import { useRouter } from "next/router";
import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  providerAccountId: string;
  role?: 'DEVREL_ADVOCATE' | 'DEVREL_LEAD' | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (googleUser: GoogleUser) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const createOrGetUser = async (googleUser: GoogleUser): Promise<User> => {
    try {
      // First try to get existing user
      const getRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user?email=${googleUser.email}`
      );
      const getData = await getRes.json();

      if (getData.status && getData.data) {
        // User exists, return user data with role
        return {
          id: getData.data._id,
          email: getData.data.email,
          name: getData.data.name,
          picture: getData.data.image,
          provider: getData.data.provider || "google",
          providerAccountId: getData.data.providerAccountId || googleUser.sub,
          role: getData.data.occupation === 'DEVREL_ADVOCATE' ? 'DEVREL_ADVOCATE' :
                getData.data.occupation === 'DEVREL_LEAD' ? 'DEVREL_LEAD' : null,
        };
      }

      // User doesn't exist, create new user
      const createRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: googleUser.name || "",
            email: googleUser.email,
            image: googleUser.picture || "",
            provider: "google",
            providerAccountId: googleUser.sub,
          }),
        }
      );

      const createData = await createRes.json();

      if (!createData.status) {
        throw new Error(createData.message || "Failed to create user");
      }

      return {
        id: createData.data._id,
        email: createData.data.email,
        name: createData.data.name,
        picture: createData.data.image,
        provider: createData.data.provider,
        providerAccountId: createData.data.providerAccountId,
        role: null, // New users don't have DevRel roles by default
      };
    } catch (error) {
      console.error("Error creating/getting user:", error);
      throw error;
    }
  };

  const signIn = async (googleUser: GoogleUser): Promise<void> => {
    try {
      setLoading(true);
      const userData = await createOrGetUser(googleUser);
      
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Redirect to intended destination or dashboard
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setUser(null);
      localStorage.removeItem("auth_user");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async (): Promise<void> => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("auth_user");
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Verify user still exists and get latest data
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user?email=${userData.email}`
          );
          const data = await res.json();
          
          if (data.status && data.data) {
            // Update with latest user data including role
            const updatedUser: User = {
              id: data.data._id,
              email: data.data.email,
              name: data.data.name,
              picture: data.data.image,
              provider: data.data.provider || userData.provider,
              providerAccountId: data.data.providerAccountId || userData.providerAccountId,
              role: data.data.occupation === 'DEVREL_ADVOCATE' ? 'DEVREL_ADVOCATE' :
                    data.data.occupation === 'DEVREL_LEAD' ? 'DEVREL_LEAD' : null,
            };
            
            setUser(updatedUser);
            localStorage.setItem("auth_user", JSON.stringify(updatedUser));
          } else {
            // User no longer exists, clear auth
            setUser(null);
            localStorage.removeItem("auth_user");
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          // Keep existing user data if verification fails
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Check auth error:", error);
      setUser(null);
      localStorage.removeItem("auth_user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;