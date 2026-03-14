import { useEffect } from "react";

const Cursor = () => {

  useEffect(() => {

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    const moveCursor = (e) => {

      const x = e.clientX;
      const y = e.clientY;

      if(dot){
        dot.style.left = x + "px";
        dot.style.top = y + "px";
      }

      if(ring){
        ring.style.left = x + "px";
        ring.style.top = y + "px";
      }

    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };

  }, []);

  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-ring"></div>
    </>
  );
};

export default Cursor;