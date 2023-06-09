interface Props {
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	red?: boolean;
	white?: boolean;
	className?: string;
}

const def = "font-semibold rounded shadow-md ";
export default function Button({children, onClick, red, white, className}:Props) {
	let style = (red)
		? def + "border-2 border-red-700 bg-white hover:bg-red-700 text-black hover:text-white "
		: (white) ? def + "border-2 border-teal-700 hover:border-none bg-white hover:bg-teal-800 hover:text-white "
			: def + "bg-teal-700 text-white hover:bg-teal-800 ";
	style += (className) ? className : "w-72 h-11";
	return(
		<button onClick={onClick} className={style}>{children}</button>
	);
}
