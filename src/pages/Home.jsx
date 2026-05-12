import { useState } from 'react'
import ReservaForm from '../components/ReservaForm'
import './Home.css'

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [seccion, setSeccion] = useState('inicio')

  function scrollTo(id) {
    setNavOpen(false)
    setSeccion(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">

      {/* ── NAV ── */}
      <header className="nav">
        <div className="nav__inner">
          <div className="nav__logo" onClick={() => scrollTo('inicio')}>
            <span className="nav__logo-the">THE</span>
            <span className="nav__logo-gordo">GORDO</span>
          </div>

          <nav className={`nav__links ${navOpen ? 'nav__links--open' : ''}`}>
            {[
              { id: 'inicio',   label: 'Inicio' },
              { id: 'nosotros', label: 'Nosotros' },
              { id: 'menu',     label: 'Menú' },
              { id: 'reservas', label: 'Reservas' },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={`nav__link ${seccion === id ? 'nav__link--active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
            <button className="nav__cta" onClick={() => scrollTo('reservas')}>
              Reservar mesa
            </button>
          </nav>

          <button
            className={`nav__burger ${navOpen ? 'nav__burger--open' : ''}`}
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="inicio" className="hero">
        <div className="hero__bg">
          <div className="hero__stripes" />
          <div className="hero__glow" />
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow">Comidas rápidas · Bucaramanga</p>
          <h1 className="hero__title">
            <span className="hero__title-the">THE</span>
            <span className="hero__title-gordo">GORDO</span>
          </h1>
          <p className="hero__sub">
            Sabores auténticos. Ambiente sin igual.<br />
            Reserva tu mesa y vive la experiencia.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => scrollTo('reservas')}>
              Hacer una reserva
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo('menu')}>
              Ver el menú
            </button>
          </div>
        </div>
        <div className="hero__badge">
          <span>Abierto todos los días</span>
          <strong>11:00 am – 10:00 pm</strong>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section id="nosotros" className="about">
        <div className="about__inner">
          <div className="about__text">
            <span className="section-tag">Nuestra historia</span>
            <h2 className="section-title">Sabor que se siente<br/>desde el primer bocado</h2>
            <p>
              En The Gordo llevamos años sirviendo las mejores comidas rápidas de la ciudad.
              Cada ingrediente es seleccionado con cuidado, cada receta perfeccionada con amor.
            </p>
            <p>
              Más que un restaurante, somos el punto de encuentro de Bucaramanga.
              Un lugar donde cada visita se convierte en un recuerdo.
            </p>
          </div>
          <div className="about__stats">
            {[
              { n: '10+', label: 'Años de experiencia' },
              { n: '50K+', label: 'Clientes felices' },
              { n: '30+', label: 'Platos en el menú' },
              { n: '4.9', label: 'Calificación promedio' },
            ].map(({ n, label }) => (
              <div className="stat" key={label}>
                <span className="stat__n">{n}</span>
                <span className="stat__label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENÚ DESTACADO ── */}
      <section id="menu" className="menu-section">
        <div className="menu-section__inner">
          <span className="section-tag">Lo más pedido</span>
          <h2 className="section-title">Nuestros clásicos</h2>
          <div className="menu-grid">
            {[
              { nombre: 'Hamburguesa Gordo', desc: 'Doble carne, queso cheddar, tocineta crocante y salsa especial', precio: '$28.000' },
              { nombre: 'Perro Estilo Gordo', desc: 'Salchicha premium, papas fritas, maíz, queso y salsas de la casa', precio: '$18.000' },
              { nombre: 'Combo Familiar',    desc: '2 hamburguesas + 2 perros + papas grandes + 4 bebidas', precio: '$85.000' },
              { nombre: 'Alitas BBQ',        desc: '10 alitas marinadas en salsa BBQ ahumada, con dip de queso azul', precio: '$32.000' },
              { nombre: 'Papas Cargadas',    desc: 'Papas fritas con carne desmechada, queso y jalapeños', precio: '$22.000' },
              { nombre: 'Malteada Gordo',    desc: 'Vainilla, chocolate o fresa. Espesa y cremosa, tamaño XL', precio: '$14.000' },
            ].map(({ nombre, desc, precio }) => (
              <div className="menu-card" key={nombre}>
                <div className="menu-card__top">
                  <h3>{nombre}</h3>
                  <span className="menu-card__precio">{precio}</span>
                </div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESERVAS ── */}
      <section id="reservas" className="reservas-section">
        <div className="reservas-section__inner">
          <div className="reservas-section__info">
            <span className="section-tag">Mesa para ti</span>
            <h2 className="section-title">Haz tu reserva</h2>
            <p>
              Asegura tu lugar en The Gordo. Recibe confirmación
              inmediata y llega sin esperas.
            </p>
            <div className="reservas-section__datos">
              <div className="dato">
                <span className="dato__icon">📍</span>
                <div>
                  <strong>Dirección</strong>
                  <span>Calle 45 #30-12, Bucaramanga</span>
                </div>
              </div>
              <div className="dato">
                <span className="dato__icon">🕐</span>
                <div>
                  <strong>Horario</strong>
                  <span>Lun – Dom · 11:00 am – 10:00 pm</span>
                </div>
              </div>
              <div className="dato">
                <span className="dato__icon">📞</span>
                <div>
                  <strong>Teléfono</strong>
                  <span>+57 300 123 4567</span>
                </div>
              </div>
            </div>
          </div>
          <div className="reservas-section__form">
            <ReservaForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__logo">
            <span className="nav__logo-the">THE</span>
            <span className="nav__logo-gordo">GORDO</span>
          </div>
          <p>© 2024 The Gordo · Comidas Rápidas · Bucaramanga</p>
        </div>
      </footer>

    </div>
  )
}
