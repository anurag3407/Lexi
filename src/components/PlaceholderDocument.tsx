'use client'
import { PlusCircleIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";

function PlaceholderDocument() {

	const router = useRouter();


		const handleClick = async () => {
			router.push('/dashboard/upload');
	}
  return (
	<Button onClick={handleClick} className ='flex flex-col items-center justify-center w-64 h-80 bg-gray-200 drop-shadow-md text-grey-400 rounded-xl '>

		<PlusCircleIcon className ="h-16 w-16" />
		<p>
			Add a document
		</p>
	</Button>
  )
}

export default PlaceholderDocument