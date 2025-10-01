
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

const SignUpForm = ({ onToggleForm }: { onToggleForm: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: data.name }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Please sign in.");
        onToggleForm();
      }
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-muted-foreground">Enter your details to sign up</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input 
            {...register("name", { required: "Name is required" })}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

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
            {...register("password", { required: "Password is required", minLength: 6 })}
            type="password"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm">Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={onToggleForm}>
            Sign In
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
