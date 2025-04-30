import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';  // Import the FeaturedProducts component

export default function Home() {
    return (
        <div>
            {/* Banner Section */}
            <Banner />
            
            {/* Featured Products Section */}
            <FeaturedProducts />
        </div>
    );
}
