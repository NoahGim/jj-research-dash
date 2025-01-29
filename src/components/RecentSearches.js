import styled from 'styled-components';

const RecentSearchContainer = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin: -50px 20px 0;
  position: relative;
  z-index: 2;
`;

const RecentSearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SearchCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`; 