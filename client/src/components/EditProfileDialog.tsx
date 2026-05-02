import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { REQUIRED } from "@/lib/consts"
import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "@/services/auth"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "BRL", label: "BRL — Brazilian Real" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "JPY", label: "JPY — Japanese Yen" },
]

const profileSchema = z.object({
  username: z.string({ error: REQUIRED }).min(1, REQUIRED),
  defaultCurrency: z.string().optional(),
})

type ProfileSchema = z.infer<typeof profileSchema>

const EditProfileContent = ({ onClose }: { onClose: () => void }) => {
  const { user, setUser } = useAuth()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? "",
      defaultCurrency: user?.defaultCurrency ?? "",
    },
  })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data: ProfileSchema) =>
      updateProfile({
        username: data.username,
        defaultCurrency: data.defaultCurrency || undefined,
      }),
    onSuccess: (updated) => {
      setUser(updated)
      toast.success("Profile updated")
      onClose()
    },
    onError: () => toast.error("Failed to update profile"),
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit((data) => save(data))}>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Display name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="text" {...register("username")} />
            <FieldError>{errors.username?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Email{" "}
              <span className="text-muted-foreground">(not editable)</span>
            </FieldLabel>
            <Input type="email" value={user?.email ?? ""} disabled />
          </Field>
          <Field>
            <FieldLabel>Default display currency</FieldLabel>
            <Controller
              name="defaultCurrency"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.defaultCurrency?.message}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter className="w-full *:flex-1 mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export const EditProfileDialog = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      {open && <EditProfileContent onClose={onClose} />}
    </Dialog>
  )
}
