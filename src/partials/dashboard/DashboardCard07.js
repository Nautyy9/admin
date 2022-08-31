import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';
import DetailModal from '../common/DetailModal';




function DashboardCard07({label,headers,data,isLoading,hasActions,action_header}) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [id, setId] = useState([]);

  const handleShowDetails = (customer,e) => {
    //console.log('orders',customer);
    e.preventDefault();
    if(customer.data.orders){
    setId(customer);
    setOrders(customer.data.orders)
    setDetailOpen(true)
    }
    else{
      alert('Your Cart is empty')
    }
  }


 

  


  const order_headers = {
    "ID": 'id',
    "Item":"itemID",
    "Quantity":"quantity",
    "Price":"itemPrice",
    
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
                  Object.keys(headers).map((header, index)=>(
                    <th className="p-2" key={index}>
                      <div className="font-semibold text-left">{header}</div>
                    </th>
                  ))
                }
                { hasActions &&
                  <th className="p-2" >
                    <div className="font-semibold text-left">{action_header}</div>
                  </th>
                }
                {
                  <th className="p-2" >
                    View Live Cam
                  </th>
                }
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100">
              {/* Row */}
              { 
                data && data.map((result,index)=>(
                  console.log(result, 'somsr'),
                  <tr key={index} className="text-gray-800">
                    
                    {
                      <td className='p-2'>{result.data['userID']}</td>
                    }
                    {
                      <td className='p-2'>{result.data['cartID']}</td>
                    }
                    {
                      <td className='p-2'>{result.data['inTime']}</td>
                    }
                    {
                      <td className='p-2'>{result.data['outTime']}</td>
                    }
                    {
                      <td className='p-2'>{result.data['status'] === 'Active'? ( 
                      <div className="indicator pl-4">
                        <span className="indicator-item badge badge-sm badge-success"></span>
                      </div> ) : result.data['status'] === 'Not-stable' ? ( 
                      <div className="indicator pl-4">
                        <span className="indicator-item badge badge-sm badge-error"></span>
                      </div> ) :(
                        <div className="pl-4 indicator">
                        <span className="indicator-item badge badge-stone-500 badge-sm"></span> 
                        
                      </div>
                      )}
                      </td>
                    }
                    {
                      <td className='p-2'>{result.data['totalQty']}</td>
                    }
                    {
                      <td className='p-2'>{result.data['totalPrice']}</td>
                    }
                    
                   
                    
                  
                    { hasActions &&
                      <td>
                        <button 
                            onClick={(e)=>handleShowDetails(result,e)}
                            className="btn px-1 py-1 bg-indigo-500 hover:bg-indigo-600 btn-md text-white focus:outline-none">
                              View Details
                          </button> 
                      </td>
                    }
                    {
                      <td className='p-2 text-center' >
                      <a 
                            href='http://192.168.1.123:6680/html/' alt='cam'
                            className="btn   pl-6 pr-6 text-center bg-red-500 transition ease-out duration-300  hover:animate-none animate-pulse   hover:bg-red-700 btn-md text-white focus:outline-none">
                              Live
                          </a> 
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
            <DetailModal setDetailOpen={setDetailOpen} detailOpen={detailOpen}  id={id} setOrders={setOrders} setOpen={detailOpen} setClose={()=>setDetailOpen(false)} data={orders} headers={order_headers}/>
          }
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
