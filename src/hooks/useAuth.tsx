import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

// SECURITY: Use environment variables instead of hardcoded values
const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || "CHANGE_ME_IN_PRODUCTION";
const ALLOWED_ADMIN_DOMAINS = import.meta.env.VITE_ALLOWED_DOMAINS?.split(',') || ["gmail.com", "outlook.com", "hotmail.com"];

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auth state listener setup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const adminVerified = localStorage.getItem("adminVerified");
          if (adminVerified === "true") {
            setIsAuthenticated(true);
            ensureAdminUser(session.user.id);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("adminVerified");
        }
        
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem("adminVerified");
          setIsAuthenticated(false);
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const adminVerified = localStorage.getItem("adminVerified");
        if (adminVerified === "true") {
          setIsAuthenticated(true);
          ensureAdminUser(session.user.id);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureAdminUser = async (userId: string) => {
    try {
      const { data: existingAdmin, error: checkError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking admin user:", checkError);
        return;
      }

      if (!existingAdmin) {
        const { error: insertError } = await supabase
          .from("admin_users")
          .insert({ 
            user_id: userId, 
            role: "admin",
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error("Error creating admin user:", insertError);
        }
      }
    } catch (error) {
      console.error("Admin user setup exception:", error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`
        }
      });
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      toast({
        title: "Signup Successful",
        description: "Please check your email to confirm your account.",
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      return { success: true, error: null, user: data.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const verifyPasskey = async (passkey: string) => {
    if (!user) {
      return { success: false, error: { message: "Not signed in" } };
    }
    
    try {
      const emailDomain = user.email?.split('@')[1];
      const isDomainAllowed = emailDomain && ALLOWED_ADMIN_DOMAINS.includes(emailDomain);
      
      if (!isDomainAllowed) {
        return { 
          success: false, 
          error: { message: "Email domain not authorized for admin access" } 
        };
      }
      
      if (passkey === ADMIN_PASSKEY) {
        localStorage.setItem("adminVerified", "true");
        setIsAuthenticated(true);
        await ensureAdminUser(user.id);
        return { success: true, error: null };
      } else {
        return { success: false, error: { message: "Invalid passkey" } };
      }
    } catch (error) {
      return { success: false, error: { message: "Verification failed" } };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("adminVerified");
      setIsAuthenticated(false);
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      return { success: !error, error };
    } catch (error) {
      return { success: false, error: { message: "An unexpected error occurred" } };
    }
  };

  return {
    isAuthenticated,
    loading,
    user,
    signUp,
    signIn,
    verifyPasskey,
    signOut,
    resetPassword,
  };
};
