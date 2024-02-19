import { HeaderContainer } from './styles'
import logo from '../../assets/logo.svg'
import { Timer, ScrollText } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      <img
        src={logo}
        alt="Logo contendo as letras v e b uma em cima da outra"
      />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <ScrollText size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
