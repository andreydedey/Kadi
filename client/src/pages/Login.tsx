import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"

export const Login = () => {
  return (
    <div className="flex items-center h-screen">
      <Card className="mx-auto my-auto w-full max-w-md">
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-medium">KADI</h1>
          <h2 className="text-2xl font-medium">Welcome Back</h2>
          <h3 className="text-muted-foreground text-sm mb-6">
            Sign in to your account to continue
          </h3>
          <form action="">
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="your@email.com" />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="Enter your password" />
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
