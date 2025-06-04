import {fetchApi} from '../Utils';

export const postLogin = body => {
  return fetchApi('/Users/authenticate', 'POST', body);
};
export const getCa = params => {
  return fetchApi('/ca', 'GET', null, params);
};
export const getKho = () => {
  return fetchApi('/kho', 'GET');
};
export const getViTri = params => {
  return fetchApi('/vitri', 'GET', null, params);
};
export const getLoaiXuatBan = () => {
  return fetchApi('/loaixuatban', 'GET');
};
export const getVanChuyen = () => {
  return fetchApi('/vanchuyen', 'GET');
};
export const getLyDo = () => {
  return fetchApi('/LyDoDinhTre', 'GET');
};
