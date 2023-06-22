import React, { useState } from 'react';

const InputForm = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the inputValue to the backend and save it to the database
    // You'll need to implement the backend integration separately

    setInputValue(''); // Clear the input field after submitting
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div class="container">
      <div class="row">
        <div class="col-1"></div>
        <div class="col-5"></div>
        <div class="col-5"></div>
        <div class="col-1"></div>

      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

    </div>

  );
};

export default InputForm;