import React, { useState, useEffect } from 'react';

export default function EditModal({ title, fields, initialValues, onSubmit, onClose }) {
  const [form, setForm] = useState(initialValues || {});

  useEffect(() => {
    setForm(initialValues || {});
  }, [initialValues]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h3 className="text-xl mb-4 font-bold">{title}</h3>
        {fields.map(({ name, label, type = 'text', options, ...rest }) => (
          <div className="mb-3" key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {options ? (
              <select
                className="input w-full"
                name={name}
                value={form[name] || ''}
                onChange={handleChange}
                {...rest}
              >
                <option value="">Select {label}</option>
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="input w-full"
                name={name}
                type={type}
                value={form[name] || ''}
                onChange={handleChange}
                {...rest}
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
