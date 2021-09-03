import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DetailTable from '../partials/common/DetailTable';
import Dropdown from '../partials/actions/Dropdown';

import { firebase } from "../initFirebase";
import { AuthContext } from '../context/auth';

function EntryAndExit({enqueueSnackbar}) {
  const [entryData, setEntryData] = useState([])
  const [exitData, setExitData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [storeID, setStoreID] = useState(null)
  const [storeSlug, setStoreSlug] = useState('dummydata')
  const [stores, setStores] = useState([])
  const {role,store} = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const db = firebase.database()

  const getEntryData = () => {
    try{
      const ref  = db.ref(`${storeSlug}/exit-points`)
      ref.on('value',(snapshot)=>{
        if(snapshot.val()){
          setEntryData(snapshot.val())
        }
        else{
          setEntryData([])
        }
      })
    }
    catch(err){
      enqueueSnackbar(err.message,{variant:"error"})
    }
  }

  const getExitData = () => {
    try{
      const ref  = db.ref(`${storeSlug}/exit-points`)
      ref.on('value',(snapshot)=>{
        if(snapshot.val()){
          setExitData(snapshot.val())
        }
        else{
          setExitData([])
        }
      })
    }
    catch(err){
      enqueueSnackbar(err.message,{variant:"error"})
    }
  }

  const getStores = () => {
    const ref = db.ref('stores')
    ref.once('value',(snapshot)=>{
      let data = snapshot.val()
      setStores(data)
    })
  }

  const handleStoreChange = (name) => {
    const store = stores.find(each=> each.name === name.trim())
    if(store){
      // console.log(store)
      setStoreID(store.name)
      setStoreSlug(store.id)
    }
    else{
      enqueueSnackbar("Something Went Wrong !",{variant:"error"})
    }
  }

  useEffect(()=>{
    setIsLoading(true)
    getStores()
    setIsLoading(false)
  },[])

  useEffect(()=>{
    getEntryData()
    getExitData()
  },[storeSlug])

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
                    setSelected={(id)=>handleStoreChange(id)}
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
                isLoading={isLoading}
              />
              <DetailTable 
                label="Exit Point Details"
                headers={headers}
                data={exitData}
                isLoading={isLoading}
              />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default EntryAndExit;