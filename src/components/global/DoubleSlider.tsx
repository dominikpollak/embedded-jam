import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../constants/colors";

type Props = {
  defaultValue: number[];
  max: number;
  onChange: (min: number, max: number) => void;
  onAfterChange: (min: number, max: number) => void;
  min?: number;
};

const DoubleSlider: React.FC<Props> = ({
  defaultValue,
  max,
  onChange,
  onAfterChange,
  min = 0,
}) => {
  const [values, setValues] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const draggingIndex = useRef<number | null>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (draggingIndex.current !== null && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const newValue = Math.round(
        Math.min(
          max,
          Math.max(
            min,
            min + ((event.clientX - rect.left) / rect.width) * (max - min)
          )
        )
      );
      setValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[draggingIndex.current!] = newValue;
        return newValues;
      });
    }
  };

  const handleMouseUp = () => {
    if (draggingIndex.current !== null) {
      draggingIndex.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setValues((prevValues) => {
        onAfterChange(prevValues[0], prevValues[1]);
        return prevValues;
      });
    }
  };

  const handleMouseDown = (index: number) => (event: React.MouseEvent) => {
    draggingIndex.current = index;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    onChange(values[0], values[1]);
  }, [values, onChange]);

  const getThumbStyle = (value: number) => ({
    left: `calc(${((value - min) / (max - min)) * 100}% - 12.5px)`,
    backgroundColor: colors.text,
  });

  return (
    <div
      className="w-[calc(100%-25px)] h-[15px] my-[10px] relative"
      ref={sliderRef}
    >
      <div className="absolute top-[10px] bottom-0 w-full bg-border rounded-full" />
      <div
        className="absolute top-[10px] bottom-0 rounded-full"
        style={{
          left: `calc(${((values[0] - min) / (max - min)) * 100}% - 12.5px)`,
          right: `calc(${
            100 - ((values[1] - min) / (max - min)) * 100
          }% - 12.5px)`,
          backgroundColor: colors.text,
        }}
      />
      {values.map((value, index) => (
        <div
          key={index}
          className="absolute h-[25px] w-[25px] leading-[25px] text-[11px] font-medium text-center text-black rounded-full px-[5px] cursor-grab"
          style={getThumbStyle(value)}
          onMouseDown={handleMouseDown(index)}
        >
          <div className="absolute top-1/2 left-1/2 w-[15px] h-[15px] bg-background rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      ))}
    </div>
  );
};

export default DoubleSlider;
