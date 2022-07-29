import { log } from '@craco/craco/lib/logger';
import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';

function DetailTable({label,headers,data,isLoading , removeHandler, orders, setOrders}) {



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
                    console.log(headers),
                    <th className="p-1" key={header}>
                      <div  className="font-semibold text-center">{header}</div>
                    </th>
                  ))
                }
                <th>
                   Remove Item
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm  font-medium divide-y divide-gray-100">
              {/* Row */}
              { 
                data && data.map((result,index)=>(
                  <tr key={index}>
                    { 
                      Object.keys(headers).map(column=>( 
                        
                        <td className="" key={column}>
                          <div className="text-center text-gray-800">{result[headers[column]]}
                       
                         
                          </div>
                        </td> 
                      ))
                    }
                    
                    <div className=' flex justify-center align-center'>
                    <button type='button' className='p-1 m-1 button bg-red-600 rounded-lg text-white' onClick={()=>removeHandler((orders.map((items,key) =>  items.id)))}>Remove</button>
                    </div>
                    
                    
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
        </div>
      </div>
    </div>
  );
}

export default DetailTable;
