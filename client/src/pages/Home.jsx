import React from 'react'
import Hero from '../component/Hero'
import FeatureDestination from '../component/FeatureDestination'
import ExclusiveOffers from '../component/ExclusiveOffers'
import Testimonial from '../component/Testimonial'
import NewsLetter from '../component/NewsLetter'
import RecommendedHotels from '../component/RecommendedHotels'

const Home = () => {
  return (
    <>
      <Hero/>
     
      <FeatureDestination/>
      <ExclusiveOffers/>
      <Testimonial/>
      <NewsLetter/>
    </>
  )
}

export default Home
