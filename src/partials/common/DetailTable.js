import React, {  useEffect, useMemo, useState } from 'react';
import Loader from '../../utils/Loader';
import {FaPlus} from 'react-icons/fa'
import TableInput from './TableInput';
import { firebase } from "../../initFirebase"
import { AiFillCodeSandboxSquare } from 'react-icons/ai';
import { write } from 'mqtt/dist/mqtt';
const db = firebase.database();
 // <-- import styles to be used

 var token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2JpbGUiOjg4MDAzNTA5NjEsInVzZXJfaWQiOiI2MmY3MzU4ZjQ0NzgwY2JhNTE0MzMzYTgiLCJuYW1lIjoiTmVlcmFqIiwidXNlcl90eXBlIjoiSVQiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjYwMzY4OTkzLCJleHAiOjE2NjI5NjA5OTMsImp0aSI6Ijg1MzUyMWEzLTJhZGMtNGZhYy04NTZiLTliNDQ2NmIwYWNlMSJ9.Jwx36CATTla59t6QFz2u-97Z8welBZe3Ci3DOJzeQPY'

function DetailTable({label,headers,data,isLoading , id  ,detailOpen, setDetailOpen, detailContent}) {

const [values, setValues] = useState([]);
const [check, setCheck] = useState(false);
const [index, setIndex] = useState(0)
const[apiData, setApiData] = useState()
const[something, setSomething] = useState(false)
const [writeData, setWriteData] = useState()

useEffect(() => {
  async function getData () {
    try{
    const response = await fetch(`http://api.djtretailers.com/collection/getsingleitem?search=barcode&value=${writeData? writeData: ''}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()
    // console.log('data from api',data);
    setApiData(data)
  }catch{
    alert('Fields are empty')
  }
  }
  getData();
  return () => {
    getData();
  }
}, [writeData])


useEffect(() =>{
  setValues(data);
 
  return() =>{
    setValues();
  }
}, [ data])

const getDataAfterRemove =(data, orders) =>{

  db.ref(`/dummydata/customers/${data.id}/orders`).set(orders);
  
} 


const removeHandler = (data, index, length ,e) => {
  e.preventDefault();
  const orders = [...values]
   orders.splice(index, 1);
  
  //  console.log(orders, 'splice');
  alert('Data updated successfully')
  db.ref(`/dummydata/customers/${data.id}/orders/${index}`).remove();
  setDetailOpen(false)
  getDataAfterRemove(data, orders)
}

const addInputs = (e) => {
  e.preventDefault()
  setSomething(true)
  if(writeData){
  setValues([...values,{itemID: apiData.data[0].name, itemPrice : apiData.data[0].warehouses[0].ASP, quantity: '', }]);
  setCheck(true)
  setWriteData('')
  }
  else{
    alert('input fields are empty')
  }
}

const addHandler= (id) =>{
  setIndex(id)
  setValues([...values,{itemID: '',itemPrice :'', quantity: '', }]);
  setCheck(true);
}

function changeInput(e) {
  e.preventDefault();
  setWriteData(e.target.value)
}

  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-gray-200">
      <header className="flex items-center justify-between   px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">{label  }</h2> 
        {!check && <><h4 className=' text-green-600  p-2 border-green-200 rounded-lg ' >{`Add Bar Code -->`}</h4>
          <input type='text' value={writeData} onChange={(e) => changeInput(e)}  className=' w-32 h-10'></input> 
          <button type='button' className='text-3xl mr-32 rounded-full border-black  text-green-900   ' onClick={(e) => addInputs(e)}>
           + </button>
        </>}
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
                    console.log(writeData)
                 }
                    <th className="p-1">
                      <div  className="font-semibold text-center">Item</div>
                    </th>
                    <th className="p-1">
                      <div  className="font-semibold text-center">Quantity</div>
                    </th> <th className="p-1">
                      <div  className="font-semibold text-center">Price</div>
                    </th> 
                
                <th keu='new'>
                   {check? 'Submit' : "Remove Item"}
                </th>
                <th key='another'>
                   {!check? 'Add/Edit Item' : ''}
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm  font-medium divide-y divide-gray-100">
              {/* Row */}
               { 
                !check && data.map((result,index)=>(
                  {/* console.log({result, index},'ksdh'), */},
                  <>
                  <tr key={index} className="text-center text-gray-800">
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
                      <td className=''>
                        {/* {console.log(result.id)} */}
                        <button type='button' className='p-1 m-1 btn-sm rounded-2xl bg-red-600 btn hover:bg-white hover:text-red-500 border-none text-white' onClick={(e)=>removeHandler(id, index, data.length ,e)}>
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
              {check && <TableInput writeData={writeData} index={index} addData={something} detailOpen={detailOpen} setDetailOpen={setDetailOpen} detailContent={detailContent} values={values} setCheck={setCheck} setValues={setValues} data ={data} check={check}  id={id}/>  }
              
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