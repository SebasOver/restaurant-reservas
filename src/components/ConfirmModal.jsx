export default function ConfirmModal({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div
      className="adm-overlay"
      onClick={e => { if (e.target === e.currentTarget) onCancelar() }}
    >
      <div className="adm-modal" style={{ maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
        <h2 className="adm-modal__title" style={{ marginBottom: '0.5rem' }}>
          ¿Confirmar eliminación?
        </h2>
        <p style={{ color: 'var(--a-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {mensaje}
        </p>
        <div className="adm-modal__actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirmar}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
