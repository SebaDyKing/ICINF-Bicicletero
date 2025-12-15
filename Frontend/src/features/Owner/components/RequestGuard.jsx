import HeaderOwner from '../components/HeaderOwner'

const RequestGuard = ({user}) =>{
    return (
        <div>
            <HeaderOwner user={user} />
            <h1>Solicitar guardia</h1>
        </div>
    )
}

export default RequestGuard;