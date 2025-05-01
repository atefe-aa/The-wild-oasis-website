"use client"; // Force the component to run on the client

import { useEffect, useState } from "react";
import { getCountries } from "@/app/_lib/data-service";

function SelectCountry({ defaultCountry, name, id, className }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";
  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {loading ? (
        <option disabled>Loading...</option>
      ) : (
        countries.map((c) => (
          <option key={c.name} value={`${c.name}%${c.flag}`}>
            {c.name}<span><img src={c.flag}/></span>
          </option>
        ))
      )}
    </select>
  );
}

export default SelectCountry;
