export const debug = (msg: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(msg, data);
  }
};
