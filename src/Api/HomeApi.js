import {fetchApi} from '../Utils';

export const getBai = () => {
  return fetchApi('/bai', 'GET');
};
export const getXe = () => {
  return fetchApi('/xe', 'GET');
};
export const getNhaThau = () => {
  return fetchApi('/nhathau', 'GET');
};
export const getVatTu = () => {
  return fetchApi('/vattu', 'GET');
};
export const getChuyenXeID = id => {
  return fetchApi(`/chuyenxe/xe/${id}`, 'GET');
};
export const postChuyenXe = body => {
  return fetchApi('/chuyenxe', 'POST', body);
};
export const UpdateChuyenXeID = (id, body) => {
  return fetchApi(`/chuyenxe/${id}`, 'POST', body);
};

export const postDiaryINOUT = body => {
  return fetchApi('/DiaryINOUT', 'POST', body);
};

export const getDiaryINOUTID = id => {
  return fetchApi(`/DiaryINOUT/${id}`, 'GET');
};
export const getDiaryINOUT = params => {
  return fetchApi('/DiaryINOUT', 'GET', null, params);
};

export const putDiaryINOUT = (body, id) => {
  return fetchApi(`/DiaryINOUT/${id}`, 'PUT', body);
};

export const postChuyenTau = body => {
  return fetchApi(`/ChuyenTau`, 'POST', body);
};
export const getChuyenTau = params => {
  return fetchApi('/ChuyenTau', 'GET', null, params);
};

export const putChuyenTau = (body, id) => {
  return fetchApi(`/ChuyenTau/${id}`, 'PUT', body);
};

export const getDM = params => {
  return fetchApi('/dinhmuc', 'GET', null, params);
};
