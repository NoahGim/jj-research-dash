/**
 * 키워드 검색 API
 * @typedef {Object} KeywordSearchRequest
 * @property {string} 컬렉션설정명 - 'COL_AT_JUSO:100;COL_AT_SCHOOL:100;COL_AT_SUBWAY:100;COL_AT_HSCM:100;COL_AT_VILLA:100'
 * @property {string} 검색키워드
 */

/**
 * @typedef {Object} KeywordSearchResponse
 * @property {Array<{
 *   COL_AT_HSCM: Array<{
 *     text: string,
 *     addr: string,
 *     textTemp: string
 *   }>
 * }>} - 검색 결과 배열
 */

/**
 * 아파트 상세 정보 API
 * @typedef {Object} ApartmentDetailsResponse
 * @property {Object} dataBody
 * @property {Object} dataBody.data
 * @property {number} dataBody.data.매물갯수총합
 * @property {number} dataBody.data.차트거래량최대값
 * @property {string} dataBody.data.거래구분코드
 * @property {Array<{
 *   groupCategory: string,
 *   items: Array<{
 *     기준년월: string,
 *     매매일반거래가: number,
 *     전세일반거래가: number,
 *     매매실거래평균가: number,
 *     전세실거래평균가: number,
 *     매매실거래거래량: number,
 *     전세실거래거래량: number
 *   }>
 * }>} dataBody.data.시세
 */

/**
 * 통합 검색 API
 * @typedef {Object} IntegrationSearchRequest
 * @property {string} 검색설정명 - 'SRC_HSCM'
 * @property {string} 검색키워드
 * @property {string} 출력갯수
 * @property {string} 페이지설정값
 */

/**
 * @typedef {Object} IntegrationSearchResponse
 * @property {Object} dataHeader
 * @property {string} dataHeader.resultCode
 * @property {string} dataHeader.message
 * @property {Object} dataBody
 * @property {Object} dataBody.data
 * @property {Object} dataBody.data.data
 * @property {Object} dataBody.data.data.HSCM
 * @property {Array<{
 *   COMPLEX_NO: string,
 *   HSCM_NM: string,
 *   BUBADDR: string,
 *   NEWADDRESS: string,
 *   THS_NUM: string,
 *   SQRMSR_SCOP: string,
 *   WGS84_LAT: string,
 *   WGS84_LNG: string
 * }>} dataBody.data.data.HSCM.data
 * @property {string} dataBody.data.data.HSCM.totcnt
 * @property {string} dataBody.data.data.HSCM.outcnt
 * @property {string} dataBody.data.data.HSCM.pagenum
 * @property {number} dataBody.resultCode
 */

/**
 * 단지내 주거 구성 타입 API
 * @typedef {Object} MpriTypeRequest
 * @property {string} 단지기본일련번호
 */

/**
 * @typedef {Object} MpriTypeResponse
 * @property {Object} dataHeader
 * @property {string} dataHeader.resultCode
 * @property {string} dataHeader.message
 * @property {Object} dataBody
 * @property {Array<{
 *   단지기본일련번호: number,
 *   공급면적: string,
 *   전용면적: string,
 *   매매일반거래가: number,
 *   전세일반거래가: number,
 *   매매건수: number,
 *   전세건수: number,
 *   세대수: number,
 *   주택형타입내용: string
 * }>} dataBody.data
 * @property {number} dataBody.resultCode
 */

/**
 * 가격 차트 API
 * @typedef {Object} PriceChartRequest
 * @property {string} complexNo - 단지번호
 * @property {string} type - 타입
 * @property {string} startDate - 'YYYYMMDD'
 * @property {string} endDate - 'YYYYMMDD'
 */

/**
 * @typedef {Object} PriceChartItem
 * @property {string} 기준년월
 * @property {number} 매매일반거래가
 * @property {number} 전세일반거래가
 * @property {number|null} 매매실거래평균가
 * @property {number|null} 전세실거래평균가
 * @property {number} 매매실거래거래량
 * @property {number} 전세실거래거래량
 */

/**
 * @typedef {Object} PriceChartResponse
 * @property {Object} dataHeader
 * @property {string} dataHeader.resultCode
 * @property {string} dataHeader.message
 * @property {Object} dataBody
 * @property {Object} dataBody.data
 * @property {string} dataBody.data.차트최소값
 * @property {string} dataBody.data.차트최대값
 * @property {Array<{groupCategory: string, items: PriceChartItem[]}>} dataBody.data.시세
 * @property {number} dataBody.resultCode
 */ 