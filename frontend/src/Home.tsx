import React, { useState } from "react";
import InputField from "./component/InputField.tsx";

const LoginForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", { name, email, password });
  };

  return (
    <div className="h-screen bg-white rounded-md shadow-md font-sans flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        GRED
      </h1>
      <h2 className="text-xl text-blue-600 text-center mb-1">LOG IN</h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        Already Registered? Log in here.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
        <InputField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition duration-200"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
