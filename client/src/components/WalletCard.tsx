import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WalletCardProps {
  title: string
  amount: number
}

export const WalletCard = ({ title, amount }: WalletCardProps) => {
  return (
    <Card className="gap-1 border-none min-w-">
      <CardHeader className="margin">
        <CardTitle className="font-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="font-medium text-xl">{amount} USD</CardContent>
    </Card>
  )
}
