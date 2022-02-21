import React from "react";
interface INavbarProps {
  toggleFullscreen: () => void;
}

const Navbar = ({ toggleFullscreen }: INavbarProps) => {
  const [name, setName] = React.useState("./slides.md");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div className="w-full h-18 flex justify-between items-center bg-darkBlue px-4 py-2 drop-shadow-xl">
      <img src="/images/logo.svg" />
      <input
        className="outline-none bg-transparent text-white focus:border-b"
        type="text"
        value={name}
        onChange={handleNameChange}
        style={{ width: name.length + "ch" }}
      />
      <button
        className="bg-blue-100 w-20 h-10 rounded-lg flex justify-center items-center gap-2"
        onClick={toggleFullscreen}
      >
        <img src="/images/playIcon.svg" />
        <span className="text-base text-white font-medium">Play</span>
      </button>
    </div>
  );
};

export default Navbar;
