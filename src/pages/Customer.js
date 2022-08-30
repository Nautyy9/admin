import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import Dropdown from '../partials/actions/Dropdown';

import { firebase } from "../initFirebase"
import { AuthContext } from '../context/auth';
import { withSnackbar } from 'notistack';

const db = firebase.database()

function Customer({enqueueSnackbar}) {
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
      // console.log(data);
      setStores(data)
    })
  }

  const transformData = (data) =>{
    const result = []
    console.log('data', data);
    Object.keys(data).map((each, index)=>{
      // console.log('watch ', each)
      // console.log(data[each] );
      //  removeHandler(each, index)
      // removeHandler(index)
     
      result.push({
        "id":each,
        "data":data[each]
      })
    })
    // console.log('check',result)
    
    // console.log(result[0].data.orders[0].itemID);
    // console.log(result[0].id)
    // setCustomerData(result)
    computeExtraHeaders(result)
    // removeHandler(result);
  }







  const fetchCustomerData = () => {
    const customerCollection = `${storeSlug}/customers`;
    try {
      const ref = db.ref(customerCollection);
      ref.on('value',(snapshot)=>{
          //console.log('snapshot',snapshot.val())
          // users.push()
          if(snapshot.val()){
            transformData(snapshot.val())
            // console.log(snapshot.val());
            
          }
          else{
            setCustomerData([])
          }
      })
      
    } catch (error) {
      enqueueSnackbar(error.message,{variant:"error"})
        // console.log(error.message)
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
    // console.log("hellloloo"+store)
    if(store){
      //  console.log(store)
      setStoreID(store.name)
      setStoreSlug(store.id)
      // console.log(store.id)
    }
    else{
      enqueueSnackbar("Something Went Wrong !",{variant:"error"})
    }
  }

  const headers = {
    "User ID":"userID",
    "Cart ID":"cartID",
    "In Time":"inTime",
    "Out Time":"outTime",
    "Status": "status",
    "Total Quantity":"totalQty",
    "Total Price":"totalPrice"
    // "Total Pickup":"totalPickup",
    // "Total Placed":"totalPlaced",
    // "Total Quantity":"totalQty",
    // "Total Weight":"totalWeight"
  }


  // to compute total quantity and price for every customer
  const computeExtraHeaders = (data) => {
    // console.log(data, 'values');
    data.map(each=>{
      
      if(each.data.orders){
        let detail = each.data.orders.reduce((acc,order)=>{
          acc['total'] += order.itemPrice * order.quantity
          acc['quantity'] += order.quantity
          return acc
        },{'total':0,'quantity':0})
        //  console.log(each.data)
        each.data['totalPrice'] = detail['total']
        each.data['totalQty'] = detail['quantity']
      }
      else{
        each.data['totalPrice'] = 0
        each.data['totalQty'] = 0
      }
    })
    //console.log(data, 'plus minyus');
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


export default withSnackbar(Customer);