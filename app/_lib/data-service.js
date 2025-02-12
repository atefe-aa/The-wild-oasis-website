import { eachDayOfInterval } from "date-fns";
import { notFound } from "next/navigation";


const BASE_URL = process.env.API_URL;
/////////////
// GET

export async function getCabin(id) {
  try {
    const res = await fetch(`${BASE_URL}/cabins/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.log("Triggering notFound for invalid response");
      notFound();
    }

    const { data, error } = await res.json();

    if (error) {
      console.error(error);
    }

    return data;
  } catch (error) {
    console.error("Error fetching cabin:", error);
    notFound(); // Optionally handle server errors
  }
}


export async function getCabinPrice(id) {
  const res = await fetch(`${BASE_URL}/cabins/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const { data, error } = await res.json();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const res = await fetch(`${BASE_URL}/cabins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const { data, error } = await res.json();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}


export const getFormFieldsByTopicId = async ()=> {
  // await getCsrfToken(); 
  const url = `https://homa.api.demo.khateroshan.com/api/v1/fields/10`;
  // const url = `http://homa.local/api/v1/fields/10`;
  const body = JSON.stringify({
    company_id: 1,
    subscribe_id:1
  });
  console.log('get form fields');

  return await apiRequest(url, {
    method: 'POST',
    cache: 'force-cache',
    body,
  });
};

// const getCsrfToken = async () => {
//   await fetch('http://homa.local/sanctum/csrf-cookie', {
//     credentials: 'include',
//     mode: 'cors',
//   });
// };

const apiRequest = async (url, options) => {
  const headers = {
    Authorization: 'Bearer 14|nweTAuQKwdsVJQGIWurGNyyPzDIEJTqb2pms74Gc',
    // Authorization: 'Bearer 11|oU4RG6EBgrdjdeioRGRF7DeUzP0RP0ufa4Cq1Rcr',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest',
    ...options?.headers,
  };

  try {
    const response = await fetch(url, { 
      ...options, 
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
