import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom React hook to determine if the viewport is considered mobile.
 *
 * - Uses a media query to detect if the window width is below the mobile breakpoint.
 * - Listens for window resize events and updates the state accordingly.
 *
 * @returns {boolean} True if the viewport is mobile, false otherwise.
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }
        mql.addEventListener("change", onChange)
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        return () => mql.removeEventListener("change", onChange)
    }, [])

    return !!isMobile
}