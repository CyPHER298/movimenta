import { ArrowRight } from "lucide-react"

interface CompanyProps {
    name: string,
    people: number
    hi: string
}

export const CompanyCard = ({ name, people, hi}: CompanyProps) => {

    return (
        <div className="grid grid-cols-2 p-2 bg-(--branco) border border-(--cinza) rounded-lg">
            <h2>{name}</h2>
            <p>{people}</p>
            <p>{hi}</p>
            <ArrowRight/>
        </div>
    )
}