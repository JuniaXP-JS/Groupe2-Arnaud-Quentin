import React from "react";
import { Card } from "../../components/ui/card";

/**
 * Footer component displaying copyright and site information.
 *
 * @returns {JSX.Element} The rendered footer.
 */
const Footer: React.FC = () => {
    return (
        <Card
            className="bg-white text-black py-4 border-t border-b-0 border-gray-700 rounded-none flex-shrink-0 mt-auto"
            role="contentinfo"
            aria-label="Informations du site"
            tabIndex={0}
        >
            <div className="flex justify-between items-center px-4">
                <div className="text-center text-xs text-gray-500">
                    <span aria-label={`Copyright ${new Date().getFullYear()}`}>
                        © {new Date().getFullYear()} Shinkansen.dev
                    </span>
                    . Tous droits réservés.
                </div>
            </div>
        </Card>
    );
};

export default Footer;