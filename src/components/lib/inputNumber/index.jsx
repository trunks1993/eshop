/*
 * @Date: 2020-07-17 19:17:43
 * @LastEditTime: 2020-08-12 17:26:10
 */

import React, { useState } from "react";
import { SvgIcon } from "@/components/lib";

const InputNumber = (props) => {
  const { min, max, defaultValue, onChange } = props;
  const ref = React.createRef();
  const [currentValue, setCurrentValue] = useState(defaultValue || "");

  const handleBlur = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) {
      if (defaultValue && defaultValue % 1 === 0) {
        value = defaultValue;
      } else if (min && min % 1 === 0) {
        value = min;
      } else if (max && max % 1 === 0) {
        value = max;
      } else {
        value = "";
      }
    } else {
      if (min && value < min) {
        value = min;
      } else if (max && value > max) {
        value = max;
      }
    }
    ref.current.value = value;
    setCurrentValue(value);
    onChange && onChange(value);
  };

  const handleChange = (num) => {
    let value = parseInt(ref.current.value) + num;
    if (min && value < min) {
      value = min;
    } else if (max && value > max) {
      value = max;
    }
    ref.current.value = value;
    setCurrentValue(value);
    onChange && onChange(value);
  };

  return (
    <div className="input-number">
      <span
        className={`input-number-minus ${
          currentValue === min ? "disabled" : ""
        }`}
        onClick={currentValue === min ? () => {} : () => handleChange(-1)}
      >
        <SvgIcon
          iconClass="minus"
          fill={currentValue === min ? "#CCCCCC" : "#333333"}
        />
      </span>
      <input
        className="input-number-input"
        defaultValue={defaultValue}
        onBlur={handleBlur}
        ref={ref}
      />
      <span
        className={`input-number-plus ${
          currentValue === max ? "disabled" : ""
        }`}
        onClick={currentValue === max ? () => {} : () => handleChange(1)}
      >
        <SvgIcon
          iconClass="plus"
          fill={currentValue === max ? "#CCCCCC" : "black"}
        />
      </span>
    </div>
  );
};

export default InputNumber;
