import React from 'react';

const Dropdown = ({ label, name, options, value, onChange }) => {
    return (
        <div className="mb-2">
            <label className="form-label">{label}:</label>
            <select name={name} value={value} onChange={onChange} className="form-select">
                <option value="">Select an option</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;