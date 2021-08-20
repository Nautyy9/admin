import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

import { firebase } from "../initFirebase";
import CheckBoxTable from '../partials/common/CheckBoxTable';
import Dropdown from '../partials/actions/Dropdown';

function DeviceDetails() {
  const [storeID, setStoreID] = useState('')
  const [deviceType, setDeviceType] = useState('Shelve')
  const [headers, setHeaders] = useState({
    "Device ID":"shelveID",
    "Type":"type",
    "Status":"status"
  })
  const [deviceData, setDeviceData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const db = firebase.database()


  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push(data[each])
    })
    computeExtraHeaders(result)
  }

  const computeExtraHeaders = (data) => {
    console.log(data)
    console.log(deviceType)
    data.map(each=>{
      each['type'] = deviceType
    })
    setDeviceData(data)
  }

  const fetchData = async () => {
    const ref = 'dummydata/'
    let device = 'smart-shelves'
    const entry_exit_headers = {
        "Device ID":"deviceID",
        "Type":"type",
        "Status":"status"
    }
    const shelve_header = {
        "Device ID":"shelveID",
        "Type":"type",
        "Status":"status"
    }
    if(deviceType === 'Shelve'){
        device = 'smart-shelves'
        setHeaders(shelve_header)
    }
    else if(deviceType === 'Exit'){
        device = 'exit-points'
        setHeaders(entry_exit_headers)
    }
    else if(deviceType === 'Entry'){
        device = 'entry-points'
        setHeaders(entry_exit_headers)
    }
    else{
        alert('No Matching Type Found')
        return 
    }
    let response = db.ref(`${ref}${device}`)
    response.once('value',(snapshot)=>{
        let data =  snapshot.val()
        console.log(data)
        if(deviceType === 'Shelve'){
            transformData(data)
        }
        else{
            computeExtraHeaders(data)
        }

    })
  }
 

  useEffect(()=>{
    console.log('device type',deviceType)
    console.log('store id',storeID)
    fetchData()
  },[deviceType,storeID])

  const onSelect = (id,event) => {
      console.log(id)
  }


  const store_data = [
    {
        id:1,
        name:'store-1'
    },
    {
        id:2,
        name:'store-2'
    },
    {
        id:3,
        name:'store-3'
    },
    {
        id:4,
        name:'store-4'
    },
  ]

  const device_types = [
      {
          id:1,
          name:'Shelve'
      },
      {
          id:2,
          name:'Entry'
      },
      {
          id:3,
          name:'Exit'
      }
  ]

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className=" flex flex-col flex-1 overflow-y-auto overflow-x-h
      idden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <div className="space-y-10">
              <div className="flex">
                <Dropdown 
                    data={store_data} 
                    placeholder='Select Store'
                    selected={storeID}
                    setSelected={(id)=>setStoreID(id)}
                    />
                <Dropdown 
                    data={device_types}
                    placeholder='Select Device Type'
                    selected={deviceType}
                    setSelected={(id)=>{setDeviceType(id)}}
                     />
            </div>

              <CheckBoxTable 
                label="Device Details"
                headers={headers}
                data={deviceData}
                isLoading={false}
                onSelection={onSelect}
              />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default DeviceDetails;