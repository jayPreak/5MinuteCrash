/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { useState } from "react";
import axios from "axios";

function Overlay() {
  const [ready, set] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    axios
      .get("https://zerofighterbackend.onrender.com/increment")
      .then((response) => {
        setCounter(response.data.counter);
        console.log("Counter incremented", response.data.counter);
      })
      .catch((error) => {
        console.error("Could not increment counter", error);
      });
  }, []);

  // useEffect(() => {
  //   const storedCounter = localStorage.getItem("websiteOpenedCount");
  //   const currentCounter = storedCounter ? parseInt(storedCounter, 10) : 0;
  //   if (currentCounter < 10000) {
  //     const newCounter = currentCounter + 1;
  //     setCounter(newCounter);
  //     localStorage.setItem("websiteOpenedCount", newCounter.toString());
  //   } else {
  //     setCounter(currentCounter); // Just set to the current value, don't increment
  //   }
  // }, []);
  return (
    <>
      <App />

      {/* <div className="dot" /> */}
      <div
        className={`fullscreen bg ${ready ? "ready" : "notready"} ${
          ready && "clicked"
        }`}
      >
        <div className="stack">
          <button className="wide-button" onClick={() => set(true)}>
            PLAY
          </button>
          <button className="wide-button text-xs">Choose Weapon</button>
          <button className="wide-button">Options</button>
        </div>
        {/* <Foo wilter date="26. July" year="2023" /> */}
        <h1 className="absolute top-10 text-8xl font-extrabold text-gray-900 ">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-[#f0b2bc] from-[#a90000]">
            ZeroFighter
          </span>
        </h1>
        <footer
          className=" rounded-lg shadow  absolute bottom-0 w-full"
          style={{ fontFamily: "MyFont" }}
        >
          <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <a
                href="https://jayeshbhushan.me/"
                className="flex items-center mb-4 sm:mb-0"
              >
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" /> */}
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  Jayesh Bhushan
                  <div className="absolute bottom-4 left-4 text-xl font-bold text-white">
                    Visits: {counter > 10000 ? "toomany :P" : counter}
                  </div>
                </span>
              </a>
              <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                  <a
                    href="https://github.com/jayPreak"
                    className="mr-4 hover:underline md:mr-6 "
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/jayPreak"
                    className="mr-4 hover:underline md:mr-6"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/jayesh-bhushan-587616200/"
                    className="mr-4 hover:underline md:mr-6 "
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:jayesh.preak2003@gmail.com"
                    className="hover:underline"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2023{" "}
              <a href="https://jayeshbhushanme/" className="hover:underline">
                JayeshBhushan™
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Overlay />);
