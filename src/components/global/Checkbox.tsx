import React from "react";

const Checkbox: React.FC<{
  onCheckboxChange: () => void;
  isChecked: boolean;
}> = ({ onCheckboxChange, isChecked }) => {
  return (
    <label className="jam-checkbox">
      <input type="checkbox" onChange={onCheckboxChange} checked={isChecked} />
    </label>
  );
};

export default Checkbox;
