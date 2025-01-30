import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

/**
 * @typedef {Object} ExcelExportProps
 * @property {Object} apartment - 아파트 정보
 * @property {string} apartment.displayName - 아파트 이름
 * @property {Object} type - 타입 정보
 * @property {string} type.전용면적 - 전용면적
 * @property {[import('dayjs').Dayjs, import('dayjs').Dayjs]} dateRange - 날짜 범위
 * @property {Array<{date: string, 매매가: number, 전세가: number}>} priceData - 가격 데이터
 */

/**
 * 엑셀 내보내기 컴포넌트
 * @param {ExcelExportProps} props
 */
function ExcelExport({ apartment, type, dateRange, priceData }) {
  const handleExport = () => {
    // 디버깅을 위한 로그 추가
    console.log('ExcelExport props:', { apartment, type, dateRange, priceData });

    if (!apartment || !type || !dateRange || !priceData) {
      console.log('Export disabled due to missing data:', { 
        hasApartment: !!apartment, 
        hasType: !!type, 
        hasDateRange: !!dateRange, 
        hasPriceData: !!priceData 
      });
      return;
    }

    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // 요약 정보 시트 데이터 준비
    const summaryData = [
      // 헤더 정보
      ['아파트 정보'],
      ['단지명', apartment.apartmentName],
      ['주소', apartment.address],
      ['평형', `${type.전용면적}㎡`],
      ['조회 기간', `${dayjs(dateRange[0]).format('YYYY-MM-DD')} ~ ${dayjs(dateRange[1]).format('YYYY-MM-DD')}`],
      [], // 빈 줄
      // 통계 정보
      ['가격 통계'],
      ['구분', '매매가(만원)', '전세가(만원)', '전세가율(%)'],
      ['평균가', 
        average(priceData.map(item => item.매매가)),
        average(priceData.map(item => item.전세가)),
        average(priceData.map(item => (item.전세가 / item.매매가) * 100))
      ],
      ['최고가',
        Math.max(...priceData.map(item => item.매매가)),
        Math.max(...priceData.map(item => item.전세가)),
        '-'
      ],
      ['최저가',
        Math.min(...priceData.map(item => item.매매가)),
        Math.min(...priceData.map(item => item.전세가)),
        '-'
      ],
      [], // 빈 줄
      // 상세 데이터 헤더
      ['상세 데이터'],
      ['기준일자', '매매가(만원)', '전세가(만원)', '전세가율(%)']
    ];

    // 상세 데이터 행 추가
    priceData.forEach(item => {
      summaryData.push([
        item.date,
        item.매매가,
        item.전세가,
        ((item.전세가 / item.매매가) * 100).toFixed(2)
      ]);
    });

    // 차트 데이터 시트 준비
    const chartData = [
      ['기간별 매매가/전세가 추이'],
      ['날짜', '매매가(만원)', '전세가(만원)'],
      ...priceData.map(item => [item.date, item.매매가, item.전세가])
    ];

    // 시트 생성 및 추가
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    const chartWs = XLSX.utils.aoa_to_sheet(chartData);

    // 열 너비 설정
    const wscols = [
      {wch: 15}, // A열
      {wch: 12}, // B열
      {wch: 12}, // C열
      {wch: 12}  // D열
    ];
    summaryWs['!cols'] = wscols;
    chartWs['!cols'] = wscols;

    // 워크시트를 워크북에 추가
    XLSX.utils.book_append_sheet(wb, summaryWs, '요약정보');
    XLSX.utils.book_append_sheet(wb, chartWs, '차트데이터');

    // 파일 이름 생성
    const fileName = `${apartment.apartmentName}_${type.전용면적}㎡_${dayjs().format('YYYYMMDD')}.xlsx`;

    // 엑셀 파일 다운로드
    XLSX.writeFile(wb, fileName);
  };

  /**
   * 평균값 계산 함수
   * @param {number[]} numbers
   * @returns {number}
   */
  const average = (numbers) => {
    const avg = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    return Math.round(avg * 100) / 100; // 소수점 2자리까지 반올림
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleExport}
      disabled={!apartment || !type || !priceData}
    >
      엑셀 내보내기
    </Button>
  );
}

export default ExcelExport; 