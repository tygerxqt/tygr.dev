export default function SlugLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="flex flex-col items-center justify-center w-full">
				{children}
			</div>
		</>
	);
}
