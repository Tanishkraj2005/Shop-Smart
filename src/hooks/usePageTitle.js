import { useEffect } from 'react'
export default function usePageTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | Shop Smart` : 'Shop Smart — India\'s Smartest Store'
        return () => { document.title = 'Shop Smart — India\'s Smartest Store' }
    }, [title])
}
