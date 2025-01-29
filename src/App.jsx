import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import UpdateStock from "./pages/UpdateStock";
import AddProduct from "./pages/AddProduct";
import Sales from "./pages/Sales";
import Navbar from "./components/Navbar";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <SignedOut>
          <div className="min-h-screen   flex items-center justify-center p-4    bg-[#F0EFF1] xs:p-3">
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1   pt-16   pb-20   px-4  ">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/update-stock" element={<UpdateStock />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/sales" element={<Sales />} />
              </Routes>
            </main>
          </div>
        </SignedIn>
      </Router>
    </ClerkProvider>
  );
}

export default App;
