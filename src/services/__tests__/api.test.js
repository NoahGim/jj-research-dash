import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  fetchSearchResults, 
  fetchApartmentDetails, 
  fetchApartmentTypes, 
  fetchPriceChartData 
} from '../api';

describe('API Tests', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('fetchSearchResults', () => {
    const mockQuery = '광안자이';
    const mockResponse = {
      "dataHeader": {
        "resultCode": "10000",
        "message": "NO_ERROR"
      },
      "dataBody": {
        "data": [
          {
            "COL_AT_HSCM": [
              {
                "text": "광안자이",
                "addr": "수영구 광안동",
                "textTemp": "(수영구 광안동)광안자이",
                "COMPLEX_NO": "39499"
              }
            ]
          }
        ],
        "resultCode": 11000
      }
    };

    it('should fetch search results successfully', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/serch/autoKywrSerch')
        .reply(200, mockResponse);

      const result = await fetchSearchResults(mockQuery);
      expect(result).toEqual(mockResponse.dataBody.data);
    });

    it('should handle errors', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/serch/autoKywrSerch')
        .reply(500);

      await expect(fetchSearchResults(mockQuery)).rejects.toThrow();
    });
  });

  describe('fetchApartmentDetails', () => {
    const mockComplexNo = '39499';
    const mockResponse = {
      "dataHeader": {
        "resultCode": "10000",
        "message": "NO_ERROR"
      },
      "dataBody": {
        "data": {
          "HSCM": {
            "data": [
              {
                "COMPLEX_NO": "39499",
                "HSCM_NM": "광안자이",
                "BUBADDR": "부산광역시 수영구 광안동",
                "NEWADDRESS": "부산광역시 수영구 호암로29번길 50",
                "THS_NUM": "971",
                "SQRMSR_SCOP": "87.75~132.42"
              }
            ]
          }
        }
      }
    };

    it('should fetch apartment details successfully', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/integration/search')
        .reply(200, mockResponse);

      const result = await fetchApartmentDetails(mockComplexNo);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/integration/search')
        .reply(500);

      await expect(fetchApartmentDetails(mockComplexNo)).rejects.toThrow();
    });
  });

  describe('fetchApartmentTypes', () => {
    const mockComplexNo = '39499';
    const mockResponse = {
      "dataHeader": {
        "resultCode": "10000",
        "message": "NO_ERROR"
      },
      "dataBody": {
        "data": [
          {
            "단지기본일련번호": 39499,
            "공급면적": "87.75",
            "전용면적": "59.85",
            "면적일련번호": 38303,
            "매매일반거래가": 67250,
            "전세일반거래가": 32500
          },
          {
            "단지기본일련번호": 39499,
            "공급면적": "104.75",
            "전용면적": "73.67",
            "면적일련번호": 83625,
            "매매일반거래가": 74500,
            "전세일반거래가": 37000
          }
        ],
        "resultCode": 11000
      }
    };

    it('should fetch apartment types successfully', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/complex/mpriByType')
        .reply(200, mockResponse);

      const result = await fetchApartmentTypes(mockComplexNo);
      console.log('Result:', JSON.stringify(result, null, 10));
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/complex/mpriByType')
        .reply(500);

      await expect(fetchApartmentTypes(mockComplexNo)).rejects.toThrow();
    });

    it('should fetch real data', async () => {
      const complexNo = '39499'; // 광안자이 단지번호
      try {
        const result = await fetchApartmentTypes(complexNo);
        console.log('실제 API 응답:', JSON.stringify(result, null, 2));
        
        // API 응답 구조 검증
        expect(result).toHaveProperty('dataHeader');
        expect(result).toHaveProperty('dataBody.data');
        expect(Array.isArray(result.dataBody.data)).toBe(true);
        
        // 데이터 필드 검증
        const firstType = result.dataBody.data[0];
        expect(firstType).toHaveProperty('단지기본일련번호');
        expect(firstType).toHaveProperty('공급면적');
        expect(firstType).toHaveProperty('전용면적');
      } catch (error) {
        console.error('API 호출 실패:', error.response?.data || error.message);
        throw error;
      }
    });
  });

  describe('fetchPriceChartData', () => {
    const mockParams = {
      complexNo: '39499',
      areaNo: '83625',
      startDate: '20230101',
      endDate: '20231231'
    };
    const mockResponse = {
      "dataHeader": {
        "resultCode": "10000",
        "message": "NO_ERROR"
      },
      "dataBody": {
        "data": {
          "시세": [
            {
              "groupCategory": "2023",
              "items": [
                {
                  "전세실거래평균가": 38500,
                  "매매실거래평균가": 69000,
                  "기준년월": "202301",
                  "전세실거래금액": 38500,
                  "매매실거래금액": 69000
                }
              ]
            }
          ],
          "차트최대값": "96500",
          "차트최소값": "0"
        },
        "resultCode": 11000
      }
    };

    it('should fetch price chart data successfully', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/integration/chart')
        .reply(200, mockResponse);

      const result = await fetchPriceChartData(
        mockParams.complexNo,
        mockParams.areaNo,
        mockParams.startDate,
        mockParams.endDate
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mock.onGet('https://api.kbland.kr/land-complex/integration/chart')
        .reply(500);

      await expect(fetchPriceChartData(
        mockParams.complexNo,
        mockParams.areaNo,
        mockParams.startDate,
        mockParams.endDate
      )).rejects.toThrow();
    });
  });
}); 