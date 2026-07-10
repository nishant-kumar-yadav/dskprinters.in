import { useState } from 'react'

export function ChipInput({ label, placeholder, values, onChange }) {
  const [input, setInput] = useState('')

  const addChip = () => {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addChip()
    }
    if (e.key === 'Backspace' && !input && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  const removeChip = (index) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="chip-input-wrap">
        {values.map((v, i) => (
          <span key={i} className="chip">
            {v}
            <button type="button" onClick={() => removeChip(i)} aria-label={`Remove ${v}`}>
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addChip}
          placeholder={values.length === 0 ? placeholder : ''}
        />
      </div>
    </div>
  )
}

export function SpecsEditor({ specs, onChange }) {
  const addRow = () => onChange([...specs, { key: '', value: '' }])

  const updateRow = (index, field, val) => {
    const updated = specs.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    onChange(updated)
  }

  const removeRow = (index) => onChange(specs.filter((_, i) => i !== index))

  return (
    <div className="field">
      <label>Specifications</label>
      <div className="specs-editor">
        {specs.map((s, i) => (
          <div key={i} className="spec-row">
            <input
              value={s.key}
              onChange={(e) => updateRow(i, 'key', e.target.value)}
              placeholder="e.g. Size"
            />
            <input
              value={s.value}
              onChange={(e) => updateRow(i, 'value', e.target.value)}
              placeholder="e.g. A4, A3, Custom"
            />
            <button
              type="button"
              className="btn btn-danger btn-sm spec-remove"
              onClick={() => removeRow(i)}
              aria-label="Remove spec"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addRow}>
          + Add Spec
        </button>
      </div>
    </div>
  )
}
