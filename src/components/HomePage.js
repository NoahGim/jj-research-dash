import React from 'react';
import SearchSection from './SearchSection';
import RecentSearches from './RecentSearches';
import PopularListings from './PopularListings';
import TrendingArea from './TrendingArea';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div>
      <SearchSection />
      <RecentSearches />
      <PopularListings />
      <TrendingArea />
      <Footer />
    </div>
  );
};

export default HomePage; 