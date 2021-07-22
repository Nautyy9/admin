const Loader = () => {
    let circleCommonClasses = 'h-4 w-4 bg-indigo-400   rounded-full';

    return (
        <div className='flex h-screen items-center justify-center'>
            <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
            <div
                className={`${circleCommonClasses} mr-1 animate-bounce200`}
            ></div>
            <div className={`${circleCommonClasses} animate-bounce400`}></div>
        </div>
    );
};

export default Loader;