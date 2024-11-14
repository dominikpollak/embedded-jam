import punycode from "punycode";

const isValidPunycode = (str: string): boolean => {
  try {
    punycode.decode(str);
    return true;
  } catch {
    return false;
  }
};

export const translatePunycode = (formattedDisplayName: string) => {
  if (formattedDisplayName.startsWith("$xn---")) {
    let endIndex = formattedDisplayName.slice(6).search(/[^a-zA-Z0-9-]/);
    let punycodePart = formattedDisplayName.slice(
      6,
      endIndex === -1 ? formattedDisplayName.length : 6 + endIndex
    );
    let remainingPart = formattedDisplayName.slice(6 + endIndex);

    if (isValidPunycode(punycodePart)) {
      formattedDisplayName += ` (${
        punycode.decode(punycodePart) + remainingPart
      })`;
    }
  } else if (formattedDisplayName.startsWith("$xn--")) {
    let endIndex = formattedDisplayName.slice(5).search(/[^a-zA-Z0-9-]/);
    let punycodePart = formattedDisplayName.slice(
      5,
      endIndex === -1 ? formattedDisplayName.length : 5 + endIndex
    );
    let remainingPart =
      endIndex === -1 ? "" : formattedDisplayName.slice(5 + endIndex);

    if (isValidPunycode(punycodePart)) {
      formattedDisplayName += ` (${
        punycode.decode(punycodePart) + remainingPart
      })`;
    }
  }

  return formattedDisplayName;
};
