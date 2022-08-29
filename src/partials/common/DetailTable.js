import React, {  useEffect, useState } from 'react';
import Loader from '../../utils/Loader';
import {FaPlus} from 'react-icons/fa'
import TableInput from './TableInput';
import { firebase } from "../../initFirebase"
const db = firebase.database();
 // <-- import styles to be used


function DetailTable({label,headers,data,isLoading , id  ,detailOpen, setDetailOpen, detailContent}) {

const [values, setValues] = useState([]);
const [check, setCheck] = useState(false);
const [index, setIndex] = useState(0)


useEffect(() =>{
  setValues(data)
}, [data])

const removeHandler = (data, id,e) => {
  e.preventDefault();
  alert('Data updated successfully')
  setDetailOpen(false)
  db.ref(`/dummydata/customers/${data.id}/orders/${id}/`).remove()
     
}

const addHandler= (id) =>{
  setIndex(id)
  setValues([...values,{id : id,itemID: '',itemPrice :'', quantity: '', }])
  setCheck(true);
}

  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-gray-200">
      <header className="flex items-center justify-between  px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">{label}</h2>
        <button type='button' className='p-1 m-1 animate-pulse btn-sm rounded-2xl btn hover:bg-white ease  bg-white shadow-none text-red-500 border-none ' onClick={() => setDetailOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>  
      </header>
      {
        isLoading &&
        <Loader/>
      }
      <div className="p-3">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full overflow-hidden">
           {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 bg-gray-50 rounded-sm">
              <tr>
                {
                  Object.keys(headers).map(header=>(
              
                    <th className="p-1" key={header}>
                      <div  className="font-semibold text-center">{header}</div>
                    </th>
                  ))
                }
                <th>
                   {check? 'Submit' : "Remove Item"}
                </th>
                <th>
                   {!check? 'Add/Edit Item' : ''}
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm  font-medium divide-y divide-gray-100">
              {/* Row */}
               { 
                !check && data.map((result,index)=>(
                  
                  <>
                  <tr key={index} className="text-center text-gray-800">

                    {
                      <td>{result.id}</td>
                    }
                    {
                      <td>{result.itemID}</td>
                    }
                    {
                      <td>{result.quantity}</td>
                    }
                    {
                      <td>{result.itemPrice}</td>
                    }
                    {
                      <td className=' '>
                        <button type='button' className='p-1 m-1 btn-sm rounded-2xl bg-red-600 btn hover:bg-white hover:text-red-500 border-none text-white' onClick={(e)=>removeHandler(id, result.id,e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>  
                      </td>
                    }
                    {
                    <td className=' '>
                        <button type='button' className='btn-circle  hover:text-success m-1 text-center btn-sm rounded-2xl hover:bg-white btn btn-success border-none text-white' onClick={ () => addHandler(data.length)}>
                        <span className=" hover:text-success"><FaPlus size={16}/></span>
                        </button>  
                      </td>
                    }
                  </tr>
                  </>
                ))
              }
              {check  ? <TableInput index={index} detailOpen={detailOpen} setDetailOpen={setDetailOpen} detailContent={detailContent} values={values} setCheck={setCheck} setValues={setValues} data ={data} check={check}  id={id}/>  : ''}
              
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
// {
//   Object.keys(headers).map(column=>( 
//     {/* console.log("headers",result), */},
    
//     <td className="" key={column}>
//     { console.log('xyz',result)}
//       <div className="text-center text-gray-800">{result[headers[column]]}
//       </div>
//     </td> 
   
//   ))
// }