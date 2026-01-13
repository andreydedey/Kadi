import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { WalletCard } from "@/components/WalletCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Dashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <Button className="cursor-pointer">Add Wallet</Button>
      </div>
      <div className="flex space-x-5 mb-6">
        <WalletCard title="Cash" amount={670.0} />
        <WalletCard title="Revolut" amount={897.01} />
        <WalletCard title="Bank of america" amount={4581.11} />
      </div>
      <div className="flex space-x-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm text-muted-foreground antialiased">
            Last Transactions
          </h3>
          <Card className="w-xs">
            <CardContent className="flex items-center gap-6">
              <div className="flex rounded-full h-3/4 aspect-square items-center justify-center bg-zinc-800">
                <FontAwesomeIcon
                  className="text-xs"
                  icon={faArrowRightArrowLeft}
                />
              </div>
              <div className="flex flex-col">
                <strong className="text-green-400">+38 USD</strong>
                <CardDescription>Transfer</CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm text-muted-foreground antialiased">
            Total Money
          </h3>
          <Card className="w-xs">
            <CardContent className="flex items-center gap-6">
              <div className="flex rounded-full h-3/4 aspect-square items-center justify-center bg-zinc-800">
                <FontAwesomeIcon
                  className="text-xs"
                  icon={faArrowRightArrowLeft}
                />
              </div>
              <div className="flex flex-col">
                <strong className="text-green-400">+38 USD</strong>
                <CardDescription>Transfer</CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
