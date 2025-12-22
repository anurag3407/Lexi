import { adminDb } from "../../../../../firbaseAdmin";
import { auth } from "../../../../../firebase";

async function ChatToFilePage({
    params : {id},
} : {
    params : {id : string}
}) {

    auth().protect();
    const {userId} = await auth();

    const ref = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(id)
        .get();

        const url = ref.data()?.downloadUrl;


        return <div className = 'grid lg:grid-cols-5 h-full overflow-hidden'>

            {/*Right*/}

            <div className = "col-span-5 lg:col-span-2 overflow-y-auto"> 
                {/*Chat */}
                <h2>Chat</h2>
                <div>
                    <p>Chat with the file owner</p>
                </div>
            </div>  
            <div className = "col-span-5 lg:col-span-3 overflow-y-auto">    
            <div> {/*File Viewer */}
                <h2>File Viewer</h2>
                <div>
                    <iframe src={url} width="100%" height="600px">
                    </iframe>
                </div>
            </div>
            <div> {/*Actions */}

        </div>  
        </div>
        {/*left */}
        <div> {/*Chat */}
            <h2>Chat</h2>
            <div>
                <p>Chat with the file owner</p>
            </div>
        </div>  
        <div> {/*File Viewer */}
            <h2>File Viewer</h2>
            <div>
                <iframe src={url} width="100%" height="600px">
                </iframe>
            </div>
        </div>  

    );  
}







export default ChatToFilePage;


