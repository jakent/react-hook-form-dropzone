
export function findFileExtension(file) {
  return file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : undefined;
}