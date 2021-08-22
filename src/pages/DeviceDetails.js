import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

import { firebase } from "../initFirebase";
import CheckBoxTable from '../partials/common/CheckBoxTable';
import Dropdown from '../partials/actions/Dropdown';
import Loader from '../utils/Loader';

function DeviceDetails() {
  const [storeID, setStoreID] = useState('')
  const [deviceType, setDeviceType] = useState('Shelve')
  const [index, setIndex] = useState('shelveID')
  const [loading, setLoading] = useState(false)
  const [headers, setHeaders] = useState({
    "Device ID":"shelveID",
    "Type":"type",
    "Status":"status"
  })
  const [deviceData, setDeviceData] = useState([])
  const [selectedDevice, setSelectedDevice] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    setSelectedDevice([])
    setLoading(false)
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
        setIndex('shelveID')
    }
    else if(deviceType === 'Exit'){
        device = 'exit-points'
        setHeaders(entry_exit_headers)
        setIndex('deviceID')
    }
    else if(deviceType === 'Entry'){
        device = 'entry-points'
        setHeaders(entry_exit_headers)
        setIndex('deviceID')
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
    setLoading(true)
    fetchData()
  },[deviceType,storeID])

  const addOrRemoveAllDevices = () => {
      let data = []
      if(selectedDevice.length === deviceData.length){
          setSelectedDevice(data)
      }
      else{
          for (let acc = 0; acc < deviceData.length; acc++) {
              const element = deviceData[acc];
              data.push(element[index])
          }
          setSelectedDevice(data)
      }
  }


  const onSelect = (id,event) => {
      console.log('passed id',id)
      if(!id){
          addOrRemoveAllDevices()
      }
      else{
        let data = [...selectedDevice]
        const item_index = data.indexOf(id);
        if (item_index > -1) {
            data.splice(item_index, 1);
        }
        else{
            data.push(id)
        }
        console.log(data)
        setSelectedDevice(data)
      }
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
              { loading ? 
                <Loader/>
                :
                <div className='flex flex-col'>
                    {
                        selectedDevice.length > 0 && 
                        <div className="flex justify-between items-center sm:font-sm col-span-full xl:col-span-8 mb-4 px-4 py-3 bg-white shadow-md rounded-sm border border-gray-200">
                            <div class="flex items-center justify-center bg-grey-lighter">
                                <label class="flex items-center space-x-4 px-3 py-1 bg-white text-indigo-500 rounded-lg shadow-lg tracking-wide  border border-indigo-500 cursor-pointer hover:bg-indigo-500 hover:text-white">
                                    <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    <span class="text-base leading-normal">Select a file</span>
                                    <input type='file' class="hidden" />
                                </label>
                            </div> 
                            <div className="text-center">
                                <button 
                                // onClick={handleAddProduct}
                                className="btn uppercase px-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-white focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer">
                                    Upload File
                                </button> 
                            </div>
                        </div>
                    }
                    <CheckBoxTable 
                        label="Device Details"
                        headers={headers}
                        data={deviceData}
                        isLoading={false}
                        id={index}
                        onSelection={onSelect}
                    />
                </div>
              }
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default DeviceDetails;