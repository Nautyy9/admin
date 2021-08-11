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
    // setCustomerData(result)
    computeExtraHeaders(result)
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
    setIsLoading(prev=>!prev)
  },[])

  const headers = {
    "User ID":"userID",
    "Cart ID":"cartID",
    "In Time":"inTime",
    "Out Time":"outTime",
    // "Total Items":"itemsInCart",
    "Total Quantity":"totalQty",
    "Total Price":"totalPrice"
    // "Total Pickup":"totalPickup",
    // "Total Placed":"totalPlaced",
    // "Total Quantity":"totalQty",
    // "Total Weight":"totalWeight"
  }


  // to compute total quantity and price for every customer
  const computeExtraHeaders = (data) => {
    data.map(each=>{
      let detail = each.data.orders.reduce((acc,order)=>{
        acc['total'] += order.itemPrice * order.quantity
        acc['quantity'] += order.quantity
        return acc
      },{'total':0,'quantity':0})
      console.log(detail)
      each.data['totalPrice'] = detail['total']
      each.data['totalQty'] = detail['quantity']
    })
    console.log('res')
    console.log(data)
    setCustomerData(data)
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
                  hasActions={true}
                  showOrderTotal={true}
                  action_header={"Items In Cart"}
                />
              </div>
            </div>
        </main>

      </div>
    </div>
  );
}

export default Customer;