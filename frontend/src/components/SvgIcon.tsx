type IconProps = React.SVGProps<SVGSVGElement> & {
  name: string;
  className?: string;
};

export default function SvgIcon({ name, className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" {...props}>
      <use href={`/icons/${name}.svg#icon`} />
    </svg>
  );
}