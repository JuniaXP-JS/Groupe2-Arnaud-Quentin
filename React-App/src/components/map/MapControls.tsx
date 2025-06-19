import { MapControlsProps } from '@/types/map';

/**
 * MapControls component for toggling between real-time and history map views.
 *
 * - Renders a button to switch between real-time and history.
 * - Uses accessible ARIA roles and labels.
 *
 * @param {MapControlsProps} props - The props for the controls.
 * @param {() => void} props.toggleHistory - Function to toggle the view.
 * @param {boolean} props.showHistory - Whether the history view is active.
 * @returns {JSX.Element} The rendered map controls.
 */
export default function MapControls({ toggleHistory, showHistory }: MapControlsProps) {
    return (
        <div
            className="absolute top-4 right-4 z-10 flex flex-col gap-2"
            role="toolbar"
            aria-label="Contrôles de la carte"
        >
            <button
                onClick={toggleHistory}
                className="bg-white hover:bg-gray-50 text-white px-4 py-2 rounded-md shadow-md border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-200"
                aria-pressed={showHistory}
            >
                {showHistory ? 'Vue temps réel' : 'Historique'}
            </button>
        </div>
    );
}