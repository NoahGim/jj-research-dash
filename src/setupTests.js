// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// 추가적인 테스트 설정
import { configure } from '@testing-library/react';
import 'jest-environment-jsdom';

// 타임아웃 설정
jest.setTimeout(10000);

// 테스트 환경 설정
configure({ testIdAttribute: 'data-testid' });

// 글로벌 fetch mock 설정
global.fetch = jest.fn();

// 콘솔 에러 무시 설정 (선택사항)
console.error = jest.fn();

// matchMedia mock 설정
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
