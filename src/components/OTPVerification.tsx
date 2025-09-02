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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be exactly 6 digits",
  }),
});

interface OTPVerificationProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification = ({ phone, onVerified, onBack }: OTPVerificationProps) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof otpSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: values.otp,
        type: 'sms'
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Phone number verified successfully!");
        onVerified();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("New OTP sent to your phone!");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Verify Your Phone</h2>
        <p className="text-gray-500">
          Enter the 6-digit code sent to {phone}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="000000" 
                    {...field} 
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Didn't receive the code?
        </p>
        <Button 
          variant="link" 
          className="p-0" 
          onClick={resendOTP}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend Code"}
        </Button>
        <br />
        <Button variant="link" className="p-0" onClick={onBack}>
          Change Phone Number
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;