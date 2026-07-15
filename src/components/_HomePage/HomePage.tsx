
import UserSideProductsPage from '../../app/(user)/product/page'

import HeroBannerCarousel from '../home/HeroBannerCarosoul'

export default function HomePage() {

  return (
    <div >

      <div className='lg:mt-[75px] mt-[65px] lg:mb-6 mb-3'>
        <HeroBannerCarousel></HeroBannerCarousel>
      </div>
      
     <div >
        
      <UserSideProductsPage></UserSideProductsPage>
   
     </div>
    
    </div>
  )
}
