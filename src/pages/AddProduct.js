import React, { useState, useEffect, useRef, useContext } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Transition from "../utils/Transition";
import Sidebar from "../partials/Sidebar";
import Dropdown from "../partials/actions/Dropdown";
import { firebase } from "../initFirebase"
import { AuthContext } from "../context/auth";
import Header from "../partials/Header";
import mqtt from "mqtt";
import { withSnackbar } from "notistack";


function AddProduct({enqueueSnackbar}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shelves,setShelves] = useState({})
  const [itemName,setItemName] = useState("")
  const [itemWeight,setItemWeight] = useState(0)
  const [minQuantity,setMinQuantity] = useState('')
  const [location,setLocation] = useState("")
  const [shelveID,setShelveID] = useState()
  const [client, setClient] = useState()
  const [storeID, setStoreID] = useState(null)
  const [storeSlug, setStoreSlug] = useState('dummydata')
  const [stores, setStores] = useState([])
  const [userrole,setuserrole] = useState(null)
  const db = firebase.database()
  const {role,store} = useContext(AuthContext)

  const options = {
    defaultProtocol:'wss',
    // defaultProtocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
    // clientId uniquely identifies client
    // choose any string you wish
    clientId: 'b0908853',
    // port:8000,
    keepalive:60
  };

  useEffect(()=>{
    setuserrole(role)
  },[role])

  // useEffect(()=>{
  //   let url = window.location.protocol === 'https:' ? 'wss://15.206.66.251:8084/mqtt' : 'ws://15.206.66.251:8083/mqtt'
  //   let instance = mqtt.connect('wss://15.206.66.251:8084/mqtt',options);
  //   console.log(instance)
  //   if(instance){
  //     instance.on('connect', () => {
  //       console.log('connected')
  //       setClient(instance)
  //     });

  //     instance.on('error', (err) => {
  //       console.error('Connection error: ', err);
  //       instance.end();
  //     });
  //   }
  // },[])
  

  // client.subscribe('admin/shelve1/');

  const clearData = () => {
    setItemName("")
    setItemWeight(0)
    setLocation("")
    setMinQuantity(null)
    setShelveID(null)
  }

  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push({
        "id":each,
        "name":each,
        "data":data[each]
      })
    })
    // console.log(result)
    setShelves(result)
  }

  const getShelveData = () => {
    const response = db.ref('dummydata/smart-shelves')
    response.once('value',(snapshot)=>{
        if(snapshot.val()){
          transformData(snapshot.val())
        }
        else{
          setShelves([])
        }
    })

  }

  useEffect(()=>{
    const response = db.ref('dummydata/smart-shelves/'+shelveID)
    response.once('value',(snapshot)=>{
        console.log('shelve data------',shelveID)
        console.log(snapshot.val())
    })

  },[shelveID])

  const addProduct = () => {
    try{
        const product = {
            itemID:itemName,
            netItemWeight:itemWeight,
            location,
            minQuantity:minQuantity?minQuantity:0,
            status:'active',
            totalPickup:0,
            totalPlaced:0,
            totalQty:0
        }
        console.log('shelve ID',shelveID)
        db.ref('dummydata/smart-shelves/'+shelveID).update(product)
        // alert('Product Added successfully!')
        enqueueSnackbar("Product Added successfully!",{variant:"success"})
        clearData()
    }
    catch(error){
      enqueueSnackbar(error.message,{variant:"error"})
    }
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if(!itemName){
      enqueueSnackbar("Please Enter Item Name",{variant:"warning"})
    }
    else if(!itemWeight){
      enqueueSnackbar("Please Enter Item Weight",{variant:"warning"})
    }
    else if(!shelveID){
      enqueueSnackbar("Please Select Shelve",{variant:"warning"})
    }
    else if(!location){
      enqueueSnackbar("Please Enter Location",{variant:"warning"})
    }
    else{
      addProduct()
    }
  }

  const handleShelveClick = (id,e) => {
    e.preventDefault()
    // console.log('selected',id)
    setShelveID(id)
    setDropdownOpen(!dropdownOpen)
  }

  const handleClick = (e) => {
    e.preventDefault()
    setDropdownOpen(!dropdownOpen)
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
    // setIsLoading(true)
    // fetchShelfData()
    getShelveData()
    if(['superadmin','admin'].includes(role) ){
      console.log(role)
      getStores()
    }
    if(store){
      setStoreID(store)
    }
    // setIsLoading(false)
  },[])

  // useEffect(()=>{
  //   fetchShelfData() 
  // },[storeSlug])

  const passToMQTT = (e) => {
    e.preventDefault()
    const product = {
      itemID:itemName,
      netItemWeight:itemWeight,
      location,
      shelveID
    }
    console.log(client)
    console.log('publishing..')
    console.log(product)
    client.publish('admin/shelve1/',JSON.stringify(product),error => {
      if (error) {
        console.log('Publish error: ', error);
      }
    });
    // subscribe({topic:"admin/shelve1/"},{payload:product})

  }

  // useEffect(() => {
  //   // if (client) {
  //     console.log(client)
  //     // client.on('connect', () => {
  //     //   console.log('connected')
  //     //   // setConnected(!connected)
  //     //   // client.publish('admin/shelve1/',"Hello 123")
  //     // });

  //     client.on('connect', () => {
  //       console.log('connected')
  //       // setClient(instance)
  //     });
  //     client.on('error', (err) => {
  //       console.error('Connection error: ', err);
  //       client.end();
  //     });
  //     client.on('reconnect', () => {
  //       console.log('reconnecting')
  //     });
  //     client.on('message', (topic, message) => {
  //       const payload = { topic, message: message.toString() };
        
  //     });
  //   // }
  // }, [client]);


  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar */}
      {
        ['superadmin','admin'].includes(userrole) &&
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      }
      {/* Content area */}
      <div className=" flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main>
        {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} showSidebar={false} /> */}
          <div className="container mx-auto px-4 h-full mt-10">
            <div className="flex content-center justify-center h-full">
              <div className="w-full lg:w-6/12 md:w-8/12 sm:w-8/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                  
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-shelve"
                        >
                          Shelve ID
                        </label>
                        <div className="space-y-10 mb-4">
                          <div className="flex space-x-6">
                            <Dropdown 
                              className="w-screen"
                              data={shelves} 
                              placeholder='Select Shelve'
                              selected={shelveID}
                              setSelected={(id)=>setShelveID(id)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-item-name"
                        >
                          Store ID
                        </label>
                        
                        { role === 'superadmin' ?
                          <div className="space-y-10 mb-4">
                            <div className="flex space-x-6">
                              <Dropdown 
                                className="w-screen"
                                data={stores} 
                                placeholder='Select Store'
                                selected={storeID}
                                setSelected={(id)=>handleStoreChange(id)}
                              />
                            </div>
                          </div>
                          :
                          <div className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 semibold text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full">
                            {store}
                          </div>
                        }
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-item-name"
                        >
                          Item Name
                        </label>
                        <input
                          type="text"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 semibold text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Item Name"
                          value={itemName}
                          onChange={(e)=>{setItemName(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-item-weight"
                        >
                          Item Weight (In Grams)
                        </label>
                        <input
                          type="number"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Item Weight"
                          value={itemWeight}
                          onChange={(e)=>{setItemWeight(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-location"
                        >
                          Minimum Quantity 
                        </label>
                        <input
                          type="number"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Min Quantity"
                          value={minQuantity}
                          onChange={(e)=>{setMinQuantity(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-location"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Item Location"
                          value={location}
                          onChange={(e)=>{setLocation(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="text-center mt-6">
                        <button 
                          onClick={handleAddProduct}
                          className="btn uppercase px-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-white focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer">
                            Add Product
                        </button> 
                      </div>
                    </form>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
      </main>
    </div>
    </div>
  );
}

export default withSnackbar(AddProduct)