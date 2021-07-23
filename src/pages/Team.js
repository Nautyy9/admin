import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import ViewTeam from './ViewTeam';
import AddTeam from './AddTeam';

const Team = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selected, setSelected] = useState('view')

    return (
        <div className="flex h-screen overflow-hidden">
    
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    
            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
    
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 m-2">
                        <button 
                            onClick={()=>{setSelected('view')}}
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-60" disabled={selected === "view"}>
                            <span className="hidden xs:block ml-2">View Team</span>
                        </button>  
                        <button 
                            onClick={()=>{setSelected('add')}}
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-60" disabled={selected === "add"}>
                            <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                            </svg>
                            <span className="hidden xs:block ml-2">Add Team</span>
                        </button>  
                    </div>
                        {
                            selected === "view" ?
                            <ViewTeam/>
                            :
                            <AddTeam/>
                        }
                </main>
            </div>
        </div>
    )
}

export default Team