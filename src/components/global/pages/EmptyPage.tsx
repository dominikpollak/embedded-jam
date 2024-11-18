import { Search } from "lucide-react";
import React from "react";
import Button from "../Button";

export type EmptyPageProps = {
  title: string;
  description?: string;
  button?: {
    onClick: () => void;
    label: string;
  };
};

export const EmptyPage: React.FC<EmptyPageProps> = ({
  title,
  description,
  button,
}) => {
  return (
    <div className="m-6 text-text mb-0 text-center flex flex-col items-center font-bold content-center">
      <Search size={50} />
      <h4 className="my-4">{title}</h4>
      {description && <span>{description}</span>}
      {button && (
        <Button
          variant="tertiary"
          onClick={button.onClick}
          label={button.label}
          size="sm"
          className="mt-6"
        />
      )}
    </div>
  );
};
