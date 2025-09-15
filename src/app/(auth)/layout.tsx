export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-[90vh] flex justify-center items-center">
      {children}
    </div>
  );
}
