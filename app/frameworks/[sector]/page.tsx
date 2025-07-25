export default function FrameworkPage({ params }: { params: { sector: string } }) {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <h1 className="text-4xl font-bold text-[#061F37] mb-4">
          {params.sector === "public" ? "Public Sector" : "Private Sector"} Framework
        </h1>
        <p className="text-gray-700">This is a placeholder page for the {params.sector} sector framework.</p>
      </div>
    </div>
  )
}
