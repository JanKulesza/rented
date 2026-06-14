const zodToInt = (val: unknown) =>
  typeof val === "string" && val.trim() !== ""
    ? !["undefined", "null"].includes(val)
      ? Number(val)
      : null
    : null;

export default zodToInt;