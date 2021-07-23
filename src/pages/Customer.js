import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';

import { firebase } from "../initFirebase"

const db = firebase.database()

function Customer() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerData, setCustomerData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push({
        "id":each,
        "data":data[each]
      })
    })
    console.log(result)
    setIsLoading(prev=>!prev)
    setCustomerData(result)
  }

  const fetchCustomerData = () => {
    const customerCollection = 'dummydata/customers';
    try {
      const ref = db.ref(customerCollection);
      ref.on('value',(snapshot)=>{
          console.log('snapshot',snapshot.val())
          // users.push()
          transformData(snapshot.val())
      })
      
    } catch (error) {
        console.log(error.message)
    }
  }

  useEffect(()=>{
    setIsLoading(prev=>!prev)
    fetchCustomerData()
  },[])

  const headers = {
    "User ID":"userID",
    "In Time":"inTime",
    "Out Time":"outTime",
    "Items In Cart":"itemsInCart",
    "Quantity":"quantity",
    // "Total Pickup":"totalPickup",
    // "Total Placed":"totalPlaced",
    // "Total Quantity":"totalQty",
    // "Total Weight":"totalWeight"
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

              {/* Cards */}
              <div>
                <DashboardCard07 
                  label="Customer Details"
                  headers={headers}
                  data={customerData}
                  isLoading={isLoading}
                />
              </div>
            </div>
        </main>

      </div>
    </div>
  );
}

export default Customer;