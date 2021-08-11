import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DetailTable from '../partials/common/DetailTable';

import { firebase } from "../initFirebase";

function EntryAndExit() {
  const [entryData, setEntryData] = useState([])
  const [exitData, setExitData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const db = firebase.database()

  const getEntryData = () => {
    try{
      const ref  = db.ref('dummydata/entry-points')
      ref.on('value',(snapshot)=>{
        console.log('entry point data')
        console.log(snapshot.val())
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
        console.log('entry point data')
        console.log(snapshot.val())
        setExitData(snapshot.val())
      })
    }
    catch(err){
      alert(err.message)
    }
  }

  useEffect(()=>{
    getEntryData()
    getExitData()
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