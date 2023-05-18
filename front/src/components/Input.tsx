interface Props {
	placeHolder: string;
	inputID: string;
	type?: string;
	opacity?: number;
	labelText?: string;
	value?: any;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

const styling = "box-border h-11 w-72 rounded border-solid border-gray-300 border";

export default function Input(props: Props) {
	return (
		<div className="flex flex-col">
			{props.labelText ? (
				<label htmlFor={props.inputID}>{props.labelText}</label>
			) : null}
			<input
				type={props.type}
				style={{ opacity: props.opacity }}
				id={props.inputID}
				placeholder={props.placeHolder}
				className={styling}
				value={props.value}
				onChange={props.onChange}
			></input>
		</div>
	);
}