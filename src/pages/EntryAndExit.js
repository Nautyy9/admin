import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DetailTable from '../partials/common/DetailTable';
import Dropdown from '../partials/actions/Dropdown';

import { firebase } from "../initFirebase";
import { AuthContext } from '../context/auth';

function EntryAndExit() {
  const [entryData, setEntryData] = useState([])
  const [exitData, setExitData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [storeID, setStoreID] = useState(null)
  const [stores, setStores] = useState([])
  const {role,store} = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const db = firebase.database()

  const getEntryData = () => {
    try{
      const ref  = db.ref('dummydata/entry-points')
      ref.on('value',(snapshot)=>{
        setEntryData(snapshot.val())
      })
    }
    catch(err){
      alert(err.message)
    }
  }

  const getExitData = () => {
    try{
      const ref  = db.ref('dummydata/exit-points')
      ref.on('value',(snapshot)=>{
        setExitData(snapshot.val())
      })
    }
    catch(err){
      alert(err.message)
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
    getEntryData()
    getExitData()
    getStores()
    setIsLoading(false)
  },[])

  const headers = {
    "Device ID":"deviceID",
    "Status":"status",
    "Last Scanned At":"lastScannedAt",
    "Last Scanned ID":"lastScannedID"
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
            <div className="space-y-10">
              <DetailTable 
                label="Entry Point Details"
                headers={headers}
                data={entryData}
                isLoading={false}
              />
              <DetailTable 
                label="Exit Point Details"
                headers={headers}
                data={exitData}
                isLoading={false}
              />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default EntryAndExit;