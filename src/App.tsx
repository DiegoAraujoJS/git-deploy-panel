import './App.css'

function App() {
    const Info = (props: {
        app: string
        branch: string
        lastBuild: string
        status: "actualizada" | "desactualizada"
    }) =>
        <div className="grid grid-cols-4 gap-3 bg-gray-100 h-10 content-center">
            <p className="text-gray-700 font-bold">
                App: {props.app}
            </p>
            <p className="text-gray-700 font-bold">
                branch: {props.branch}
            </p>
            <p className="text-gray-700 font-bold">
                Último build: {props.lastBuild}
            </p>
            <p className="text-gray-700 font-bold">
                Estado: {props.status}
            </p>
        </div>

    const Actions = () =>
        <div className='grid grid-cols-2'>
        </div>

    return (
        <div className='grid grid-rows-2 gap-5'>
            <Info app="test" branch='dev' lastBuild='14/12' status='desactualizada' />
            <Info app='cloud' branch='master' lastBuild='23/11' status='actualizada' />
        </div>
    )
}

export default App
