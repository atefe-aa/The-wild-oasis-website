'use client';

import { useEffect, useState } from "react";
import { getFormFieldsByTopicId } from "@/app/_lib/data-service";

export default function Page() {
  
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function fetchData() {
          try {
            const response = await getFormFieldsByTopicId();
            if (response?.result) {
              setData(response.result);
            } else {
              setError('Invalid response format');
            }
          } catch (error) {
            setError(error.message);
            console.error("Error fetching data:", error);
          }
        }
        fetchData();
      }, []);
    
      if (error) return <p>Error: {error}</p>;
      if (!data) return <p>Loading...</p>;
    
    return (
        <div className="max-w-6xl mx-auto mt-8">
            {Object.values(data).map((group, index) => (
                <div key={index}>
                    {group.map((field, i) => (
                        <div key={i}>{field.name} : {field.value}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}
