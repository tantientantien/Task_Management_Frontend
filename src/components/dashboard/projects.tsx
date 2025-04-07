"use client";
import ColorPicker from 'react-best-gradient-color-picker'
import React, { useState, useEffect } from "react";

const Projects = () => {
  const [color, setColor] = useState("rgba(255,255,255,1)");

  useEffect(() => {
    console.log("Component mounted with initial color:", color);
  }, [color]);

  return (
    <div>
      projects
      <ColorPicker value={color} onChange={setColor} />
      {color}
    </div>
  );
};

export default Projects;
