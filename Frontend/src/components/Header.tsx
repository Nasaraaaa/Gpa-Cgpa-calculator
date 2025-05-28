import { GraduationCapIcon, CalculatorIcon, LogOutIcon } from "lucide-react";
export const Header = ({ handleLogout }: { handleLogout: () => void }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCapIcon size={32} />
          <h1 className="text-2xl font-poppins font-bold">GPA Compass</h1>
        </div>
        <div className="flex items-center gap-1">
          <CalculatorIcon size={20} />
          <span className="font-medium font-poppins">
            GPA & CGPA Calculator
          </span>
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOutIcon size={20} />
          <span className="font-poppins">Logout</span>
        </div>
      </div>
    </header>
  );
};
