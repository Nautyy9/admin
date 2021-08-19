import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';

function CheckBoxTable({label,headers,data,isLoading}) {


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
                  <th className="p-2">
                      <input type='checkbox' selected={false} />
                  </th>
                {
                  Object.keys(headers).map(header=>(
                    <th className="p-2" key={header}>
                      <div className="font-semibold text-left">{header}</div>
                    </th>
                  ))
                }
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100">
              {/* Row */}
              { 
                data && data.map((result,index)=>(
                  <tr key={index}>
                      <th className="p-2">
                        <input type='checkbox' selected={false} />
                    </th>
                    { 
                      Object.keys(headers).map(column=>(
                        <td className="p-2" key={column}>
                          <div className="text-gray-800">{result[headers[column]]}</div>
                        </td> 
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CheckBoxTable;
