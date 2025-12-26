import Documents from "@/components/documents";
import FileCounter from "@/components/FileCounter";

export const dynamic = 'force-dynamic';


function Dashboard() {
  return (
    <div className='h-full max-w-7xl mx-auto '>
      <div className="flex justify-between items-center p-5 bg-grey-100">
        <h1 className='text-3xl font-extralight text-indigo-600'>
          My Documents
        </h1>
        <FileCounter />
      </div>

      <Documents />
    </div>
  )
}

export default Dashboard