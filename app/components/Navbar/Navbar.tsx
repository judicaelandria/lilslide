import React from "react";
import { ChevronDownIcon } from "~/icons";

const Navbar = () => {
  const [name, setName] = React.useState("./slides.md");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div className="w-full h-18 flex justify-between items-center bg-darkBlue px-4 py-2 drop-shadow-xl">
      <div className="flex items-center gap-4">
        <img src="/images/logo.svg" />
        <ChevronDownIcon className="h-4 w-4" />
      </div>
      <input
        className="outline-none bg-transparent text-white focus:border-b"
        type="text"
        value={name}
        onChange={handleNameChange}
        style={{ width: name.length + "ch" }}
      />
      <button className="bg-blue-100 w-20 h-10 rounded-lg flex justify-center items-center gap-2">
        <img src="/images/playIcon.svg" />
        <span className="text-base text-white font-medium">Play</span>
      </button>
    </div>
  );
};

export default Navbar;
