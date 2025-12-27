import Documents from "@/components/documents";
import FileCounter from "@/components/FileCounter";

export const dynamic = 'force-dynamic';


function Dashboard() {
  return (
    <div className='min-h-full max-w-7xl mx-auto px-6 py-8'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className='text-2xl font-semibold text-white'>
            My Documents
          </h1>
          <p className="text-[#666666] text-sm mt-1">
            Upload and chat with your PDF files
          </p>
        </div>
        <FileCounter />
      </div>

      <Documents />
    </div>
  )
}

export default Dashboard