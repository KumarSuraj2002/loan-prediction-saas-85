import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  authMethod: z.enum(["email", "phone"], {
    required_error: "Please select authentication method",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }).optional(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits",
  }).optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
}).refine((data) => {
  if (data.authMethod === "email" && !data.email) {
    return false;
  }
  if (data.authMethod === "phone" && !data.phone) {
    return false;
  }
  return true;
}, {
  message: "Required field missing",
  path: ["email"],
});

const SignInForm = ({ onToggleForm }: { onToggleForm: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authMethod: "email",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let authResponse;
      
      if (values.authMethod === "email" && values.email) {
        authResponse = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      } else if (values.authMethod === "phone" && values.phone) {
        authResponse = await supabase.auth.signInWithPassword({
          phone: values.phone,
          password: values.password,
        });
      }

      if (authResponse?.error) {
        toast.error(authResponse.error.message);
      } else {
        toast.success("Successfully signed in!");
        // Redirect will be handled by auth state change
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const watchAuthMethod = form.watch("authMethod");

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Sign In</h2>
        <p className="text-gray-500">Enter your credentials to access your account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="authMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authentication Method</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="email">Email Address</option>
                    <option value="phone">Phone Number</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchAuthMethod === "email" && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {watchAuthMethod === "phone" && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p>Don't have an account?{" "}
          <Button variant="link" className="p-0" onClick={onToggleForm}>
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;