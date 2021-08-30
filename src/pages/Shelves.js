import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import Dropdown from '../partials/actions/Dropdown';

import { ShelfAPI } from "../api/shelfApi";

import { firebase } from "../initFirebase"
import { AuthContext } from '../context/auth';

const db = firebase.database()

function Shelves() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ShelfData, setShelfData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [storeID, setStoreID] = useState(null)
  const [stores, setStores] = useState([])
  const {role,store} = useContext(AuthContext)

  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push({
        "id":each,
        "data":data[each]
      })
    })
    // console.log(result)
    setShelfData(result)
  }

  const fetchShelfData = () => {
    const shelfCollection = 'dummydata/smart-shelves';
    try {
      const ref = db.ref(shelfCollection);
      const users = [];
      ref.on('value',(snapshot)=>{
          // console.log('snapshot',snapshot.val())
          // users.push()
          transformData(snapshot.val())
      })
      
    } catch (error) {
        console.log('error-error')
    }
  }

  const getStores = () => {
    const ref = db.ref('stores')
    ref.once('value',(snapshot)=>{
      let data = snapshot.val()
      setStores(data)
    })
  }

  useEffect(()=>{
    setIsLoading(true)
    fetchShelfData()
    if(['superadmin','admin'].includes(role) ){
      getStores()
    }
    if(store){
      setStoreID(store)
    }
    setIsLoading(false)
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

            { role === 'superadmin' &&
              <div className="space-y-10 mb-4">
                <div className="flex space-x-6">
                  <Dropdown 
                    data={stores} 
                    placeholder='Select Store'
                    selected={storeID}
                    setSelected={(id)=>setStoreID(id)}
                  />
                </div>
              </div>
            }

            {/* Cards */}
            <div>
              <DashboardCard07 
                label="Shelf Details"
                headers={headers}
                data={ShelfData}
                isLoading={isLoading}
              />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Shelves;