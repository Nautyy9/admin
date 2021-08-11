import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';
import DetailModal from '../common/DetailModal';

function DashboardCard07({label,headers,data,isLoading,hasActions,action_header}) {
  const [detailOpen, setdetailOpen] = useState(false)
  const [orders, setOrders] = useState({})

  useEffect(()=>{
    console.log('data',data)
  },[])

  const handleShowDetails = (customer,e) => {
    e.preventDefault();
    setOrders(customer.data.orders)
    setdetailOpen(true)
    console.log('orders',customer.data.orders)
  }

  const order_headers = {
    "Item":"itemID",
    "Quantity":"quantity",
    "Price":"itemPrice"
  }

  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-gray-200">
      <header className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">{label}</h2>
      </header>
      {
        isLoading &&
        <Loader/>
      }
      <div className="p-3">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 bg-gray-50 rounded-sm">
              <tr>
                {
                  Object.keys(headers).map(header=>(
                    <th className="p-2" key={header}>
                      <div className="font-semibold text-left">{header}</div>
                    </th>
                  ))
                }
                { hasActions &&
                  <th className="p-2" key='Action'>
                    <div className="font-semibold text-left">{action_header}</div>
                  </th>
                }
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100">
              {/* Row */}
              { 
                data && data.map((result,index)=>(
                  <tr key={index}>
                    { 
                      Object.keys(headers).map(column=>(
                        <td className="p-2" key={column}>
                          <div className="text-gray-800">{result.data[headers[column]]}</div>
                        </td> 
                      ))
                    }
                    { hasActions &&
                      <td>
                        <button 
                            onClick={(e)=>handleShowDetails(result,e)}
                            className="btn px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none">
                              View Details
                          </button> 
                      </td>
                    }
                  </tr>
                ))
              }
              
                {/* <td className="p-2">
                  <div className="text-center">2.4K</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">$3,877</div>
                </td>
                <td className="p-2">
                  <div className="text-center">267</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-light-blue-500">4.7%</div>
                </td> */}
              
            </tbody>
          </table>
          { orders &&
            <DetailModal setOpen={detailOpen} setClose={()=>setdetailOpen(false)} data={orders} headers={order_headers}/>
          }
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
