import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "@/lib/schemas/loginSchema"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/services/auth"

export const Login = () => {
  const { setAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const {
    mutate: loginUser,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: LoginSchema) => login(data),
    onSuccess: () => {
      setAuthenticated(true)
      navigate("/dashboard")
    },
  })

  return (
    <div className="flex items-center h-screen">
      <Card className="mx-auto my-auto w-full max-w-md">
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-medium">KADI</h1>
          <h2 className="text-2xl font-medium">Welcome Back</h2>
          <h3 className="text-muted-foreground text-sm mb-6">
            Sign in to your account to continue
          </h3>
          <form onSubmit={handleSubmit((data) => loginUser(data))}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </Field>
            </FieldGroup>
          </form>
          <div className="flex flex-col gap-3 items-center mt-6">
            <Button className="w-full">Sign in</Button>
            <span className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-white">
                Sign up
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
