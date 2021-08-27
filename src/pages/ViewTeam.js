import React,{ useState,useEffect,useContext } from "react"

import { firebase } from "../initFirebase"
import { AuthContext } from "../context/auth"
import DetailTable from "../partials/common/DetailTable"
import Dropdown from "../partials/actions/Dropdown"

const ViewTeam = () => {
    const [users,setUsers] = useState([])
    const [stores, setStores] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [storeID,setStoreID] = useState(null)
    const {role,store,email} = useContext(AuthContext)
    const firestore = firebase.firestore()
    const db = firebase.database()

    const getTeamDetail = async () => {
      try{
        const users = await firestore.collection('users').get()
        let data = []
        users.docs.map(doc=>{
          if(doc.data().email !== email){
            data.push(doc.data())
          }      
        })
        // console.log(data)
        setUsers(data)
      }
      catch(error){
        alert(error.message)
      }  
    }

    const getStores = () => {
      // console.log('triggred')
      const ref = db.ref('stores')
      ref.once('value',(snapshot)=>{
        let data = snapshot.val()
        // console.log(data)
        setStores(data)
        // console.log(data)
        // if(data.length > 0 ){
        //     setStoreID(data[0].name)
        // }
      })
    }

    useEffect(()=>{
      // console.log(role)
      if(['superadmin','admin'].includes(role) ){
        getStores()
      }
      getTeamDetail()
      if(store){
        console.log(store)
        setStoreID(store)
      }
      
    },[])

    useEffect(()=>{
      let store_data = stores.find(store=>[store.name,store.id].includes(storeID))
      // console.log(store_data)
      if(store_data){
        let filtered_data = users.filter(user=>user.store === store_data.id)
        // console.log('filtered')
        // console.log(filtered_data)
        setFilteredUsers(filtered_data)
      }
    },[storeID])

    // const handleStoreChange = (name) => {
      
    // }

    const headers = {
      "Email ID":"email",
      "Role":"role",
      "Store":"store"
    }

    return(
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          { role === 'superadmin' &&
            <div className="space-y-10 mb-4">
              <div className="flex space-x-6">
                <Dropdown 
                  data={stores} 
                  placeholder='Select Store'
                  selected={storeID}
                  setSelected={(id)=>setStoreID(id)}
                />
              </div>
            </div>
          }
            {/* Cards */}
            <div>
              <DetailTable 
                label="Team Details"
                headers={headers}
                data={storeID ? filteredUsers : users}
                isLoading={false}
              />
            </div>

          </div>
    )
}

export default ViewTeam

