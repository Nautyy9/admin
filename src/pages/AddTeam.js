import React, { useState, useEffect, useContext } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Dropdown from "../partials/actions/Dropdown";
import { firebase, secondaryFirebase } from "../initFirebase"
import { AuthContext } from "../context/auth";

function AddTeam({history}) {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [stores, setStores] = useState('')
  const [storeID, setStoreID] = useState('')
  const db = secondaryFirebase.firestore()
  const {role} = useContext(AuthContext)

  const addUser = async (role) => {
    try{
      if(role){
        const response = await secondaryFirebase.auth().createUserWithEmailAndPassword(email, password)
        await db.collection('users').doc(response.user.uid).set({role:role,store:storeID})
        console.log('User registered successfully!')
        console.log(response.user)
        secondaryFirebase.auth().signOut();
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    if(email && password && storeID) {
      let new_role;
      if(role === 'superadmin'){
        new_role = "admin"
      }
      else if(role === 'admin'){
        new_role = "staff"
      }
      addUser(new_role)
    }
  }

  const getStores = () => {
    const ref = firebase.database().ref('stores')
    ref.once('value',(snapshot)=>{
      let data = snapshot.val()
      setStores(data)
    })
  }

  useEffect(()=>{
    getStores()
  },[])


  return (
    <>
      <main>
          <div className="container mx-auto px-4 h-full mt-10">
            <div className="flex content-center justify-center h-full">
              <div className="w-full lg:w-6/12 sm:w-5/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                  
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 semibold text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Email"
                          value={email}
                          onChange={(e)=>{setEmail(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className="border-1 border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-indigo-600 w-full"
                          placeholder="Password"
                          value={password}
                          onChange={(e)=>{setPassword(e.target.value)}}
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Store
                        </label>
                        <Dropdown
                          className='mr-0'
                          data={stores}
                          placeholder='Select Store'
                          selected={storeID}
                          setSelected={(id)=>setStoreID(id)}
                        />
                      </div>

                      <div className="text-center mt-6">
                        <button 
                          onClick={handleAddUser}
                          className="btn uppercase px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-800">
                            Add
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

export default withRouter(AddTeam)