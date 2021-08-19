import React, { useRef, useState, useEffect } from "react";
import { placeholderColor } from "tailwindcss/defaultTheme";
import Transition from "../../utils/Transition";

const Dropdown = ({data,selected,setSelected,placeholder}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdown = useRef(null);
    const trigger = useRef(null);

    useEffect(()=>{
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    })

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    const handleClick = (e) => {
        e.preventDefault()
        setDropdownOpen(true)
    }

    const handleSelect = (key) => {
        console.log(key)
        setSelected(key)
        setDropdownOpen(false)
    }

    return(
        <div className="flex flex-col mr-6 relative">
            <div
                ref={trigger}
                className="border-2 border-gray-300 px-3 py-3 placeholder-gray-400 font-semibold text-gray-500 bg-white rounded text-sm shadow outline"
                aria-haspopup="true"
                onClick={handleClick}
                aria-expanded={dropdownOpen}
            >
                <div className="flex justify-between space-x-3 items-center">
                    <div>{ selected ? selected: placeholder}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

            </div>
            <Transition
                className="absolute origin-top-right z-10 top-full w-full right-0 bg-white border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                show={dropdownOpen}
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                >
                <div className="pt-0.5 pb-2 mb-1 border-b border-gray-200">
                    {
                    data && data.length > 0 ?
                    data.map(row=>(
                        <div key={row.id} className="font-medium text-gray-800 py-1 px-3 hover:bg-indigo-400 hover:text-white cursor-pointer" onClick={()=>handleSelect(row.name)}>
                            {row.name}
                        </div>
                    ))
                    :
                    <div key="no-data" className="font-medium text-gray-800 py-1">No Data Found</div>
                        
                    }
                </div>
                </div>
            </Transition>
        </div>
    )
}

export default Dropdown