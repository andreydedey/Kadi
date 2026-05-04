import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation } from "@tanstack/react-query"
import { archiveWallet } from "@/services/wallet"
import { toast } from "sonner"
import { useNavigate } from "react-router"

interface ArchiveWalletDialogProps {
  walletId: string
  walletName: string
}

export const ArchiveWalletDialog = ({ walletId, walletName }: ArchiveWalletDialogProps) => {
  const navigate = useNavigate()

  const { mutate: archive, isPending } = useMutation({
    mutationFn: () => archiveWallet(walletId),
    onSuccess: () => {
      toast.success(`"${walletName}" archived`)
      navigate("/")
    },
    onError: () => toast.error("Failed to archive wallet"),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive wallet</AlertDialogTitle>
          <AlertDialogDescription>
            "{walletName}" will be hidden from your wallet list. All data is preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => archive()}
            disabled={isPending}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
