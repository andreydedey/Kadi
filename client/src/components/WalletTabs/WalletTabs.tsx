import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons/faClockRotateLeft"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons/faClipboardList"
import { HistoryTab } from "./tabs/HistoryTab"

export const WalletTabs = () => {
  const tabs = [
    { title: "history", icon: faClockRotateLeft },
    { title: "report", icon: faGear },
    { title: "settings", icon: faClipboardList },
  ]

  return (
    <Tabs className="flex flex-3 flex-col gap-6" defaultValue="history">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Inter (USD)</h1>
        <TabsList className="bg-transparent space-x-1">
          {tabs.map((tab) => (
            <TabsTrigger
              value={tab.title}
              className="hover:bg-primary-foreground aspect-square rounded-full p-2 border-none"
            >
              <FontAwesomeIcon className="text-lg" icon={tab.icon} />
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="history">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  )
}
