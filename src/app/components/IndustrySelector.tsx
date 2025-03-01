import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiSearch, FiX } from "react-icons/fi";

interface Industry {
  id: string;
  name: string;
}

const IndustrySelector = () => {
  const router = useRouter();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all industries and user's selected industries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [industriesRes, userIndustriesRes] = await Promise.all([
          axios.get("/api/industries"),
          axios.get("/api/user-industries"),
        ]);

        setIndustries(industriesRes.data.industries);
        setSelectedIndustries(userIndustriesRes.data.userIndustries || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter industries based on search query
  const filteredIndustries = industries.filter(
    (industry) =>
      industry.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedIndustries.some((selected) => selected.id === industry.id)
  );

  // Add industry
  const handleSelectIndustry = (industry: Industry) => {
    if (selectedIndustries.length >= 3) {
      toast.error("You can select up to 3 industries");
      return;
    }
    setSelectedIndustries([...selectedIndustries, industry]);
    setSearchQuery("");
  };

  // Remove industry
  const handleRemoveIndustry = (industryId: string) => {
    setSelectedIndustries(
      selectedIndustries.filter((industry) => industry.id !== industryId)
    );
  };

  // Save selected industries
  const handleSave = async () => {
    try {
      await axios.post("/api/user-industries", {
        industryIds: selectedIndustries.map((industry) => industry.id),
      });
      toast.success("Industries saved successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving industries:", error);
      toast.error("Failed to save industries");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with logout button */}
      <header className="flex items-center justify-between bg-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold">Industry Selection</h1>
        <button
          onClick={handleLogout}
          className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
        >
          Logout
        </button>
      </header>

      <div className="mx-auto max-w-3xl p-6">
        {/* Main content */}
        <div className="rounded-lg bg-gray-800 p-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Tell about the industries you work in
          </h2>
          <p className="text-gray-400 text-center mb-6">
            To help us personalize your experience and grow visibility, choose
            up to 3 pre-defined using the search:
          </p>

          {/* Search input */}
          <div className="relative mb-6">
            <div className="relative rounded-lg bg-gray-700 mb-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                className="w-full rounded-lg bg-gray-700 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type an industry name to add"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdown for search results */}
            {searchQuery && filteredIndustries.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-gray-700 shadow-lg">
                <ul className="max-h-60 overflow-auto py-1">
                  {filteredIndustries.map((industry) => (
                    <li
                      key={industry.id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-600"
                      onClick={() => handleSelectIndustry(industry)}
                    >
                      {industry.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Selected industries */}
          <div className="mb-6">
            {selectedIndustries.length > 0 ? (
              <div>
                <p className="mb-2 text-sm">
                  You selected ({selectedIndustries.length} out of 3):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustries.map((industry) => (
                    <div
                      key={industry.id}
                      className="flex items-center rounded-full bg-purple-600 px-3 py-1"
                    >
                      <span className="mr-1">{industry.name}</span>
                      <button
                        onClick={() => handleRemoveIndustry(industry.id)}
                        className="ml-1 rounded-full p-1 hover:bg-purple-700"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-400">Untap to remove.</p>
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Please use search to choose up to 3 industries.
              </p>
            )}
          </div>

          {/* Continue button */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={selectedIndustries.length === 0}
              className={`w-full rounded-md py-3 font-medium transition-colors ${
                selectedIndustries.length > 0
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelector;
