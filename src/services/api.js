import axios from 'axios';

const BASE_URL = 'https://api.kbland.kr';

// API 엔드포인트 상수 정의
const ENDPOINTS = {
  SEARCH: '/land-complex/serch/autoKywrSerch',
  APARTMENT_DETAILS: '/land-complex/serch/intgraSerch',
  APARTMENT_TYPES: '/land-complex/complex/mpriByType',
  PRICE_CHART: '/land-price/price/PerMn/IntgrationChart'
};

// 검색 컬렉션 설정
const SEARCH_COLLECTIONS = {
  ADDRESS: 'COL_AT_JUSO:100',
  SCHOOL: 'COL_AT_SCHOOL:100',
  SUBWAY: 'COL_AT_SUBWAY:100',
  APARTMENT: 'COL_AT_HSCM:100',
  VILLA: 'COL_AT_VILLA:100'
};

// 요청 인터셉터 추가
axios.interceptors.request.use(request => {
  if (request.method === 'get') {
    const fullUrl = `${request.baseURL || ''}${request.url}${request.params ? '?' + new URLSearchParams(request.params).toString() : ''}`;
    console.log('Request URL:', fullUrl);
    console.log('Request Method:', request.method.toUpperCase());
    console.log('Request Headers:', request.headers);
  }
  return request;
});

// 키워드 검색 API
export const fetchSearchResults = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.SEARCH}`, {
      params: {
        컬렉션설정명: Object.values(SEARCH_COLLECTIONS).join(';'),
        검색키워드: query
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.dataBody.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

// 통합 검색 API (아파트 상세 정보)
export const fetchApartmentDetails = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.APARTMENT_DETAILS}`, {
      params: {
        검색설정명: 'SRC_HSCM',
        검색키워드: query,
        출력갯수: 2,
        페이지설정값: 1
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching apartment details:', error);
    throw error;
  }
};

// 단지 내 주거 구성 타입 API
export const fetchApartmentTypes = async (complexNo) => {
  try {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.APARTMENT_TYPES}`, {
      params: {
        단지기본일련번호: complexNo
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching apartment types:', error);
    throw error;
  }
};

// 통합 차트 API
export const fetchPriceChartData = async (complexNo, areaNo, startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.PRICE_CHART}`, {
      params: {
        단지기본일련번호: complexNo,
        면적일련번호: areaNo,
        거래구분: '0',
        조회구분: '0',
        조회시작일: startDate,
        조회종료일: endDate
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching price chart data:', error);
    throw error;
  }
}; 