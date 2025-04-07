import Suggestions from "../components/Suggestions"

const HomePage = () => {
  return (
    <div className="w-full flex">
      <div className="w-full">
        <div>Horizontal scroll story</div>
        <div>Unlimited veritical scroller</div>
      </div>
      <Suggestions />
    </div>
  )
}

export default HomePage