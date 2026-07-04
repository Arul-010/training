import React, { useState, useEffect } from "react";

const Fetching = () => {
  const [inp, setInp] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => setInp(data));
  }, []);

  return (
    <div>
      <h2>Todo List</h2>
      {inp ? (
        inp.map((item) => (
          <p key={item.id}>{item.title}</p>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Fetching;