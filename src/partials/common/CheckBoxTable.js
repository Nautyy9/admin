import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';

function CheckBoxTable({label,headers,data,isLoading, onSelection,id}) {
  const [mutatedData, setMutatedData] = useState([])

  useEffect(()=>{
    data.map(row=>{
        row['isChecked'] = false
    })
    setMutatedData(data)
  },[data])

  const selectAll = (event) => {
      const selected_all = event.target.checked
      let new_data = [...mutatedData]
      if(selected_all){
          new_data.map(row=>{
              row['isChecked'] = true
          })
      }
      else{
        new_data.map(row=>{
            row['isChecked'] = false
        })
      }
    console.log(new_data)
    setMutatedData(new_data)
    onSelection(null,event)
  }

  const handleSelect = (passed_id,event) => {
      const checked = event.target.checked
      let data = [...mutatedData]
      data.map(row=>{
          if(row[id]===passed_id){
              
              row.isChecked = checked
          }
      })
      setMutatedData(data)
      onSelection(passed_id,event)
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
            { mutatedData && mutatedData.length > 0 ?
                <table className="table-auto w-full">
                    {/* Table header */}
                    <thead className="text-xs uppercase text-gray-400 bg-gray-50 rounded-sm">
                    <tr>
                        <th className="p-2">
                            <input className="outline-none rounded text-indigo-500 focus:ring-2 focus:ring-indigo-500" 
                                type='checkbox' 
                                onChange={selectAll}/>
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
                        mutatedData && mutatedData.length > 0 &&
                            mutatedData.map((result,index)=>(
                                <tr key={index}>
                                    <th className="p-2">
                                        <input className="outline-none rounded text-indigo-500 focus:ring-2 focus:ring-indigo-500" 
                                            type='checkbox' 
                                            checked={result.isChecked ? true : false} 
                                            onChange={(event)=>handleSelect(result[id],event)} />
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
                :
                <div>No Data Available</div>
            }
        </div>
      </div>
    </div>
  );
}

export default CheckBoxTable;
