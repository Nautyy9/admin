import React,{useState} from "react"
import DashboardCard07 from "../partials/dashboard/DashboardCard07"

const ViewTeam = () => {
    return(
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Cards */}
            <div>
              <DashboardCard07 
                label="Team Details"
                headers={[]}
                data={[]}
                isLoading={false}
              />
            </div>

          </div>
    )
}

export default ViewTeam

