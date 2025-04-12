import React from 'react';

const Dropdown = ({ label, name, options, value, onChange }) => {
    return (
        <label>
            {label}:
            <select name={name} value={value} onChange={onChange}>
                <option value="">Select an option</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default Dropdown;