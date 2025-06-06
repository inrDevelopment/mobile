export default function randomDeviceKey(length: number): string {
  try {
    const values =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * values.length);
      result += values[randomIndex];
    }

    return result;
  } catch (error: any) {
    console.warn(error.message);
    return "";
  }
}
