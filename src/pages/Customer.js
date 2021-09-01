import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import Dropdown from '../partials/actions/Dropdown';

import { firebase } from "../initFirebase"
import { AuthContext } from '../context/auth';

const db = firebase.database()

function Customer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerData, setCustomerData] = useState([])
  const [storeID, setStoreID] = useState(null)
  const [storeSlug, setStoreSlug] = useState('dummydata')
  const [stores, setStores] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const {role,store} = useContext(AuthContext)

  const getStores = () => {
    const ref = db.ref('stores')
    ref.once('value',(snapshot)=>{
      let data = snapshot.val()
      setStores(data)
    })
  }

  const transformData = (data) =>{
    const result = []
    Object.keys(data).map(each=>{
      result.push({
        "id":each,
        "data":data[each]
      })
    })
    // console.log(result)
    // setCustomerData(result)
    computeExtraHeaders(result)
  }

  const fetchCustomerData = () => {
    const customerCollection = `${storeSlug}/customers`;
    try {
      const ref = db.ref(customerCollection);
      ref.on('value',(snapshot)=>{
          // console.log('snapshot',snapshot.val())
          // users.push()
          if(snapshot.val()){
            transformData(snapshot.val())
          }
          else{
            setCustomerData([])
          }
      })
      
    } catch (error) {
        console.log(error.message)
    }
  }

  useEffect(()=>{
    setIsLoading(true)
    if(['superadmin','admin'].includes(role) ){
      getStores()
    }
    setIsLoading(false)
  },[])

  useEffect(()=>{
    fetchCustomerData()
  },[storeSlug])

  const handleStoreChange = (name) => {
    const store = stores.find(each=> each.name === name.trim())
    if(store){
      // console.log(store)
      setStoreID(store.name)
      setStoreSlug(store.id)
    }
    else{
      alert('Something Went Wrong !')
    }
  }

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
      // console.log(detail)
      each.data['totalPrice'] = detail['total']
      each.data['totalQty'] = detail['quantity']
    })
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