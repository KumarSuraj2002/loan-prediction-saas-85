
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
import OTPVerification from "./OTPVerification";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
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
  confirmPassword: z.string(),
}).refine((data) => {
  if (data.authMethod === "email" && !data.email) {
    return false;
  }
  if (data.authMethod === "phone" && !data.phone) {
    return false;
  }
  return data.password === data.confirmPassword;
}, {
  message: "Passwords do not match or required field missing",
  path: ["confirmPassword"],
});

const SignUpForm = ({ onToggleForm }: { onToggleForm: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [phoneForVerification, setPhoneForVerification] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      authMethod: "email",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let authResponse;
      
      if (values.authMethod === "email" && values.email) {
        authResponse = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: values.name,
            }
          }
        });
        
        if (authResponse?.error) {
          toast.error(authResponse.error.message);
        } else {
          toast.success("Check your email for the verification link!");
          form.reset();
        }
      } else if (values.authMethod === "phone" && values.phone) {
        // For phone, we first send OTP
        authResponse = await supabase.auth.signUp({
          phone: values.phone,
          password: values.password,
          options: {
            data: {
              full_name: values.name,
            }
          }
        });
        
        if (authResponse?.error) {
          toast.error(authResponse.error.message);
        } else {
          setPhoneForVerification(values.phone);
          setShowOTPVerification(true);
          toast.success("OTP sent to your phone number!");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setShowOTPVerification(false);
    setPhoneForVerification("");
    form.reset();
    toast.success("Account created successfully!");
  };

  const handleBackFromOTP = () => {
    setShowOTPVerification(false);
    setPhoneForVerification("");
  };

  const watchAuthMethod = form.watch("authMethod");

  if (showOTPVerification) {
    return (
      <OTPVerification 
        phone={phoneForVerification}
        onVerified={handleOTPVerified}
        onBack={handleBackFromOTP}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <p className="text-gray-500">Enter your information to create an account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p>Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={onToggleForm}>
            Sign In
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
