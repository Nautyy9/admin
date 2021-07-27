import React, { useState, useEffect, useContext } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { firebase } from "../initFirebase"
import { AuthContext } from "../context/auth";

function Login({history}) {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const firebaseLogin = async () => {
    try{
      const response = await firebase.auth().signInWithEmailAndPassword(email, password)
      console.log(response)
      history.push("/")
    }
    catch(error){
      console.error(error)
    }   
  }
 

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if(email && password){
      firebaseLogin()
    }
  }
  return (
    <>
      <main>
          <div className="container mx-auto px-4 h-screen">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-full lg:w-4/12 sm:w-6/12 px-4">
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

                      <div className="text-center mt-6">
                        <button 
                          onClick={handleLogin}
                          className="btn px-3 py-3 bg-indigo-500 hover:bg-indigo-600 text-white w-full focus:ring-indigo-800">
                            Log In
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

export default withRouter(Login)