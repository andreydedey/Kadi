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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { REQUIRED } from "@/lib/consts"
import { useMutation } from "@tanstack/react-query"
import { updatePassword } from "@/services/auth"
import { toast } from "sonner"
import axios from "axios"

const passwordSchema = z
  .object({
    currentPassword: z.string({ error: REQUIRED }).min(1, REQUIRED),
    newPassword: z.string({ error: REQUIRED }).min(6, "At least 6 characters"),
    confirmPassword: z.string({ error: REQUIRED }).min(1, REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordSchema = z.infer<typeof passwordSchema>

const ChangePasswordContent = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordSchema>({ resolver: zodResolver(passwordSchema) })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data: PasswordSchema) =>
      updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => {
      toast.success("Password changed")
      onClose()
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to change password")
        : "Failed to change password"
      toast.error(message)
    },
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Change Password</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit((data) => save(data))}>
        <FieldGroup>
          <Field>
            <FieldLabel>Current password</FieldLabel>
            <Input type="password" {...register("currentPassword")} />
            <FieldError>{errors.currentPassword?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>New password</FieldLabel>
            <Input type="password" {...register("newPassword")} />
            <FieldError>{errors.newPassword?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Confirm new password</FieldLabel>
            <Input type="password" {...register("confirmPassword")} />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter className="w-full *:flex-1 mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>Change password</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export const ChangePasswordDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      {open && <ChangePasswordContent onClose={onClose} />}
    </Dialog>
  )
}
