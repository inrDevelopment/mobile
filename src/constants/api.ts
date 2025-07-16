const BASE_API = `https://api.publicacoesinr.com.br`;

const BASE_API_USER = `https://api.publicacoesinr.com.br/seguranca/autenticacao/app`;

const BASE_API_REGISTER_DEVICE = `https://api.publicacoesinr.com.br/leitor/registrar`;

const BASE_API_LAST_PUBLISHED = `https://api.publicacoesinr.com.br/leitor/ultimo-boletim`;

const BASE_API_BULLETINS_LOGGED = `https://api.publicacoesinr.com.br/leitor/boletims/privado`;
const BASE_API_BULLETINS_NOT_LOGGED = `https://api.publicacoesinr.com.br/leitor/boletims/publico`;

const BASE_API_GET_BULLETINS = `https://api.publicacoesinr.com.br/leitor/ler?id=`;

const BASE_API_GET_FAVORITES = `https://api.publicacoesinr.com.br/leitor/favorito`;

const EXPO_PUSH = `https://exp.host/--/api/v2/push/send`;

const BASE_API_HOME = `https://api.legacy.publicacoesinr.com.br/home`; //GET
const IMAGE_API = `https://inrpublicacoes.com.br/sistema/img_up`; //IMAGE_API/${imageName.jpg}

export {
  BASE_API,
  BASE_API_BULLETINS_LOGGED,
  BASE_API_BULLETINS_NOT_LOGGED,
  BASE_API_GET_BULLETINS,
  BASE_API_GET_FAVORITES,
  BASE_API_HOME,
  BASE_API_LAST_PUBLISHED,
  BASE_API_REGISTER_DEVICE,
  BASE_API_USER,
  EXPO_PUSH,
  IMAGE_API,
};
