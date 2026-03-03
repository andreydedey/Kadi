import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const Categories = () => {
  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-medium">Categories</h1>
        <Button>Add Category</Button>
      </div>
      <Card>
        <CardContent className="flex justify-between px-6">
          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              Total Spent (all wallets)
            </span>
            <span className="text-xl font-semibold">1457.21 USD</span>
          </div>

          <div className="w-px h-16 bg-border self-center" />

          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              Total Spent (all wallets)
            </span>
            <span className="text-xl font-semibold">1457.21 USD</span>
          </div>

          <div className="w-px h-16 bg-border self-center" />

          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              Total Limit (all wallets)
            </span>
            <span className="text-xl font-semibold">1980 USD</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
