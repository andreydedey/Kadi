import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"
import { login } from "@/services/auth"

export const Signup = () => {
  return (
    <div className="flex items-center h-screen">
      <Card className="mx-auto my-auto w-full max-w-md">
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-medium">KADI</h1>
          <h2 className="text-2xl font-medium">Create your account</h2>
          <h3 className="text-muted-foreground text-sm mb-6">
            Join Kadi and take control of your finances
          </h3>
          <form action="">
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input type="text" placeholder="John Doe" />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="your@email.com" />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="Create your password" />
              </Field>
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input type="password" placeholder="Repeat your password" />
              </Field>
            </FieldGroup>
          </form>
          <div className="flex flex-col gap-3 items-center mt-6">
            <Button className="w-full">Sign up</Button>
            <span className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to={"/login"} className="text-white">
                Sign in
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
