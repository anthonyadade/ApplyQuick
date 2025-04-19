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
 * - `labelClass` (string, optional): A CSS class to apply to the labels.
 */
const StartNEnd = ({ startValue, endValue, index, onChange, labelClass = "" }) => {
    const date = (startOrEnd, value, index) => {
        const labelClasses = `form-label ${labelClass}`.trim();
        return (
            <div>
                <label className={labelClasses}>
                    {startOrEnd} Date:
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => onChange(index, startOrEnd.toLowerCase(), e.target.value)}
                        className="form-control"
                    />
                </label>
            </div>
        );
    };

    return (
        <div className="row">
            <div className="col-md-6">
                {date('Start', startValue, index)}
            </div>
            <div className="col-md-6">
                {date('End', endValue, index)}
            </div>
        </div>
    );
};

export default StartNEnd;