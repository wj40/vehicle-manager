import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { RecentVehiclesTable } from "@/components/recent-vehicles-table"
import {
  SidebarInset,

} from "@/components/ui/sidebar"
import { toast } from "sonner"

import { findAll } from "@/lib/api"
import { type Vehicle } from "@/types/vehicle"


export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    findAll()
      .then(setVehicles)
      .catch((error) => toast.error(error.message))
  }, [])


  const latestVehicles = [...vehicles].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
      <SidebarInset>
        <SiteHeader 
        title="Dashboard"
        />
        <div className="flex flex-1 flex-col min-h-0">
          <div className="@container/main flex flex-1 flex-col min-h-0">
            <div className="flex flex-col gap-4 py-2 md:py-4 flex-1 min-h-0">
              <div className="px-4 lg:px-6">
                <SectionCards vehicles={vehicles}/>
              </div>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive vehicles={vehicles}/>
              </div> 
              <div className="px-4 lg:px-6">
                <RecentVehiclesTable vehicles={latestVehicles}/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
  )
}
