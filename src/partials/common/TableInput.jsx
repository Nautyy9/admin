import React,{useEffect, useState} from 'react'
import {FaTelegramPlane} from 'react-icons/fa'
import {AiOutlineMinus} from 'react-icons/ai'
import {BiArrowBack} from 'react-icons/bi'
import mqtt, { log } from 'mqtt/dist/mqtt'
import { firebase } from "../../initFirebase"

const host = '15.207.222.251';
var port = 8083;
var client;
var token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2JpbGUiOjg4MDAzNTA5NjEsInVzZXJfaWQiOiI2MmY3MzU4ZjQ0NzgwY2JhNTE0MzMzYTgiLCJuYW1lIjoiTmVlcmFqIiwidXNlcl90eXBlIjoiSVQiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjYwMzY4OTkzLCJleHAiOjE2NjI5NjA5OTMsImp0aSI6Ijg1MzUyMWEzLTJhZGMtNGZhYy04NTZiLTliNDQ2NmIwYWNlMSJ9.Jwx36CATTla59t6QFz2u-97Z8welBZe3Ci3DOJzeQPY'

const db = firebase.database();

function TableInput( { writeData,index, setCheck, id, setValues, values , detailOpen, setDetailOpen, detailContent}) {
  
  const [button, setButton] = useState(false)
  // console.log(values)

  //  useEffect(() => {
  //   const clickHandler = ({ target }) => {
  //    if (!detailOpen || detailContent.current.contains(target)) 
  //    {return setDetailOpen(true)};
     
  //  };
  //   document.addEventListener('click', clickHandler);
  //   return () => document.removeEventListener('click', clickHandler);
  // },[detailContent, detailOpen]);

useEffect(() => {
  console.log(writeData);
  const keyHandler = ({ keyCode }) => {
    if (!detailOpen || keyCode !== 27) return;
    setDetailOpen(false);
    console.log(values)
  };
  document.addEventListener('keydown', keyHandler);
  return () => document.removeEventListener('keydown', keyHandler);
});

function onConnect() {
  
  console.log("Connected");
  // client.subscribe("admin/cartv1/48b02d5f84a6/added_weight");
  // client.subscribe("mytopic");
  client.subscribe("admin/cartv1/48b02d5f84a6/addFromAdmin");
  const data =  JSON.stringify(Object.assign({}, values))
  // client.subscribe("admin/cartv1/48b02d5f84a6/na");
  // client.subscribe("admin/cartv1/48b02d5f84a6/r_label");
  // client.subscribe("admin/cartv1/isstable");
  // client.subscribe("admin/cartv1/notstable");
  client.publish("admin/cartv1/48b02d5f84a6/addFromAdmin",`${data}`); 
  //set.send("admin/cartv1/token", localStorage.getItem("UserToken"), 0, false)
  }
  function onFailure() {
    console.log("Connection Attempt to Host " + host + "Failed");
    setTimeout (MQTTConnect,reconnectTimeout);
  } 
  function reconnectTimeout () {
    console.log('Connection Lost');
    MQTTConnect()
  }

function MQTTConnect () {
  var x = Math.floor(Math.random() * 10000);
  var cname = "CartID -" + x;
     
  var options = {
    clientId: cname,
    reconnect : true, 
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure,
  };
  client = mqtt.connect(`mqtt://${host}:${port}/mqtt`,options);

  client.on('connect', () =>{
    onConnect();
  })
  
  
}

useEffect(() => {
  MQTTConnect();
  return () => {
    MQTTConnect();
  }
},[])

 const goBack =(e) =>{
  // if(index )
    values.pop()
    e.preventDefault();
    setCheck(false)
    setDetailOpen(true)
  
 }

 const goBackFromNegate = (e) =>{
  e.preventDefault()
  setCheck(false)
  setDetailOpen(true)
 }

  const submitHandler =(e, index ,length) =>{
        e.preventDefault();
        
        if( values[index].itemID !== ''  && values[index].itemPrice !== ''  && values[index].quantity !== '') 
        {
         if( values[length-1].itemID !== ''  && values[length-1].itemPrice !== ''  && values[length-1].quantity !== '') {
          db.ref(`/dummydata/customers/${id.id}/orders/`).update(values);
          alert('Data added successfully')
          setDetailOpen(false)
          setCheck(false);
          onConnect();
         }
         else {
          alert('fill values');
          
        console.log(values);}
        }
        else if(values[index].itemID === ''  && values[index].itemPrice === ''  && values[index].quantity === '') 
        {alert('fields are empty')
         
      }
      else{alert('fill in the required fields')}
      }
      // const changeThis1=(e, key) =>{
      //   e.preventDefault();
      //   const data = [...values]
      //   data[key][e.target.name] = parseInt(e.target.value)
       
      //   setValues(data);
      // }
      const changeThis2=(e, key) =>{
        e.preventDefault();
        const data = [...values]
        data[key][e.target.name] = e.target.value
        setValues(data);
      }
      const changeThis3=(e, key) =>{
        e.preventDefault();
        const data = [...values]
        data[key][e.target.name] = parseInt(e.target.value)
        setValues(data);
      } 
      const changeThis4=(e, key) =>{
        e.preventDefault();
        const data = [...values]
        data[key][e.target.name] = parseInt(e.target.value)
        setValues(data);
      }
      const negateValues =(index, e) =>{
        e.preventDefault()
        const orders = [...values];
        if(orders[index].itemID === '' || orders[index].itemPrice === '' || orders[index].quantity === '' ) 
        { orders.splice(index, 1)
          setValues(orders)
          setButton(true)
        };
        console.log('maybe',values);

      }
   
  return (
    <>
    {
       values.map((result,index)=>(
        
        <tr key={index} className="text-center text-gray-800 ">
        {console.log(result)} 
            {/* <td>
              <input type='number' placeholder='id' value={result.id}  name='id' disabled className='tshadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' onChange={(e) => changeThis1(e, index)}/>
            </td> */}
            <td>
              <input type='text' placeholder="Item Name" value={result.itemID} name='itemID' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ' onChange={(e) => changeThis2(e, index)}/>
            </td>
            <td>
                <input type='number' placeholder='Quantity'  value={result.quantity} name='quantity' className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ' onChange={(e) => changeThis3(e, index)}/>
            </td>
            <td>
                <input type='number' placeholder='Price' name='itemPrice' value={result.itemPrice} className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ' onChange={(e) => changeThis4(e, index)}/>
            </td>
            <td>
                <button type='button' className='btn-circle  hover:text-gray-500 m-1 text-center btn-sm rounded-2xl hover:bg-white btn btn-gray-500 shadow-none border-none text-white' onClick={(e)=>negateValues( index, e)}>
                    <span className=" hover:text-gray-500"><AiOutlineMinus size={20}/></span>
                </button>  
            </td>
            <td>
                <button type='button' className='btn-circle  hover:text-primary m-1 text-center btn-sm rounded-2xl hover:bg-white btn btn-primary shadow-none border-none text-white' onClick={(e)=>submitHandler(e, index, values.length)}>
                    <span className=" hover:text-primary"><FaTelegramPlane size={16}/></span>
                </button>  
            </td>
          </tr>
      ))
      
      }
      {!button? <tr>
        <td>
                <button type=' button' id='val' className=' flex flex-col  ml-6 mt-2  hover:text-info  text-center btn-md w-full rounded-md hover:bg-white btn btn-info text-white' onClick={(e)=>goBack(e)}>
                    <span className=" "> <BiArrowBack size={26}/></span>GO Back
                </button>  
            </td>
      </tr>
      : <tr>
        <td>
                <button type=' button' id='val' className=' flex relative flex-col  mt-2  hover:text-info  text-center btn-md w-full rounded-lg hover:bg-white btn btn-info text-white' onClick={(e)=>goBackFromNegate(e)}>
                    <span className=" "> <BiArrowBack size={26}/></span>Go Back
                </button>  
            </td>
      </tr>}
      </>
  )
}

export default TableInput