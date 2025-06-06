type asyncUser = {
  expoPushToken?: string;
  deviceKey?: string;
  userToken?: string;
};
type padraoItem = {
  title: string;
  link: string;
};

type contentType = {
  text?: string;
  tipo?: string;
  url?: string;
};

export { asyncUser, contentType, padraoItem };
