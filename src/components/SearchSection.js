import styled from 'styled-components';

const SearchContainer = styled.div`
  height: 60vh;
  background: linear-gradient(135deg, #4568dc, #b06ab3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const SearchTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 1.2rem 2rem;
  border-radius: 50px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    transform: scale(1.02);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  }
`; 