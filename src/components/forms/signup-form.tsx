import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerSchema, RegisterSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ErrorToast } from '@/components/error-toast'
import { SuccessToast } from '@/components/success-toast'
import { LoadingOverlay } from '@/components/loading-overlay'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

// Form interface can be defined manually or can be extracted from zod schema

function SignUpForm({ switchModeHandler }: { switchModeHandler: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      username: ''
    }
  })

  async function onSubmit(values: RegisterSchema) {
    try {
      setIsLoading(true)
      await axios.post('/api/auth/signup', values)
      toast(<SuccessToast />)
      switchModeHandler()
    } catch (err: any) {
      toast(<ErrorToast error={err} />)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <LoadingOverlay loading={isLoading} />
      <h1 className="text-center text-2xl font-bold">Sign Up</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                Your username will be seen by all users
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full">
          Submit
        </Button>
        <div className="text-center text-sm">
          <span>Already have an account? </span>
          <button
            onClick={switchModeHandler}
            className="text-indigo-light underline"
          >
            Log In
          </button>
        </div>
      </form>
    </Form>
  )
}

export { SignUpForm }
