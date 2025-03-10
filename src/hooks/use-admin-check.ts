
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      const userEmail = session.user.email || '';
      const hasAdminAccess = userEmail.endsWith('@mateng.com') || userEmail.includes('admin');
      
      setIsAdmin(hasAdminAccess);
      
      if (!hasAdminAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    
    checkAdminStatus();
  }, [toast]);

  return { isAdmin, isLoading };
};
