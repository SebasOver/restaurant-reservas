import { useState } from 'react'
import ReservaForm from '../components/ReservaForm'
import './Home.css'

const MENU_DATA = {
  perros: {
    label: 'Perros',
    sub: 'Papa Francesa',
    items: [
      { nombre: 'Dino Chori Tradicional',  precio: '$17.500', desc: 'Chorizo, cebolla, papa triturada, queso rallado' },
      { nombre: 'Dino Chori Especial',     precio: '$22.500', desc: 'Chorizo, cebolla, papa triturada, pollo desmechado y queso fundido' },
      { nombre: 'Dino Tradicional',        precio: '$17.000', desc: 'Salchicha americana, cebolla grille, papa triturada, queso rallado' },
      { nombre: 'Dino Especial',           precio: '$22.000', desc: 'Salchicha americana, cebolla grille, papa triturada, pollo desmechado y queso fundido' },
      { nombre: 'Dino Ranchero',           precio: '$24.500', desc: 'Salchicha americana, cebolla grille, papa triturada, carne en trocitos, maíz, chorizo y queso fundido' },
      { nombre: 'Dino Super Especial',     precio: '$26.500', desc: 'Salchicha americana, cebolla grille, papa triturada, pollo desmechado, carne en trocitos, chorizo y queso fundido' },
      { nombre: 'Dino The Gordo',          precio: '$27.500', desc: 'Salchicha americana, cebolla grille, papa triturada, pollo desmechado, carne en trocitos, maíz, chorizo en trocitos, champiñon y queso fundido' },
      { nombre: 'Dino Despelucado',        precio: '$26.500', desc: 'Salchicha americana, papa fosforito, cebolla grillet, carne desmechada, pollo desmechado, tocineta, queso chedar, papa a la francesa' },
      { nombre: 'Dino Acevichado',         precio: '$21.500', desc: 'Salchicha americana, papa fosforito, cebolla grillet, ceviche (maíz, cebolla, cilantro), queso rallado, papa a la francesa' },
    ],
  },
  hamburguesas: {
    label: 'Hamburguesas',
    sub: 'Papa Francesa',
    items: [
      { nombre: 'Pablo Marmol',                  precio: '$17.500', desc: '170gr de carne, queso, arepa, tomate, cebolla grille, lechuga' },
      { nombre: 'Pablo Marmol Especial',          precio: '$22.000', desc: '170gr de carne, queso, arepa, pollo desmechado, tomate, cebolla grille, lechuga' },
      { nombre: 'Pedro Picapiedra',               precio: '$24.000', desc: '170gr de carne, tocineta, queso, arepa, pollo desmechado, tomate, cebolla grille, lechuga' },
      { nombre: 'Pedro Picapiedra Patacon',       precio: '$24.500', desc: 'Patacon, 170gr de carne, queso, arepa, pollo desmechado, tocineta, aguacate picado, tomate, lechuga, cebolla grille' },
      { nombre: 'Pedro Picapiedra Especial',      precio: '$27.500', desc: '2 carnes de 170gr, queso, arepa, pollo desmechado, tomate, cebolla grille, lechuga, tocineta' },
      { nombre: 'Yabadabadoo',                    precio: '$32.500', desc: 'Lechuga, tomate, cebolla, aguacate, 2 carnes de 170gr, filete pechuga, arepa, pollo desmechado, huevo, tocineta y queso, papa francesa' },
      { nombre: 'Pedro Picapiedra Quesuda',       precio: '$30.500', desc: '170gr de carne, queso, arepa, pollo desmechado, maíz, tocineta, salchicha, baño de queso, tomate, cebolla grille, lechuga' },
      { nombre: 'Hamburguesa Pedro Despelucada',  precio: '$37.500', desc: '170gr de carne, pechuga tempura, queso, arepa, pollo desmechado, carne desmechada, tocineta, tomate, cebolla grillet, lechuga' },
      { nombre: 'Pedro Picapiedra Desmechada',    precio: '$28.500', desc: '170gr de carne, queso, pollo desmechado en cítricos, carne desmechada, tocineta, aguacate, lechuga, tomate, cebolla grille' },
      { nombre: 'Pedro Picapiedra Champiñon',     precio: '$27.500', desc: '170gr de carne, queso, arepa, pollo desmechado, tocineta, champiñon, tomate, cebolla grille, lechuga' },
      { nombre: 'Bambam',                         precio: '$27.500', desc: '170gr de carne, filete de pechuga, queso, arepa, tomate, cebolla grille, lechuga' },
      { nombre: 'Señor Rajuela',                  precio: '$32.500', desc: '170gr de carne, queso, arepa, maíz, pollo desmechado, carne en trocitos, huevo frito, tocineta, tomate, cebolla grille, lechuga, aguacate' },
      { nombre: 'Pedro y Pablo',                  precio: '$29.500', desc: '170gr de carne, filete de pechuga, queso, arepa, tocineta, tomate, cebolla grille, lechuga' },
      { nombre: 'Capitan Cavernicola',            precio: '$28.500', desc: '170gr de carne, filete de robalo apanado, queso, arepa, papa triturada, tomate, cebolla grille, lechuga' },
      { nombre: 'Pedro Picapiedra de la Casa',    precio: '$31.500', desc: '170gr de carne, queso, arepa, pollo desmechado, chorizo, tocineta, aros de cebolla apanado, huevo de codorniz, lechuga, tomate, cebolla' },
      { nombre: 'Hamburguesa Bufalos Mojados',    precio: '$28.500', desc: '170gr de carne, queso doble crema, queso cheddar, tocineta, pollo desmechado, chorizo caramelizado, tomate, cebolla grillet, lechuga, papa francesa' },
      { nombre: 'Hamburguesa Bufalos',            precio: '$32.500', desc: '340gr de carne, queso doble crema, queso cheddar, tocineta, chorizo caramelizado, tomate, cebolla grillet, lechuga, papa francesa' },
      { nombre: 'Hamburguesa Pedro y Gazu',       precio: '$34.500', desc: '170gr de carne, queso, arepa, pollo desmechado, tocineta, tomate, cebolla grillet, lechuga, papa francesa con pollo en trocitos, salchicha, chorizo, maíz y queso' },
    ],
  },
  papas: {
    label: 'Papas Locas',
    sub: null,
    items: [
      { nombre: 'Gazu',           precio: '$23.500', desc: 'Pollo en trocitos, maíz tierno y dulce, salchicha, chorizo y queso fundido, papa francesa' },
      { nombre: 'Super Gazu',     precio: '$26.500', desc: 'Pollo en trocitos, carne en trocitos, maíz tierno y dulce, salchicha, chorizo, queso fundido y papa francesa' },
      { nombre: 'Gazu Extremo',   precio: '$30.500', desc: 'Pollo en trocitos, carne en trocitos, maíz tierno y dulce, salchicha, chorizo, queso fundido, papa francesa' },
      { nombre: 'Gazu The Gordo', precio: '$33.500', desc: 'Pollo en trocitos, carne en trocitos, maíz tierno y dulce, salchicha, chorizo, champiñon, queso fundido y papa francesa' },
      { nombre: 'Gazu al Extremo',precio: '$36.500', desc: 'Pollo en trocitos, carne en trocitos, maíz tierno y dulce, salchicha, chorizo, champiñon, aros de cebolla apanados, huevo de codorniz, queso fundido, papa francesa' },
      { nombre: 'Gazu Quesuda',   precio: '$29.500', desc: 'Pollo en trocitos, carne en trocitos, maíz tierno y dulce, salchicha, chorizo, jamón picado, baño de queso fundido, chispas de tocineta, papa francesa' },
      { nombre: 'Gazu Cavernicola',precio:'$43.500', desc: 'Pollo en trocitos, carne en trocitos, maíz tierno y dulce, salchicha, chorizo, champiñon, aros de cebolla apanados, huevos de codorniz, nugget de robalo y queso fundido' },
      { nombre: 'Gazu Carnivora', precio: '$31.500', desc: 'Pollo en trocitos, carne en trocitos, cerdo en trocitos, maíz tierno y dulce, costilla de cerdo, baño de queso fundido, papa francesa' },
    ],
  },
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [seccion, setSeccion] = useState('inicio')
  const [tabMenu, setTabMenu] = useState('perros')
  const [busqueda, setBusqueda] = useState('')

  function scrollTo(id) {
    setNavOpen(false)
    setSeccion(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const categoriaActual = MENU_DATA[tabMenu]
  const itemsFiltrados = busqueda.trim()
    ? categoriaActual.items.filter(i =>
        i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        i.desc.toLowerCase().includes(busqueda.toLowerCase())
      )
    : categoriaActual.items

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
          <span>Horario</span>
          <strong>Lun–Vie · 4 pm – 12:30 am</strong>
        </div>
      </section>

      {/* ── MENÚ ── */}
      <section id="menu" className="menu-section">
        <div className="menu-section__inner">
          <span className="section-tag">Nuestro menú</span>
          <h2 className="section-title">¿Qué vas a pedir hoy?</h2>

          {/* Tabs */}
          <div className="menu-tabs">
            {Object.entries(MENU_DATA).map(([key, cat]) => (
              <button
                key={key}
                className={`menu-tab ${tabMenu === key ? 'menu-tab--active' : ''}`}
                onClick={() => { setTabMenu(key); setBusqueda('') }}
              >
                {cat.label}
                <span className="menu-tab__count">{cat.items.length}</span>
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="menu-search">
            <span className="menu-search__icon">⌕</span>
            <input
              className="menu-search__input"
              type="text"
              placeholder={`Buscar en ${categoriaActual.label}…`}
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="menu-search__clear" onClick={() => setBusqueda('')}>✕</button>
            )}
          </div>

          {/* Encabezado de categoría */}
          <div className="menu-cat-header">
            <h3 className="menu-cat-title">{categoriaActual.label}</h3>
            {categoriaActual.sub && (
              <span className="menu-cat-sub">+ {categoriaActual.sub}</span>
            )}
          </div>

          {/* Grid de items */}
          {itemsFiltrados.length === 0 ? (
            <p className="menu-empty">No hay resultados para "{busqueda}"</p>
          ) : (
            <div className="menu-list">
              {itemsFiltrados.map(item => (
                <div className="menu-item" key={item.nombre}>
                  <div className="menu-item__left">
                    <span className="menu-item__nombre">{item.nombre}</span>
                    <span className="menu-item__desc">{item.desc}</span>
                  </div>
                  <span className="menu-item__precio">{item.precio}</span>
                </div>
              ))}
            </div>
          )}
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
                  <span>Cra. 19 # 11-07, Bucaramanga</span>
                </div>
              </div>
              <div className="dato">
                <span className="dato__icon">🕐</span>
                <div>
                  <strong>Horario</strong>
                  <span>Lun – Vie · 4:00 pm – 12:30 am</span>
                </div>
              </div>
              <div className="dato">
                <span className="dato__icon">📞</span>
                <div>
                  <strong>Teléfono</strong>
                  <span>300 4536404</span>
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
          <p>© 2025 The Gordo · Comidas Rápidas · Bucaramanga</p>
        </div>
      </footer>

    </div>
  )
}
