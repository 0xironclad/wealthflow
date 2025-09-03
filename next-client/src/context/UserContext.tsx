"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/superbase/client";
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only try to authenticate if environment variables are available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setIsLoading(true);
      const fetchUser = async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
        } catch (error) {
          console.warn('Supabase auth not available:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    } else {
      // If no environment variables, just set loading to false
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};