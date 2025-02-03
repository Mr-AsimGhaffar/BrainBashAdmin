const FormatString = (str: any) => {
  if (!str) return "";
  return str
    .split("_")
    .map(
      (word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

export default FormatString;
