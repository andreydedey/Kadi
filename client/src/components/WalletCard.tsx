import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney } from "@/lib/utils"

interface WalletCardProps {
  title: string
  amount: number
  currency: string
}

export const WalletCard = ({ title, amount, currency }: WalletCardProps) => {
  return (
    <Card className="gap-1 border-none min-w-56">
      <CardHeader className="margin">
        <CardTitle className="font-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="font-medium text-xl">{formatMoney(amount, currency)}</CardContent>
    </Card>
  )
}
