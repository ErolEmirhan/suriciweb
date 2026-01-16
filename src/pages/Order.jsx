import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderModal from '../components/OrderModal'

export default function Order() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    // Modal kapandıktan sonra menü sayfasına yönlendir
    setTimeout(() => {
      navigate('/menu')
    }, 300) // Animasyon süresi kadar bekle
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <OrderModal isOpen={isOpen} onClose={handleClose} />
    </div>
  )
}
