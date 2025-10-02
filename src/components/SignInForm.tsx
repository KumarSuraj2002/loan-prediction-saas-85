import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignInFormData {
  email: string;
  password: string;
}

const SignInForm = ({ onToggleForm, onClose }: { onToggleForm: () => void; onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully!");
      onClose();
      navigate("/");
    }
    } catch (error) {
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Sign In</h2>
        <p className="text-muted-foreground">Enter your credentials</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input 
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input 
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm">Don't have an account?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={onToggleForm}>
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;