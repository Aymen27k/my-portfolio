import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const usePasswordToggle = () => {
  const [Visible, setVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const Icon = <FontAwesomeIcon icon={Visible ? faEyeSlash : faEye} />;
  const inputType = Visible ? "text" : "password";
  const togglePasswordVisibility = () => {
    setVisible((Visible) => !Visible);
  };
  return [inputType, Icon, togglePasswordVisibility];
};

export default usePasswordToggle;
