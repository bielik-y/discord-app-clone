import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { registerSchema, RegisterSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import AuthLayout from '@/components/layout/auth-layout'

// Form interface can be defined manually or can be extracted from zod schema

export default function SignUp() {
  const router = useRouter()
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
      const { data } = await axios.post('/api/auth/signup', values)
      console.log('success', data)
      router.replace('/')
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        console.log(err.request)
      } else {
        console.log(err.message)
      }
    }
  }

  return (
    <AuthLayout>
      <Form {...form}>
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
            <Link href="/login" className="text-blue-600 underline">
              Log In
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}
