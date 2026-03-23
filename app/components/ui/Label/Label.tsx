export const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) => {
  return <label className="font-semibold" htmlFor={htmlFor}>{children}</label>;
};
