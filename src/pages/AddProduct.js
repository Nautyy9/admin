import React, { useState, useEffect, useContext } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { firebase } from "../initFirebase"
import { AuthContext } from "../context/auth";
import Header from "../partials/Header";

function AddProduct({history}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemName,setItemName] = useState("")
  const [itemWeight,setItemWeight] = useState(0)
  const [location,setLocation] = useState("")
  const db = firebase.firestore()

  const addProduct = async () => {
    try{
        const product = {
            itemName,
            itemWeight,
            location
        }
        const data = {}
        data[itemName] = product
        await db.collection('products').doc(location).set(data,{merge:true})
        console.log('Product Added successfully!')
    }
    catch(error){
        console.log(error)
    }
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    if(itemName && itemWeight && location) {
      addProduct()
    }
    else{
        alert('Please add details')
    }
  }


  return (
    <>
      <main>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} showSidebar={false} />
          <div className="container mx-auto px-4 h-full mt-10">
            <div className="flex content-center justify-center h-full">
              <div className="w-full lg:w-6/12 md:w-8/12 sm:w-8/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                  
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-item-name"
                        >
                          Item Name
                        </label>
                        <input
                          type="text"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 semibold text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Item Name"
                          value={itemName}
                          onChange={(e)=>{setItemName(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-item-weight"
                        >
                          Item Weight (In Grams)
                        </label>
                        <input
                          type="number"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Item Weight"
                          value={itemWeight}
                          onChange={(e)=>{setItemWeight(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-location"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Item Location"
                          value={location}
                          onChange={(e)=>{setLocation(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="text-center mt-6">
                        <button 
                          onClick={handleAddUser}
                          className="btn uppercase px-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-white focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer">
                            Add Product
                        </button> 
                      </div>
                    </form>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
      </main>
    </>
  );
}

export default withRouter(AddProduct)