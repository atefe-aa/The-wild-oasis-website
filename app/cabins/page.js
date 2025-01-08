import Counter from "../_components/Counter";

export default async function page() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();

  return (
    <div>
      <h1>cabins</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <Counter />
    </div>
  );
}
