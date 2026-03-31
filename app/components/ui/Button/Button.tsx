interface ButtonProps {
    children: React.ReactNode
}

export default function Button({ children }: ButtonProps) {
    return (
        <button className="">{children}</button>
    )
}