import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export const Dashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <Button className="cursor-pointer">Add Wallet</Button>
      </div>
      <div className="flex space-x-5">
        <Card className="gap-1 border-none w-60">
          <CardHeader className="margin">
            <CardTitle className="font-light">Cash</CardTitle>
          </CardHeader>
          <CardContent className="font-medium text-xl">670 USD</CardContent>
        </Card>
        <Card className="gap-1 border-none w-60">
          <CardHeader className="margin">
            <CardTitle className="font-light">Revolut</CardTitle>
          </CardHeader>
          <CardContent className="font-medium text-xl">897.01 USD</CardContent>
        </Card>
        <Card className="gap-1 border-none w-60">
          <CardHeader className="margin">
            <CardTitle className="font-light">Bank of America</CardTitle>
          </CardHeader>
          <CardContent className="font-medium text-xl">
            45581.11 USD
          </CardContent>
        </Card>
      </div>
    </>
  );
};
