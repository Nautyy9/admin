import React, { useState, useEffect, useRef } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Transition from "../utils/Transition";
import { firebase } from "../initFirebase"
import { AuthContext } from "../context/auth";
import Header from "../partials/Header";
import mqtt from "mqtt";


function AddProduct({history}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shelves,setShelves] = useState({})
  const [itemName,setItemName] = useState("")
  const [itemWeight,setItemWeight] = useState(0)
  const [location,setLocation] = useState("")
  const [shelveID,setShelveID] = useState()
  const [client, setClient] = useState()
  const db = firebase.database()
  const dropdown = useRef(null);
  const trigger = useRef(null);

  console.log('in the product')

  const options = {
    protocol: 'ws',
    // clientId uniquely identifies client
    // choose any string you wish
    // clientId: 'b0908853',
    // port:8000,
    // keepalive:60
  };

  useEffect(()=>{
    let instance = mqtt.connect('ws://15.206.66.251:8083/mqtt');
    if(instance){
      instance.on('connect', () => {
        console.log('connected')
        setClient(instance)
      });
    }
  },[])
  

  // client.subscribe('admin/shelve1/');

  useEffect(()=>{
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  })

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push({
        "id":each,
        "data":data[each]
      })
    })
    console.log(result)
    setShelves(result)
  }

  const getShelveData = () => {
    const response = db.ref('dummydata/smart-shelves')
    response.once('value',(snapshot)=>{
        transformData(snapshot.val())
    })

  }

  useEffect(()=>{
    getShelveData()
  },[])

  const addProduct = async () => {
    try{
        const product = {
            itemID:itemName,
            netItemWeight:itemWeight,
            location
        }
        db.ref('dummydata/smart-shelves/'+shelveID).update(product)
        console.log('Product Added successfully!')
    }
    catch(error){
        console.log(error)
    }
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    if(itemName && itemWeight && location && shelveID) {
      addProduct()
    }
    else{
        alert('Please add details')
    }
  }

  const handleShelveClick = (id,e) => {
    e.preventDefault()
    console.log('selected',id)
    setShelveID(id)
    setDropdownOpen(!dropdownOpen)
  }

  const handleClick = (e) => {
    e.preventDefault()
    setDropdownOpen(!dropdownOpen)
  }

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

  useEffect(() => {
    if (client) {
      console.log(client)
      // client.on('connect', () => {
      //   console.log('connected')
      //   // setConnected(!connected)
      //   // client.publish('admin/shelve1/',"Hello 123")
      // });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        console.log('reconnecting')
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        
      });
    }
  }, [client]);


  return (
    <>
      <main>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} showSidebar={false} />
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

                        <div
                          ref={trigger}
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 semibold text-gray-700 bg-white rounded text-sm shadow outline w-full"
                          aria-haspopup="true"
                          onClick={handleClick}
                          aria-expanded={dropdownOpen}
                        >
                          { shelveID ? shelveID: 'Select Shelve'}
                        </div>
                        <Transition
                          className="origin-top-right z-10 absolute top-full right-0 w-full bg-white border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                          show={dropdownOpen}
                          enter="transition ease-out duration-200 transform"
                          enterStart="opacity-0 -translate-y-2"
                          enterEnd="opacity-100 translate-y-0"
                          leave="transition ease-out duration-200"
                          leaveStart="opacity-100"
                          leaveEnd="opacity-0"
                        >
                          <div
                            ref={dropdown}
                            onFocus={() => setDropdownOpen(true)}
                            onBlur={() => setDropdownOpen(false)}
                          >
                            <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200">
                              {
                                shelves && shelves.length > 0 ?
                                shelves.map(shelve=>(
                                  <div key={shelve.id} className="font-medium text-gray-800 py-1  hover:bg-indigo-400 hover:text-white cursor-pointer" onClick={(event)=>handleShelveClick(shelve.id,event)}>
                                    {shelve.id}
                                  </div>
                                ))
                                :
                                <div key="no-data" className="font-medium text-gray-800 py-1">No Data Found</div>
                                  
                              }
                            </div>
                          </div>
                        </Transition>
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
                          onClick={passToMQTT}
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
    </>
  );
}

export default withRouter(AddProduct)