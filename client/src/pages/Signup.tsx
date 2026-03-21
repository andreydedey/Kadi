import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router"
import { register as registerUser } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import { createUserSchema } from "@/lib/schemas/createUserSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/AuthContext"

export const Signup = () => {
  const navigate = useNavigate()
  const { setAuthenticated } = useAuth()

  const { register, handleSubmit } = useForm<createUserSchema>({
    resolver: zodResolver(createUserSchema),
  })

  const { mutate: createUser } = useMutation({
    mutationFn: ({ name, email, password }: createUserSchema) =>
      registerUser({ username: name, email, password }),
    onSuccess: () => {
      setAuthenticated(true)
      navigate("/home")
    },
  })

  return (
    <div className="flex items-center h-screen">
      <Card className="mx-auto my-auto w-full max-w-md">
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-medium">KADI</h1>
          <h2 className="text-2xl font-medium">Create your account</h2>
          <h3 className="text-muted-foreground text-sm mb-6">
            Join Kadi and take control of your finances
          </h3>
          <form onSubmit={handleSubmit((data) => createUser(data))}>
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                />
              </Field>
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
                  placeholder="Create your password"
                  {...register("password")}
                />
              </Field>
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                />
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-3 items-center mt-6">
              <Button className="w-full" type={"submit"}>Sign up</Button>
              <span className="text-muted-foreground text-sm">
              Already have an account?{" "}
                <Link to={"/login"} className="text-white">
                Sign in
              </Link>
            </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
