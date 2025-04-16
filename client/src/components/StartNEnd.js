/**
 * StartNEnd Component
 * 
 * This component renders two date input fields for "Start Date" and "End Date".
 * It allows users to edit the start and end dates for a specific item (e.g., education or experience).
 * 
 * Props:
 * - `startValue` (string): The current value for the start date.
 * - `endValue` (string): The current value for the end date.
 * - `index` (number): The index of the item being edited (used to identify the item in a list).
 * - `onChange` (function): A callback function to handle changes to the date fields.
 * 
 */
const StartNEnd = ({ startValue, endValue, index, onChange }) => {
    const date = (startOrEnd, value, index) => {
        return (
            <label>
                {startOrEnd} Date:
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(index, startOrEnd.toLowerCase(), e.target.value)}
                />
            </label>
        );
    };

    return (
        <>
        {date('Start', startValue, index)}
        {date('End', endValue, index)}
        </>
    ); 
};

export default StartNEnd;