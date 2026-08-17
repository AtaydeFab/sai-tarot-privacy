import { useState } from 'react'
import { useEstado, cambiarYo, agregarRecordatorio, borrarRecordatorio, reiniciar } from '../store'
import { Avatar, SelectorMiembro } from '../componentes'
import { MIEMBROS, miembro } from '../seed'
import type { MiembroId, Responsable } from '../types'

export default function Mas() {
  const estado = useEstado()
  const [texto, setTexto] = useState('')
  const [para, setPara] = useState<MiembroId>(estado.yo)

  const agregar = () => {
    if (!texto.trim()) return
    agregarRecordatorio({ texto: texto.trim(), para, permanente: true })
    setTexto('')
  }

  return (
    <>
      <header className="cab">
        <h1>Más</h1>
        <span className="sub">Juntos+ · versión 0.1</span>
      </header>

      <div className="panel">
        <span className="k">¿Quién está usando este teléfono?</span>
        <SelectorMiembro valor={estado.yo} onCambio={(v: Responsable) => { if (v !== 'ambos' && v !== 'turno') cambiarYo(v) }} />
        <p className="nota">
          Por ahora cada teléfono guarda lo suyo. En la siguiente entrega se conectan las cuentas
          y lo que uno palomea le aparece al otro al instante.
        </p>
      </div>

      <div className="seccion"><span>Recordatorios</span></div>
      {MIEMBROS.map(m => {
        const suyos = estado.recordatorios.filter(r => r.para === m.id)
        if (!suyos.length) return null
        return (
          <div className="panel" key={m.id}>
            <span className="k" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Avatar quien={m.id} chico /> {m.nombre}
            </span>
            {suyos.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 15 }}>{r.texto}</span>
                <button className="caja" type="button" aria-label={`Quitar ${r.texto}`}
                  onClick={() => borrarRecordatorio(r.id)} style={{ color: 'var(--muted)', width: 28, height: 28 }}>×</button>
              </div>
            ))}
            {m.id === estado.yo && <p className="nota">Solo tú los ves en tu pantalla de inicio.</p>}
          </div>
        )
      })}

      <div className="panel">
        <span className="k">Agregar recordatorio</span>
        <input className="campo" value={texto} onChange={e => setTexto(e.target.value)}
          placeholder="Por ejemplo: no dejar los zapatos regados" />
        <span className="etiqueta-campo">¿Para quién?</span>
        <SelectorMiembro valor={para} onCambio={(v: Responsable) => { if (v !== 'ambos' && v !== 'turno') setPara(v) }} />
        <button className="btn" type="button" onClick={agregar} disabled={!texto.trim()}>
          {para === estado.yo ? 'Guardar el mío' : `Proponérselo a ${miembro(para)?.nombre}`}
        </button>
        {para !== estado.yo && (
          <p className="nota">
            Cuando estén conectadas las cuentas, esto le va a llegar para aceptar: mientras no lo acepte,
            no se le muestra.
          </p>
        )}
      </div>

      <div className="seccion"><span>Lo que sigue</span></div>
      <div className="panel">
        <p className="nota" style={{ fontSize: 14 }}>
          <b style={{ color: 'var(--ink)' }}>Próxima entrega:</b> el dinero — ingresos, gastos fijos que entran solos,
          ahorro y el resumen del mes. Después: las cuentas de los cuatro y que todo se sincronice entre teléfonos.
        </p>
      </div>

      <div className="panel">
        <span className="k">Empezar de cero</span>
        <p className="nota">Borra lo palomeado y deja el machote como venía. Solo afecta este teléfono.</p>
        <button className="btn peligro" type="button"
          onClick={() => { if (confirm('¿Borrar todo lo de este teléfono y dejar el machote como venía?')) reiniciar() }}>
          Reiniciar
        </button>
      </div>
    </>
  )
}
