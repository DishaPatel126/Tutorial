import React from 'react'
import { useState, useEffect } from "react";


function Counter() {
    const [count, setCounter] = useState(0);

    return (
        <>
            <h1>Counter State Change: {count}</h1>
            <button onClick={()=> setCounter(count + 1)}>Increment</button>
            <button onClick={()=> setCounter(count - 1)}>Decrement</button>
        </>
    )
}

export default Counter;