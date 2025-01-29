// 키워드 검색 API
interface KeywordSearchRequest {
  컬렉션설정명: string; // 'COL_AT_JUSO:100;COL_AT_SCHOOL:100;COL_AT_SUBWAY:100;COL_AT_HSCM:100;COL_AT_VILLA:100'
  검색키워드: string;
}

interface KeywordSearchResponse {
  dataHeader: {
    resultCode: string;
    message: string;
  };
  dataBody: {
    data: Array<{
      COL_AT_HSCM: Array<{
        text: string;
        addr: string; 
        textTemp: string;
      }>;
    }>;
    resultCode: number;
  };
}

// 통합 검색 API
interface IntegrationSearchRequest {
  검색설정명: string; // 'SRC_HSCM'
  검색키워드: string;
  출력갯수: string;
  페이지설정값: string;
}

interface IntegrationSearchResponse {
  dataHeader: {
    resultCode: string;
    message: string;
  };
  dataBody: {
    data: {
      data: {
        HSCM: {
          data: Array<{
            COMPLEX_NO: string;
            HSCM_NM: string;
            BUBADDR: string;
            NEWADDRESS: string;
            THS_NUM: string;
            SQRMSR_SCOP: string;
            WGS84_LAT: string;
            WGS84_LNG: string;
            [key: string]: string;
          }>;
          totcnt: string;
          outcnt: string;
          pagenum: string;
        };
      };
      fltrMap: {
        srchwd: string;
        totalWord: string;
        [key: string]: string;
      };
    };
    resultCode: number;
  };
}

// 단지내 주거 구성 타입 API
interface MpriTypeRequest {
  단지기본일련번호: string;
}

interface MpriTypeResponse {
  dataHeader: {
    resultCode: string;
    message: string;
  };
  dataBody: {
    data: Array<{
      단지기본일련번호: number;
      공급면적: string;
      전용면적: string;
      매매일반거래가: number;
      전세일반거래가: number;
      매매건수: number;
      전세건수: number;
      세대수: number;
      주택형타입내용: string;
      [key: string]: string | number;
    }>;
    resultCode: number;
    groupData: Array<{
      단지기본일련번호: number;
      주택형타입내용: string;
      매매일반거래가: number;
      전세일반거래가: number;
      세대수: number;
      [key: string]: string | number;
    }>;
  };
}

// 가격 차트 API
interface PriceChartRequest {
  단지기본일련번호: string;
  면적일련번호: string;
  거래구분: string; // '0'
  조회구분: string; // '0'
  조회시작일: string; // 'YYYYMMDD'
  조회종료일: string; // 'YYYYMMDD'
}

interface PriceChartResponse {
  dataHeader: {
    resultCode: string;
    message: string;
  };
  dataBody: {
    data: {
      차트최소값: string;
      차트최대값: string;
      시세: Array<{
        groupCategory: string; // 연도
        items: Array<{
          기준년월: string;
          매매일반거래가: number;
          전세일반거래가: number;
          매매실거래평균가: number | null;
          전세실거래평균가: number | null;
          매매실거래거래량: number;
          전세실거래거래량: number;
          [key: string]: string | number | null;
        }>;
      }>;
      [key: string]: any;
    };
    resultCode: number;
  };
} 