
import MyCart from '../../../../components/_CartManagemenets/MyCart'
import PlaceOrderForm from '../../../../components/_CartManagemenets/OrderPlaceForm'

export default function MyCartPage() {
  return (
    <div className='lg:container mx-auto px-4 py-16'>
      <MyCart></MyCart>
      <PlaceOrderForm></PlaceOrderForm>
    </div>
  )
}
