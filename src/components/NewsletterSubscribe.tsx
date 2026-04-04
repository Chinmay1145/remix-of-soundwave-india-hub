import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: 'Invalid Email',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Simulate API call - in production, this would save to database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubscribed(true);
    toast({
      title: 'Subscribed!',
      description: 'Thank you for subscribing to our newsletter.',
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
      {subscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-green-400"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Thanks for subscribing!</span>
        </motion.div>
      ) : (
        <>
          <div className="relative flex-1 md:w-80">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-12 bg-background border-border focus:border-primary"
              disabled={loading}
              required
            />
          </div>
          <Button
            type="submit"
            variant="glow"
            disabled={loading || !email}
            className="h-12 px-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </>
      )}
    </form>
  );
};

export default NewsletterSubscribe;
