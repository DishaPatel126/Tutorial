import React from "react";
import { useState, useEffect } from "react";

type Product = {
    id: number;
    title: String;
}

function ProductDummy() {
    const [data, setData] = useState<Product[]>([]);
    
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/todos").then((res) => res.json()).then((data) => setData(data)).then((err) => console.error("Fetch error", err));
    });

    return (
        <>
            {
                data.map((item)=>{
                    <p key={item.id}> {item.title}</p>
                })
            }
        </>

    )
}

export default ProductDummy