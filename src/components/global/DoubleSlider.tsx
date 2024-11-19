import React from "react";
import ReactSlider from "react-slider";
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
  min,
}) => {
  const Thumb = (props: any, state: any) => {
    const { key, ...restProps } = props;
    return (
      <div
        key={key}
        {...restProps}
        className="after:bg-background after:rounded-[50%] after:-translate-x-1/2 after:-translate-y-1/2 after:content-none after:absolute after:top-1/2 after:left-1/2 after:w-[15px] after:h-[15px] relative h-[25px] w-[25px] leading-[25px] text-[11px] font-medium text-center bg-text text-black rounded-[50%] px-[5px] cursor-grab"
      />
    );
  };

  const Track = (props: any, state: any) => {
    const { key, ...restProps } = props;
    return (
      <div
        key={key}
        {...restProps}
        className="top-[10px] bottom-0 rounded-[999px]"
        index={state.index}
        style={{
          color: colors.text,
          background:
            state.index === 2
              ? colors.grayText
              : state.index === 1
              ? colors.text
              : colors.grayText,
        }}
      />
    );
  };

  return (
    <ReactSlider
      className="w-full h-[15px] my-[10px]"
      onAfterChange={(value: any) => {
        onAfterChange(value[0], value[1]);
      }}
      onChange={(value: any) => {
        onChange(value[0], value[1]);
      }}
      pearling
      defaultValue={defaultValue as any}
      renderTrack={Track}
      renderThumb={Thumb}
      max={max}
      min={min || 0}
      minDistance={1}
    />
  );
};

export default DoubleSlider;
