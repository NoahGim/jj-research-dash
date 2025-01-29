import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders header title', () => {
    render(<App />);
    const headerElement = screen.getByText('부동산 시세 분석');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('아파트 이름을 입력하세요');
    expect(searchInput).toBeInTheDocument();
  });
});
