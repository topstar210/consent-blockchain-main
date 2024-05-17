import { Hourglass } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div className='d-flex justify-content-center'><Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={['black', 'black']}
        /></div>
    )
}

export default Loader