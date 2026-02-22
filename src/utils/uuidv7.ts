import { uuidv7 } from "uuidv7";

export const genUUIDv7 = (): string => {
  const result = uuidv7(); 

  return result;
}