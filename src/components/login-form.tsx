import { signIn } from 'next-auth/react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginSchema, LoginSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/loading-overlay';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

function LoginForm({ switchModeHandler }: { switchModeHandler: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: LoginSchema) {
    setIsLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password
    })
    console.log(res)
    if (res && !res.error) router.replace('/')
    else console.log(res?.error)
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <LoadingOverlay loading={isLoading} />
      <h1 className="text-center text-2xl font-bold">Log In</h1>
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
          <span>{`Don't have an account?`} </span>
          <button
            onClick={switchModeHandler}
            className="text-indigo-500 underline"
          >
            Create account
          </button>
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }
