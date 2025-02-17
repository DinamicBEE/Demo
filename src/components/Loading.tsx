import '../styles/Loading.css'

function Loading(){
    return(
        <div className='loading-container'>
            <div className='loader'>
                <div className='face face1'>
                    <div className='circle'></div>
                </div>
                <div className='face face2'>
                    <div className='circle'></div>
                </div>
            </div>
        </div>
    );
}

export default Loading;