import { Button } from "@/components/ui/button"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"

export const Settings = () => {
  return (
    <>
      <h1 className="text-xl font-medium mb-6">Settings</h1>
      <div className="flex gap-12">
        <div className="flex flex-col gap-3 grow-6">
          <h2 className="text-lg font-medium">Salary Day</h2>
          <p className="text-md text-muted-foreground">
            Analytics are calculated for one month, starting from the salary
            day.
          </p>
          <Field>
            <Input id="salary-day" type="number" className="py-6" />
          </Field>
        </div>
        <div className="space-y-3 grow-4">
          <div className="flex gap-3">
            <FontAwesomeIcon icon={faUser} />
            <span>Andrey Oliveira</span>
          </div>
          <Button size={"lg"} className="w-full">
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}
