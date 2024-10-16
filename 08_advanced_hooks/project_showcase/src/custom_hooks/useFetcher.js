import { useState, useEffect } from "react";
import toast from "react-hot-toast"

// const useFetcher = (url) => {
//     const [data, setData] = useState(null)
// }

function useFetcher(url){
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchData(){
            setIsLoading(true)
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`)
                }
                const result = await response.json()
                setData(result)

            } catch (err) {
                setError(err.message)
                toast.error(err.message)
            } finally {
                setIsLoading(false)
            }

        }
        fetchData()
    }, [url])

    return { data, loading, error, setData }
}