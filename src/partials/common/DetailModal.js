import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../../utils/Transition.js';
import DashboardCard07 from '../dashboard/DashboardCard07.js';
import DetailTable from './DetailTable.js';

function DetailModal({setOpen,setClose,data,headers , removeHandler , orders, setOrders}) {

  const [detailOpen, setdetailOpen] = useState(false);
  
  const trigger = useRef(null);
  const detailContent = useRef(null);
  const searchInput = useRef(null);

  useEffect(()=>{
    if(setOpen){
        setdetailOpen(true)
    }
  },[setOpen])

  useEffect(()=>{
    if(!detailOpen){
        setClose()
    }
  },[detailOpen])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!detailOpen || detailContent.current.contains(target)) return;
      setdetailOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!detailOpen || keyCode !== 27) return;
      setdetailOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900 bg-opacity-30 z-50 transition-opacity"
        show={detailOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id="search-modal"
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={detailOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div className="bg-white overflow-auto max-w-2xl w-full max-h-full rounded shadow-lg" ref={detailContent}>
            {
                data && data.length > 0 ?
                <DetailTable label="Order Details" orders={orders} setOrders={setOrders} removeHandler={removeHandler} headers={headers} data={data} isLoading={false}/>
                :
                "No Data Found"
            }
        </div>
      </Transition>
    </div>
  )
}

export default DetailModal;