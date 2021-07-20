import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';

import { ShelfAPI } from "../api/shelfApi";

import { firebase } from "../initFirebase"

const db = firebase.database()

function Shelves() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ShelfData, setShelfData] = useState([])

  console.log('counter')

  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push({
        "id":each,
        "data":data[each]
      })
    })
    console.log(result)
    setShelfData(result)
  }

  const fetchShelfData = () => {
    const shelfCollection = 'dummydata/smart-shelves';
    try {
      const ref = db.ref(shelfCollection);
      const users = [];
      ref.on('value',(snapshot)=>{
          console.log('snapshot',snapshot.val())
          // users.push()
          transformData(snapshot.val())
      })
      
    } catch (error) {
        console.log('error-error')
    }
  }

  useEffect(()=>{
    fetchShelfData()
  },[])

  const headers = {
    "Shelve ID":"shelveID",
    "Item ID":"itemID",
    "Location":"location",
    "Status":"status",
    "Net Item Weight":"netItemWeight",
    "Total Pickup":"totalPickup",
    "Total Placed":"totalPlaced",
    "Total Quantity":"totalQty",
    "Total Weight":"totalWeight"
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
                label="Shelf Details"
                headers={headers}
                data={ShelfData}
              />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Shelves;