import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <Button className="cursor-pointer">Add Wallet</Button>
      </div>
    </>
  );
};
